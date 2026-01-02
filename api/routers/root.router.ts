import express from 'express';
import scanner_router from './scanner.router';

const rootRouter = express.Router();

rootRouter.use('/virus-check', scanner_router);

export default rootRouter;
