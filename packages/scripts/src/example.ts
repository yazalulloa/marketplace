import { Resource } from "sst";
import { Example } from "@marketplace/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
