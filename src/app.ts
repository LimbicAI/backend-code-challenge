import express, {  Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as expressWinston from 'express-winston'; 
import { logger } from './common';
import mongoConnect, { redis_connect } from './connect';
import routes from './routes/index'; 
import errorHandler from './middleware/errorHandler';
import RateLimiting from './middleware/ratelimiter';



const app = express();


//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
};

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(helmet());
app.use(expressWinston.logger(logger));

app.use(cors(options));


const db = 'mongodb://localhost:27017';

//MongoConnect
mongoConnect({ db });

//RedisConnect
redis_connect();

//Ratelimiting Middleware
app.use(RateLimiting.apiRateLimiter);

app.get('/', async(_, res:Response)=>{
  return res.status(200).json({ message: 'welcome 🚀🚀🚀' })
})
app.use('/api/v1', routes);

// default catch all handler
app.all('*', (_, res:Response) => {
  return res.status(404).json({ message: '#NOT_FOUND 😒😒😒' })
})

// custom error handler middleware
app.use(errorHandler);



export default app;
