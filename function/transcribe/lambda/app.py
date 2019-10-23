import botocore.session
import json
import time
import requests
import os

DEFAULT_REGION = 'us-west-2'
region = os.environ.get('AWS_DEFAULT_REGION') or DEFAULT_REGION


def transcribe_it(transcribe_client, job_name, job_uri):
    return transcribe_client.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': job_uri},
        MediaFormat='mp4',
        LanguageCode='zh-CN'
    )


def upload_result(s3_client, bucket_name, fn, body):
    s3_client.put_object(Bucket=bucket_name, Key=fn, Body=body)


def get_transcribe_result(url):
    r = requests.get(url).text
    return r


def get_filenames(kn):
    file_basename = kn[kn.rfind('/')+1:]  # e.g. abc.mp4
    if kn.rfind('/') == -1:
        file_dirname = ''
    else:
        file_dirname = kn[:kn.rfind('/')]  # e.g. /aaa/bbb/ccc
    file_basename_zhcn = file_basename[:file_basename.rfind(
        '.')]+'.zh_CN'+file_basename[file_basename.rfind('.'):]  # e.g. abc.zh_CN.mp4
    file_basename_zhtw = file_basename[:file_basename.rindex(
        '.')]+'.zh_TW'+file_basename[file_basename.rfind('.'):]  # e.g. abc.zh_TW.mp4
    return (file_dirname.strip(), file_basename.strip(), file_basename_zhcn.strip(), file_basename_zhtw.strip())


def process(items):
    i = 1
    output = ''
    isStart = False
    isEnd = False
    start_time = 0
    end_time = 0
    msg = ''
    for index, item in enumerate(items):
        if (not item.__contains__('start_time')):
            msg = msg+item['alternatives'][0]['content']
        else:
            end_time = float(item['end_time'])
        if (end_time-start_time > 4.0 or index+1 == len(items)):
            isEnd = True
        if (not isStart and item.__contains__('start_time')):
            isStart = True
            start_time = float(item['start_time'])
            msg = msg+item['alternatives'][0]['content']
            output = output+str(i)+'\n'
            continue
        if (isStart and not isEnd and item.__contains__('start_time')):
            msg = msg+item['alternatives'][0]['content']
        if (isStart and isEnd):
            hour = int(start_time/60/60)
            min = int(start_time/60)-hour*60
            sec = int(start_time)-min*60-hour*60*60
            msec = int((start_time-sec)*1000)
            e_hour = int(end_time/60/60)
            e_min = int(end_time/60)-e_hour*60
            e_sec = int(end_time)-e_min*60-e_hour*60*60
            e_msec = int((end_time-sec)*1000)
            msg1 = '{}:{}:{},{} --> {}:{}:{},{}'.format(hour, min, sec, msec, e_hour, e_min, e_sec, e_msec)+'\n'
            output = output + msg1 + msg + item['alternatives'][0]['content'] + '\n\n'
            i += 1
            isStart = False
            isEnd = False
            start_time = end_time
            msg = ''
    return output


def s3_upload_handler(event, context, transcribe_client):
    print(event)
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    kn = event['Records'][0]['s3']['object']['key']
    print("[INFO] - bucket_name: {} key_name: {}".format(bucket_name, kn))
    (file_dirname, file_basename, file_basename_zhcn, file_basename_zhtw) = get_filenames(kn)
    job_uri = 's3://%s/%s' % (bucket_name, kn)
    now = int(time.time())
    job_name = "transcribe-"+str(now)
    print("job_name: {}".format(job_name))
    transcribe_it(transcribe_client, job_name, job_uri)


def transcribe_complete_handler(transcribe_client, session, job_name, bucket_name, sns_client=None, sns_topic_arn=None):
    status = transcribe_client.get_transcription_job(TranscriptionJobName=job_name)
    if (status['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED'):
        url = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
        media_file_uri = status['TranscriptionJob']['Media']['MediaFileUri']
        kn = media_file_uri[media_file_uri.rfind('/')+1:-1]
        (file_dirname, file_basename, file_basename_zhcn, file_basename_zhtw) = get_filenames(kn)
        resp_text = get_transcribe_result(url)
        resp_json = json.loads(resp_text)
        print(resp_json["results"]["items"])
        output = process(resp_json["results"]["items"])
        s3_client = session.create_client('s3', region_name=region)
        fn_srt_zhcn = file_basename_zhcn[:file_basename_zhcn.rfind('.')]+'.srt'
        print('=> uploading srt to s3://%s/%s' % (bucket_name, file_dirname+'/output/'+fn_srt_zhcn))
        new_fn = '{}/output/{}'.format(file_dirname, fn_srt_zhcn).lstrip('/')
        print('[INFO] - saving to %s' % new_fn)
        upload_result(s3_client, bucket_name, new_fn, output)
        if sns_client and sns_topic_arn:
            sns_client.publish(TopicArn=sns_topic_arn,
                               Message='[INFO] - Transcription {} SRT result saved at s3://{}/{}'.format(
                                   job_name, bucket_name, new_fn))

    else:
        print('TranscriptionJobStatus Error')


def lambda_handler(event, context):
    print(json.dumps(event))

    bucket_name = os.environ.get('BUCKET_NAME')
    sns_topic_arn = os.environ.get('SNS_TOPIC_ARN')
    session = botocore.session.get_session()
    transcribe_client = session.create_client('transcribe')
    sns_client = session.create_client('sns')

    if event.__contains__('Records') and event['Records'][0]['eventSource'] == 'aws:s3':
        print('[INFO] - S3 upload event received')
        kn = event['Records'][0]['s3']['object']['key']
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        if kn.lower().endswith('.mp4') or kn.lower().endswith('.avi') or kn.lower().endswith('.mov'):
            sns_client.publish(TopicArn=sns_topic_arn,
                               Message='[INFO] - Got incoming media file s3://{}/{}'.format(bucket_name, kn))
            s3_upload_handler(event, context, transcribe_client)
        elif kn.lower().endswith('.srt'):
            sns_client.publish(TopicArn=sns_topic_arn, Message='[INFO] - Got SRT file - ignoring it')
            print('[INFO] - Got SRT file s3://{}/{} - ignoring it'.format(bucket_name, kn))
        else:
            print('[INFO] - Got unknown file: s3://{}/{}'.format(bucket_name, kn))
            sns_client.publish(TopicArn=sns_topic_arn,
                               Message='[INFO] - Got unknown file: s3://{}/{}'.format(bucket_name, kn))
    elif event.__contains__('source') and event['source'] == 'aws.transcribe':
        print('[INFO] - Transcribe event received')
        job_name = event['detail']['TranscriptionJobName']
        transcribe_complete_handler(transcribe_client, session, job_name, bucket_name,
                                    sns_client=sns_client, sns_topic_arn=sns_topic_arn)
        sns_client.publish(TopicArn=sns_topic_arn, Message='[INFO] - Transcription job {}  completed'.format(job_name))
    else:
        print('[ERROR] - Unknown event')
    return {
        'statusCode': 200,
        'body': 'OK'
    }
