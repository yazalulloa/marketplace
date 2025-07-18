
import {DEV_STAGE, isLocal, PROD_STAGE} from "./util";



// export const allowedOrigins = isLocal ? ["http://localhost:5173"] : [`https://${domain}`];
export const allowedOrigins =  ["http://localhost:5173"];

export const myRouter = new sst.aws.Router("MyRouter", {
  // domain: {
  //   name: domain,
  //   aliases: [`*.${domain}`],
  //   // dns: sst.aws.dns({override: true}),
  // },
  transform: {
    cdn: (args) => {
      args.transform = {
        distribution: (disArgs) => {
          disArgs.httpVersion = "http2and3";
        }
      }
    }
  }
});