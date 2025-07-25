import {bcvBucket, database, webAssetsBucket} from "./storage";
import {isLocal} from "./util";
import {allowedOrigins, myRouter} from "./domain";
import {cluster, vpc} from "./server";


// const javaServicePort = 8080;

// export const javaService = new sst.aws.Service("JavaService", {
//   cluster,
//   link: [webAssetsBucket, database, bcvBucket],
//   image: {
//     context: "./packages/backend/java/marketplace",
//     dockerfile: "Dockerfile.jvm"
//   },
//   capacity: $app.stage === "production" ? undefined : "spot",
//   serviceRegistry: {
//     port: javaServicePort
//   },
//   loadBalancer: isLocal ? {
//     rules: [
//       {listen: `${javaServicePort}/http`},
//     ]
//   } : undefined,
//   dev: {
//     url: `http://localhost:${javaServicePort}`,
//     command: "quarkus dev", // Your local dev command here
//   },
//   environment: {
//     JAVA_SERVICE_PORT: javaServicePort.toString(),
//     APP_DB_USERNAME: database.username,
//     APP_DB_PASSWORD: database.password,
//     APP_DB_HOST: database.host,
//     APP_DB_PORT: database.port.apply(v => `${v}`),
//     APP_DB_NAME: database.database,
//   },
// });

// const bcvTask = new sst.aws.Task("BcvTask", {
//   cluster,
//   link: [bucket],
//   dev: {
//     command: "node index.mjs",
//   },
// });


// export const myApi = new sst.aws.Function("MyApi", {
//   url: true,
//   link: [bucket],
//   handler: "packages/functions/src/api.handler"
// });

export const golangApi = new sst.aws.Function("GolangApi", {
  vpc,
  url: true,
  handler: "packages/backend/golang/marketplace/cmd/app/app.go",
  runtime: "go",
  link: [database],
})

// const api = new sst.aws.ApiGatewayV2("API", {
//   // domain: {
//   //   name: apiDomain,
//   //   dns: sst.aws.dns({override: true}),
//   // },
//   vpc,
//   accessLog: {
//     retention: "1 month",
//   },
//   cors: {
//     allowOrigins: allowedOrigins,
//     allowMethods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
//     allowHeaders: [
//       "Authorization",
//       "Content-Type",
//       "hx-current-url",
//       "hx-request",
//       "hx-trigger",
//       "hx-target",
//       "Location",
//       "X-Recaptcha-Token",
//     ],
//     // allowCredentials: true,
//     maxAge: isLocal ? "1 minute" : "1 day",
//     exposeHeaders: ["HX-Redirect", "hx-location", "hx-trigger"],
//   },
// });

// myRouter.route("/api", api.url);
// api.route("GET /api/g/{proxy+}", golangApi.arn);
// api.route("POST /api/g/{proxy+}", golangApi.arn);
// api.route("PUT /api/g/{proxy+}", golangApi.arn);
// api.route("DELETE /api/g/{proxy+}", golangApi.arn);


// if (!isLocal) {
//
//   api.routePrivate("GET /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);
//   api.routePrivate("POST /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);
//   api.routePrivate("PUT /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);
//   api.routePrivate("DELETE /api/j/{proxy+}", javaService.nodes.cloudmapService.arn);
// }

new sst.aws.Nextjs("DakaApp", {
  vpc,
  path: "packages/frontend/daka-v2",
  router: {
    instance: myRouter,
    // domain: subdomain("kyo-bot"),
  },
  environment: {
    APP_IS_DEV: isLocal.toString(),
  },
  link: [database],
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

// export const oldWebApp = new sst.aws.StaticSite("OldWebApp", {
//   path: "packages/frontend/daka",
//   router: {
//     instance: myRouter,
//     // domain: subdomain("kyo-bot"),
//   },
//   environment: {
//     VITE_IS_DEV: isLocal.toString(),
//     VITE_GOLANG_API_URL: api.url,
//     // VITE_JAVA_API_URL: isLocal ? javaService.url : undefined,
//   },
//   build: {
//     command: "bun run build",
//     output: "dist",
//   },
//   assets: {
//     bucket: webAssetsBucket.name,
//     fileOptions: [
//       {
//         files: "index.html",
//         cacheControl: "max-age=0,no-cache,must-revalidate,public"
//       },
//       {
//         files: ["**/*"],
//         ignore: ["index.html", "isr/**/*"],
//         cacheControl: "public,max-age=31536000,immutable",
//       },
//     ],
//   },
//   transform: {
//     cdn: (args) => {
//
//       args.transform = {
//         distribution: (disArgs) => {
//           disArgs.httpVersion = "http2and3";
//         }
//
//       }
//     }
//   },
// });