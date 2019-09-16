import 'reflect-metadata';
import * as dotenv from "dotenv";
dotenv.config();

import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectRedis from "connect-redis";

import { redis } from "./Redis";
import { createTypeormConnection } from './utils/createTypeormConnection';
import { genSchema } from './utils/genSchema';
import { redisSessionPrefix } from './constants';

const SESSION_SECRET = "ZKbMx7VmQZX5BDMnwRQamDbCKsB5x1jS";
const RedisStore = connectRedis(session);

export const startServer = async () => {
    const server = new GraphQLServer({
        schema: genSchema(),
        context: ({ request }) => ({
            redis,
            url: `${request.protocol}://${request.get('host')}`,
            session: request.session,
            req: request
        }),
    });

    server.express.use(
        session({
            store: new RedisStore({
                client: redis as any,
                prefix: redisSessionPrefix
            }),
            name: 'qid',
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7
            }
        })
    );

    const cors = {
        credentials: true,
        origin: process.env.NODE_ENV === 'test' ? '*' : (process.env.FRONTEND_HOST as string)
    };

    await createTypeormConnection();

    const app = await server.start({
        cors,
        port: process.env.NODE_ENV === 'test' ? 0 : 4000
    });

    console.log(`Server is running on localhost:4000`);

    return app;
}