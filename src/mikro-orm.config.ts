import path from 'path';
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import {MikroORM} from '@mikro-orm/core'

export default {
    type: 'postgresql',
    dbName: "lireddit",
    user: "postgres",
    password: "1234",
    entities: [Post],
    debug: !__prod__,    
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    }
} as Parameters<typeof MikroORM.init>[0];
