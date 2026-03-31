import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DrugInput {
  name: string;
  quantity: string;
}

interface AnalyzeRequest {
  drugs: DrugInput[];
  tests: string[];
  additional_info: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { drugs, tests, additional_info } = await req.json() as AnalyzeRequest;

    if (!drugs || !Array.isArray(drugs) || drugs.length === 0) {
      return new Response(JSON.stringify({ error: "drugs array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Analyzing ${drugs.length} drugs and ${tests?.length || 0} tests in single call`);

    const response = await fetch("https://web-production-4382.up.railway.app/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drugs,
        tests: tests || [],
        additional_info: additional_info || "",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Railway API error: ${response.status} ${errText}`);
      return new Response(JSON.stringify({ error: `API ${response.status}: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Railway API response received successfully");

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
