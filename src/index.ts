import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { COKKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';
import { User } from './entities/User';
import { Post } from './entities/Post';

declare module 'express-session' {
  interface SessionData {
    userId: any;
  }
}

const main = async () => {
  // db  migration & connection
  await createConnection({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: '4856',
    synchronize: true,
    logging: true,
    entities: [User, Post],
  });

  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  const redisStore = connectRedis(session);

  const redis = new Redis();

  app.use(
    session({
      name: COKKIE_NAME,
      store: new redisStore({ client: redis, disableTouch: true }),
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
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log('\nServer running on locahost:4000');
  });
};

main().catch((error) => console.error(error));
