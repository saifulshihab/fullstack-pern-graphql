import path from 'path';
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import {MikroORM} from '@mikro-orm/core'
import { User } from './entities/User';

export default {
    type: 'postgresql',
    dbName: "lireddit",
    user: "postgres",
    password: "4856",
    entities: [Post, User],
    debug: !__prod__,    
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    }
} as Parameters<typeof MikroORM.init>[0];
