import {vpc} from "./server";

export const bucket = new sst.aws.Bucket("MyBucket");


export const webAssetsBucket = new sst.aws.Bucket("WebAssetsBucket", {
  access: "cloudfront",
});

export const bcvBucket = new sst.aws.Bucket("BcvBucket", {
  versioning: false,
});

export const database = new sst.aws.Mysql("MyDatabase", {
  vpc,
  version: "8.4.5",
  dev: {
    username: "root",
    password: "password",
    database: "marketplace",
    port: 3306
  }
});