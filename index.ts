// First we need to import the Route
import { Application, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";

const port = 3000;
const app = new Application();

// Initialize a new router
const router = new Router();
// Add a route to the router under /bilbies
router.get("/bilbies", (ctx) => {
  // Set the response to some basic JSON
  ctx.response.body = JSON.stringify({
    v: 1,
    data: "An array of images",
  });
});

// Next we need to register the router in the app and tell it to allow the following methods such a GET, POST, PUT, DELETE the router uses
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
