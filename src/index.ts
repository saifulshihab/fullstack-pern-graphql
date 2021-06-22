import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { COKKIE_NAME, __prod__ } from './constants';
import mikroOrm from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';

declare module 'express-session' {
  interface SessionData {
    userId: any;
  }
}

const main = async () => {
  // db  migration & connection
  const orm = await MikroORM.init(mikroOrm);
  // await orm.getMigrator().up()

  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  const redisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: COKKIE_NAME,
      store: new redisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax', // csrf
      },
      saveUninitialized: false,
      secret: 'shaish23232',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log('\nServer running on locahost:4000');
  });
};

main().catch((error) => console.error(error));
