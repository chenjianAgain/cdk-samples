# cdk-samples in Python

A curated list of AWS CDK samples in **Python**. Check [app.py](./app.py) for usages.

Make sure you enter the `virtualenv` and `pip install` all required modules in `requirements.txt`. 

## Prepare your virtualenv

```bash
$ cd cdk-samples/python
# install the virtualenv
$ python3 -m venv .venv
# enter the virtualenv
$ source .venv/bin/activate
# install all required packages
$ pip install -r requirements.txt
# list all available stacks
$ cdk list
# Now you can 'cdk deploy' your favorite stack from the list
# e.g. cdk deploy -c region=ap-northeast-1 cdk-py-fargate-flask
```



# Available Samples

- [x] **cdk-py-fargate-flask** - Flask app running in AWS Fargate with ALB([README](fargate_flask.README.md))
- [x] **cdk-py-eks-cluster** - Amaozn EKS cluster and nodegroup(s)






