import {bcvBucket} from "./storage";

export const bcvFunction = new sst.aws.Function("BcvFunction", {
  url: true,
  link: [bcvBucket],
  runtime: "go",
  handler: "packages/backend/golang/marketplace/cmd/bcv-job/bcv-job.go",
  timeout: "90 seconds",
});
// https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html
export const bcvCron = new sst.aws.Cron("bcv-cron", {
  schedule: "cron(0/15 18-23 ? * MON-FRI *)",
  // schedule: "cron(0/15 * * * ? *)",
  function: bcvFunction.arn,
});


export const bcvQueue = new sst.aws.Queue("BcvQueue", {
  //not supported for S3 notifications
  fifo: false,
  visibilityTimeout: "300 seconds",
});

export const processBcvFileFunction = new sst.aws.Function("ProcessBcvFile", {
  link: [bcvBucket, bcvQueue],
  runtime: "go",
  handler: "packages/backend/golang/marketplace/cmd/process-bcv-file/process-bcv-file.go",
  timeout: "90 seconds",
});

bcvQueue.subscribe(processBcvFileFunction.arn);
bcvBucket.notify({
  notifications: [
    {
      name: "ProcessFileSubscriber",
      queue: bcvQueue,
      events: ["s3:ObjectCreated:Put", "s3:ObjectCreated:Post"],
    },
  ],
});