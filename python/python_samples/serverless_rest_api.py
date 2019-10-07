from aws_cdk import core, aws_apigateway, aws_lambda


class CdkPyServerlessRestApiStack(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        backend = aws_lambda.Function(self, 'Func',
                                      code=aws_lambda.Code.from_asset('../function/hello-world'),
                                      handler='lambda_function.handler',
                                      runtime=aws_lambda.Runtime.PYTHON_3_7
                                      )

        aws_apigateway.LambdaRestApi(self, 'RestApi', handler=backend)
