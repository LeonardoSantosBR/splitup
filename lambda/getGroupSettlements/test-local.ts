import "dotenv/config";
import { handler } from "./handler";

const result = await handler({
  queryStringParameters: {
    groupId: "group_id",
  },
  headers: {
    "x-internal-token": process.env.LAMBDA_INTERNAL_TOKEN,
  },
});

console.log(result);
