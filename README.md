#  Express Token Bucket Rate Limiter

A Token Bucket rate limiter middleware for Express.js built with TypeScript and backed by Redis.

It provides configurable, per-client rate limiting using a Redis-backed token bucket algorithm.

---

## How It Works

The Token Bucket algorithm maintains a bucket of tokens for each client (identified by IP address).

Each bucket has:

- Capacity → maximum number of tokens  
- Refill rate → tokens added per second  

### Request lifecycle:

1. Load token bucket from Redis  
2. Refill tokens based on elapsed time  
3. If tokens < 1 → return HTTP 429  
4. Otherwise consume 1 token  
5. Persist updated state in Redis (TTL: 60s)


### Configuration
The app uses two parameters: 
- capacity (default 10), which defines the maximum size of the tokens a user can get
- refillRate (default 1), which defines the number of tokens added each seconed
---
##  Features

- Token Bucket rate limiting per IP  
- Redis-backed persistence  
- Automatic expiry (TTL)  
- Configurable capacity & refill rate  
- Rate limit headers  
- Docker support  
- Graceful HTTP 429 responses  

---

## Prerequisites

- Node.js (v20+ recommended)
- npm
- Redis (v7+ recommended)

---

##  Installation

### Without Docker

```
npm install  
npm run build  
npm start  
```

---

### With Docker Compose

docker-compose up --build  

Run in background:
docker-compose up -d --build  

Stop:
docker-compose down  

---

##  Configuration

| Variable | Default | Description |
|---|---|---|
| PORT | 3000 | Server port |
| REDIS_URL | redis://redis:6379 | Redis connection |

---

##  Testing

To test the rate limiter, send repeated GET requests to http://localhost:3000/ using Thunder Client, Postman, or curl; the first 10 requests should return 200 OK with the X-RateLimit-Remaining header decreasing on each call, and once the limit is exceeded the server will respond with 429 Too Many Requests, after which you can wait a few seconds for tokens to refill and confirm that requests start succeeding again.


Status: 200 OK
{
  "message": "Hello, you are within the rate limit."
}

Status: 429 Too Many Requests
{
  "error": "Too many requests"
}

---


