import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Response, Request } from 'express';
import { Redis } from 'ioredis';

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
  redis: Redis;
};
