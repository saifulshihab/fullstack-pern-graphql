import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroOrm from './mikro-orm.config'
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from './resolvers/hello';

const main = async () => {
    // db  migration & connection 
    const orm = await MikroORM.init(mikroOrm);
    await orm.getMigrator().up()

    const app = express()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false
        })
    })
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('\nServer running on locahost:4000')
    })
 
};

main().catch(error => console.error(error));
