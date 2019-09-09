
# fargate-flask

This sample creates a `Flask` app running in AWS Fargate with ALB.

Creaet the virtualenv.

```
$ python3 -m venv .env
```

After the init process completes and the virtualenv is created, you can use the following
step to activate your virtualenv.

```
$ source .env/bin/activate
```

If you are a Windows platform, you would activate the virtualenv like this:

```
% .env\Scripts\activate.bat
```

Once the virtualenv is activated, you can install the required dependencies.

```
$ pip install -r requirements.txt
```


# Prepare for flask-docker-app

```bash
$ cd flask-docker-app
$ python3 -m venv .env
$ source .env/bin/activate
$ pip install -r requirements.txt
```


# Deploy the Stack

```bash
$ cd fargate-flask
$ cdk synth -c region=REGION
$ cdk deploy -c region=REGION
```


![](https://pbs.twimg.com/media/ED7YUbfU4AAth_r?format=jpg&name=4096x4096)
![](https://pbs.twimg.com/media/ED7YUp6UcAEVcDj?format=jpg&name=4096x4096)
(check my [tweet](https://twitter.com/pahudnet/status/1170610816971706368) or [weibo](https://www.weibo.com/6122137868/I5ZzTjcGu))
