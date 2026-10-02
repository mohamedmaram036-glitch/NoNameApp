import { createClient } from "redis"
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url:REDIS_URI
});

export async function connectRedis() {
  try {
    await client.connect();
    console.log("redis connection stablish successfully");
  } catch (error) {
    console.error("Fail to stablish redis connection:", error);
  }
}
