import { Resource } from "sst";
import { Context, Handler, APIGatewayProxyEvent } from "aws-lambda";
import { Example } from "@marketplace/core/example";

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  // proxy http request to http://localhost:8080

  console.log("Event: ", event);

  return {
    statusCode: 200,
    body: `${Example.hello()} Linked to ${Resource.MyBucket.name}.`,
  };
};
