import { createClient } from "redis";

const redis = createClient({
      url : process.env.REDIS_URL,
});

redis.on("error" , (err) => {
      console.error("Redis Client Error", err);
})
const shouldConnect =
  process.env.NODE_ENV !==
    "test" ||
  process.env.ENABLE_LIMITER ===
    "true";

if (shouldConnect) {
  redis.connect()
    .then(() =>
      console.log("Connected to Redis")
    )
    .catch(console.error);

}
export default redis;