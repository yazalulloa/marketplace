import {bucket, webAssetsBucket} from "./storage";
import {isLocal} from "./util";
import {allowedOrigins, myRouter} from "./domain";

const vpc = new sst.aws.Vpc("MyVpc");
const cluster = new sst.aws.Cluster("MyCluster", { vpc });

const javaService = new sst.aws.Service("JavaService", {
  cluster,
  image: {
    context: "./packages/backend/java/marketplace",
    dockerfile: "Dockerfile.jvm"
  },
  capacity: "spot",
  serviceRegistry: {
    port: 8080
  },
});



export const myApi = new sst.aws.Function("MyApi", {
  url: true,
  link: [bucket],
  handler: "packages/functions/src/api.handler"
});

export const golangApi = new sst.aws.Function("GolangApi", {
  handler: "packages/backend/golang/marketplace/cmd/app/app.go",
  runtime: "go",
})

const api = new sst.aws.ApiGatewayV2("API", {
  // domain: {
  //   name: apiDomain,
  //   dns: sst.aws.dns({override: true}),
  // },
  vpc,
  accessLog: {
    retention: "1 month",
  },
  cors: {
    allowOrigins: allowedOrigins,
    allowMethods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [
      "Authorization",
      "Content-Type",
      "hx-current-url",
      "hx-request",
      "hx-trigger",
      "hx-target",
      "Location",
      "X-Recaptcha-Token",
    ],
    // allowCredentials: true,
    maxAge: isLocal ? "1 minute" : "1 day",
    exposeHeaders: ["HX-Redirect", "hx-location", "hx-trigger"],
  },
});

myRouter.route("/api", api.url);
api.route("GET /api/g/{proxy+}", golangApi.arn);
api.route("POST /api/g/{proxy+}", golangApi.arn);
api.route("PUT /api/g/{proxy+}", golangApi.arn);
api.route("DELETE /api/g/{proxy+}", golangApi.arn);

api.routePrivate("GET /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);
api.routePrivate("POST /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);
api.routePrivate("PUT /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);
api.routePrivate("DELETE /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);

//
// api.route("GET /api/j/{proxy+}", javaService.url);
// api.route("POST /api/j/{proxy+}", javaService.url);
// api.route("PUT /api/j/{proxy+}", javaService.url);
// api.route("DELETE /api/j/{proxy+}", javaService.url);


export const dakaWebApp = new sst.aws.StaticSite("DakaWebApp", {
  path: "packages/frontend/daka",
  router: {
    instance: myRouter,
    // domain: subdomain("kyo-bot"),
  },
  environment: {
    VITE_IS_DEV: isLocal.toString(),
    VITE_GOLANG_API_URL: api.url,
  },
  build: {
    command: "bun run build",
    output: "dist",
  },
  assets: {
    bucket: webAssetsBucket.name,
    fileOptions: [
      {
        files: "index.html",
        cacheControl: "max-age=0,no-cache,must-revalidate,public"
      },
      {
        files: ["**/*"],
        ignore: ["index.html", "isr/**/*"],
        cacheControl: "public,max-age=31536000,immutable",
      },
    ],
  },
  transform: {
    cdn: (args) => {

      args.transform = {
        distribution: (disArgs) => {
          disArgs.httpVersion = "http2and3";
        }

      }
    }
  },
});