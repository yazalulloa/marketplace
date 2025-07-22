

export const vpc = new sst.aws.Vpc("MyVpc", {
  // az: 2,
  az: ["us-east-1a", "us-east-1b"]
});


export const cluster = new sst.aws.Cluster("MyCluster", {vpc});