import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callAnalyzeAPI(body: Record<string, unknown>): Promise<Response> {
  const response = await fetch("https://medical-scoring-api-2.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Proxying to Render /analyze:", JSON.stringify(body));

    // First attempt
    let response = await callAnalyzeAPI(body);

    // If 500, retry once after a short delay
    if (response.status === 500) {
      const errorBody = await response.text();
      console.error("Render API first attempt failed:", response.status, errorBody);
      
      // Wait 2 seconds and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Retrying Render API call...");
      response = await callAnalyzeAPI(body);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Render API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `Render API error: ${response.status}`, details: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Railway API response:", JSON.stringify(data));

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
