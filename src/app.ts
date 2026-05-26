import express from 'express';
import { rateLimiter } from './middlewares/rate_limiter';

const app = express();

const router= express.Router();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(rateLimiter({
    capacity:10,
    refillRate:1
}))

router.get('/', async (req, res) => {
 res.json({ message:'Hello you are winthin the rate limit.'})

});

app.use(router);

export default app;