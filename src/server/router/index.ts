// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { userRoutes } from './user.routes';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("user.", userRoutes)

// export type definition of API
export type AppRouter = typeof appRouter;
