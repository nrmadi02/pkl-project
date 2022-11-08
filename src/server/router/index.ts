import { pelanggaranRoutes } from './pelanggaran.routes';
// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { userRoutes } from './user.routes';
import { kelasRoutes } from "./kelas.routes";
import { periodeRoutes } from "./periode.routes";
import { guruRoutes } from "./guru.routes";
import { siswaRoutes } from "./siswa.routes";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("user.", userRoutes)
  .merge("kelas.", kelasRoutes)
  .merge("periode.", periodeRoutes)
  .merge("guru.", guruRoutes)
  .merge("siswa.", siswaRoutes)
  .merge("pelanggaran.", pelanggaranRoutes)

// export type definition of API
export type AppRouter = typeof appRouter;
