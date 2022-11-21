import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware as apolloKoaMiddleware } from "@as-integrations/koa";
import cors from "@koa/cors";
import { resolvers, typeDefs } from "graphql/resolvers";
import http from "http";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { restRouter } from "route/RestRouter";

const PORT = 80;
const GRAPHQL_PATH = "/graphql";
const ROCKET_EMOJI = "🚀";

const main = async () => {
    const app = new Koa();

    // graphql
    const httpServer = http.createServer(app.callback());
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await apolloServer.start();
    await new Promise<void>((res) => httpServer.listen({ port: PORT }, res));
    const graphqlRouter = new Router();
    graphqlRouter.all(
        GRAPHQL_PATH,
        apolloKoaMiddleware(apolloServer, {
            context: async ({ ctx }) => ({ token: ctx.headers.token }),
        })
    );

    app.use(cors());
    app.use(bodyParser());
    app.use(restRouter.routes());
    app.use(graphqlRouter.routes());

    console.log(`${ROCKET_EMOJI} Server ready at port:${PORT}`);
};
main();
