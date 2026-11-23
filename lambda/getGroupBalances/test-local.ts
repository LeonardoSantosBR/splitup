import "dotenv/config";
import { handler } from "./handler";

const result = await handler({
  queryStringParameters: {
    groupId: "cmwto084i00011kuprli02v3e",
  },
  headers: {
    "x-internal-token": process.env.LAMBDA_INTERNAL_TOKEN,
  },
});

console.log(result);
