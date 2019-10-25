

# Usage

```bash
# 1. open another terminal and run 'npm run watch'
# 2. manual sam package and copy the CodeUri from the returned yaml
$ cd demoApp
$ sam package --s3-bucket YOUR_S3_STAGE_BUCKET
# 3. list
$ cdk list --app lib/index.js
# 3. deploy
$ cdk deploy --app lib/index.js Samdemo
```

