
# fargate-flask

This sample creates a `Flask` app running in AWS Fargate with ALB.


# Prepare your virtualenv
check [here](/python/README.md#prepare-your-virtualenv)

# Prepare your flask-docker-app

```bash
$ cd flask-docker-app
$ python3 -m venv .env
$ source .env/bin/activate
$ pip install -r requirements.txt
```

# Deploy the Stack

```bash
$ cd cdk-samples/python
$ cdk synth -c region=ap-northeast-1 cdk-py-fargate-flask
$ cdk deploy -c region=ap-northeast-1 cdk-py-fargate-flask
```

![](https://pbs.twimg.com/media/ED7YUbfU4AAth_r?format=jpg&name=4096x4096)
![](https://pbs.twimg.com/media/ED7YUp6UcAEVcDj?format=jpg&name=4096x4096)
(check my [tweet](https://twitter.com/pahudnet/status/1170610816971706368) or [weibo](https://www.weibo.com/6122137868/I5ZzTjcGu))
