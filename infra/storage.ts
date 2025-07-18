export const bucket = new sst.aws.Bucket("MyBucket");



export const webAssetsBucket = new sst.aws.Bucket("WebAssetsBucket", {
  access: "cloudfront",
});