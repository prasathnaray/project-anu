$ErrorActionPreference = 'Stop'
function AwsJson($Arguments) {
  $result = & aws @Arguments --output json
  if ($LASTEXITCODE -ne 0) { throw "AWS command failed: $($Arguments[0..1] -join ' ')" }
  if ($result) { return ($result | ConvertFrom-Json) }
}
$bucket = 'project-anu-frontend-299822065337-ap-south-1'
$null = AwsJson @('s3api','create-bucket','--bucket',$bucket,'--region','ap-south-1','--create-bucket-configuration','LocationConstraint=ap-south-1')
$null = AwsJson @('s3api','put-public-access-block','--bucket',$bucket,'--public-access-block-configuration','BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true')
$null = AwsJson @('s3api','put-bucket-versioning','--bucket',$bucket,'--versioning-configuration','Status=Enabled')
$oacConfig = @{Name='project-anu-frontend';Description='Private frontend origin';SigningProtocol='sigv4';SigningBehavior='always';OriginAccessControlOriginType='s3'}
$oacConfig | ConvertTo-Json -Depth 10 | Set-Content tmp/frontend-oac.json
$oac = AwsJson @('cloudfront','create-origin-access-control','--origin-access-control-config','file://tmp/frontend-oac.json')
$config = @{
 CallerReference="anu-frontend-$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
 Comment='Project ANU React frontend';Enabled=$true;DefaultRootObject='index.html';PriceClass='PriceClass_100'
 Origins=@{Quantity=1;Items=@(@{Id='frontend-s3';DomainName="$bucket.s3.ap-south-1.amazonaws.com";OriginAccessControlId=$oac.OriginAccessControl.Id;S3OriginConfig=@{OriginAccessIdentity=''}})}
 DefaultCacheBehavior=@{TargetOriginId='frontend-s3';ViewerProtocolPolicy='redirect-to-https';Compress=$true;TrustedSigners=@{Enabled=$false;Quantity=0};ForwardedValues=@{QueryString=$false;Cookies=@{Forward='none'}};MinTTL=0;DefaultTTL=300;MaxTTL=31536000}
 CustomErrorResponses=@{Quantity=2;Items=@(@{ErrorCode=403;ResponsePagePath='/index.html';ResponseCode='200';ErrorCachingMinTTL=0},@{ErrorCode=404;ResponsePagePath='/index.html';ResponseCode='200';ErrorCachingMinTTL=0})}
 ViewerCertificate=@{CloudFrontDefaultCertificate=$true}
}
$config | ConvertTo-Json -Depth 20 | Set-Content tmp/frontend-distribution.json
$distribution = (AwsJson @('cloudfront','create-distribution','--distribution-config','file://tmp/frontend-distribution.json')).Distribution
@{Bucket=$bucket;Id=$distribution.Id;Domain=$distribution.DomainName;Arn=$distribution.ARN} | ConvertTo-Json | Set-Content tmp/frontend-deployment.json
$policy = @{Version='2012-10-17';Statement=@(@{Effect='Allow';Principal=@{Service='cloudfront.amazonaws.com'};Action='s3:GetObject';Resource="arn:aws:s3:::$bucket/*";Condition=@{StringEquals=@{'AWS:SourceArn'=$distribution.ARN}}})}
$policy | ConvertTo-Json -Depth 10 | Set-Content tmp/frontend-policy.json
$null = AwsJson @('s3api','put-bucket-policy','--bucket',$bucket,'--policy','file://tmp/frontend-policy.json')
Get-Content tmp/frontend-deployment.json
