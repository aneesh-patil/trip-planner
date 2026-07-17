export interface Env {
  TRIP_STORE: any;
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // API Route for Syncing
    if (url.pathname === "/api/sync") {
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      };

      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }

      if (request.method === "POST") {
        const body = await request.text();
        await env.TRIP_STORE.put("user_trip_data", body);
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (request.method === "GET") {
        const data = await env.TRIP_STORE.get("user_trip_data");
        return new Response(data || '{"favorites":[],"visited":[]}', {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Serve static assets natively if no API route matched
    return env.ASSETS.fetch(request);
  },
};
