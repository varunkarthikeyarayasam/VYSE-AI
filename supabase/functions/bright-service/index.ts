// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

console.info("CAMPORA AI server started");

export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    try {
      const body = await req.json();
      const message = body.message || "Hello";

      return Response.json({
        reply: "CAMPORA AI Engine connected successfully!",
        receivedMessage: message,
      });
    } catch (err) {
      return Response.json(
        { error: err.message },
        { status: 400 }
      );
    }
  }),
};