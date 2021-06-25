import { Response, Request } from 'express';
import { Redis } from 'ioredis';

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
};
