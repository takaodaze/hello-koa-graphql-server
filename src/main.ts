import Koa from "koa";
import Router from "koa-router";

const app = new Koa();
app.use((ctx) => {
    console.log("debug");
});
const router = new Router();

router.get("/", async (ctx) => {
    ctx.body = "Hello World!";
});

app.use(router.routes());

app.listen(3000);

console.log("Server running on port 3000");
