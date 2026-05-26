import {Request,Response,NextFunction}  from "express";
import { createClient } from "redis";

// const app = express();
// const PORT = 3000;

type rateLimitParms = {
    capacity: number,  // The maximum number of tokens in each bucket.
    refillRate: number  // The interval period after which 1 token will be added to all the buckets.

}


const redis = createClient({
  url: process.env.REDIS_URL
});

redis.connect();



export const rateLimiter=({capacity,refillRate}:rateLimitParms) =>{
    return async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        const userId = req.ip || 'global';
        const key = `rate_limit:${userId}`;

        let userDate = await redis.get(key);
        let now = Date.now();

        let currentTokens = capacity;
        let lastRefill = now;

        if (userDate){
            const parsed = JSON.parse(userDate);
            currentTokens = parsed.tokens;
            lastRefill = parsed.last;
        }

        const delta = (now - lastRefill)/1000; //cnvert it to seconeds
        currentTokens = Math.min(capacity,Math.floor(currentTokens+delta*refillRate));

        if (currentTokens < 1) {
            console.log(`Rate limit reached for ${userId}`)
            res.status(429).json({ error: "Too many requests" });       
            return;
         }

        currentTokens -= 1;

        await redis.set(key,
            JSON.stringify({
                tokens:currentTokens,
                last: now
            }),
            {EX:60} // Inactive users data will be removed from redis
        );

        res.setHeader('X-RateLimit-Remaining', Math.floor(currentTokens).toString());
        res.setHeader('X-RateLimit-Limit', capacity.toString());   
        next();
    }

} 