// Lib for load config
import { config as loadEnv } from "https://deno.land/std/dotenv/mod.ts";

// Oak for API
import { Application, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";

// Patches to make Firebase work
import "https://deno.land/x/xhr@0.2.0/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";

// Firebase & Firebase Firestore
import { initializeApp } from "https://cdn.skypack.dev/firebase@9.9.1/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://cdn.skypack.dev/firebase@9.9.1/firestore";

// Set up globals for Firebase
installGlobals();

// Set up server app
const port = 3000;
const app = new Application();

// Set up firebase
await loadEnv({ export: true });
const firebaseApp = initializeApp({
  apiKey: Deno.env.get("API_KEY"),
  authDomain: Deno.env.get("AUTH_DOMAIN"),
  projectId: Deno.env.get("PROJECT_ID"),
  storageBucket: Deno.env.get("STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("MESSAGING_SENDER_ID"),
  appId: Deno.env.get("APP_ID"),
});

// Set up firebase database
const db = getFirestore(firebaseApp);

// Set up routes
const router = new Router();
router.get("/bilbies", async (ctx) => {
  try {
    const colRef = collection(db, "bilbies");
    const { docs } = await getDocs(colRef);
    ctx.response.body = JSON.stringify({
      v: 1,
      data: docs.map((doc) => ({ _id: doc.id, ...doc.data() })),
    });
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = err.message;
  }
});

// Next we need to register the router in the app and tell it to allow the following methods such a GET, POST, PUT, DELETE the router uses
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
