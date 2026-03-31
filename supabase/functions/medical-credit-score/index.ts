import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { age, conditions } = await req.json();
    console.log("Calling Render /score with:", JSON.stringify({ age, conditions }));

    const response = await fetch("https://web-production-4382.up.railway.app/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age: age || 0, conditions: conditions || [] }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Render /score error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `Score API error: ${response.status}`, details: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Render /score response:", JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
