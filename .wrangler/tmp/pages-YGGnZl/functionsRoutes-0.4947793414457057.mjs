import { onRequestGet as __api_sync_ts_onRequestGet } from "/home/aneesh/Desktop/projects/trip/functions/api/sync.ts"
import { onRequestPost as __api_sync_ts_onRequestPost } from "/home/aneesh/Desktop/projects/trip/functions/api/sync.ts"

export const routes = [
    {
      routePath: "/api/sync",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_sync_ts_onRequestGet],
    },
  {
      routePath: "/api/sync",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_sync_ts_onRequestPost],
    },
  ]