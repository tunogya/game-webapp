# zip index.js to deploy.zip
zip -r deploy.zip index.js
# deploy to lambda
aws lambda update-function-code --function-name wizardingpay-telegram-bot --zip-file fileb://deploy.zip --region ap-northeast-1
# remove deploy.zip
rm deploy.zip
# echo done
echo "done"
