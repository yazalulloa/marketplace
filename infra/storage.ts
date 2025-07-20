export const bucket = new sst.aws.Bucket("MyBucket");


export const webAssetsBucket = new sst.aws.Bucket("WebAssetsBucket", {
  access: "cloudfront",
});

export const bcvBucket = new sst.aws.Bucket("BcvBucket", {
  versioning: false,
});