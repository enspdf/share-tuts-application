import { Redis } from 'ioredis';
import { any } from 'bluebird';

export interface Session extends Express.Session {
    useId?: string;
}

export interface Context {
    redis: Redis;
    url: string;
    session: Session;
    req: Express.Request;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export type GraphQLMiddlewareFunc = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    }
}