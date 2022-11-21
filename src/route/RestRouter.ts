import Router from "koa-router";

export const restRouter = (() => {
    const router = new Router();
    router.get("/", async (ctx) => {
        ctx.body = "Hello World!";
    });
    return router;
})();
