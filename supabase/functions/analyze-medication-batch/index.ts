import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface MedicationInput {
  drug_name: string;
  manufacturer?: string;
  quantity?: string;
  tests?: string[];
  additional_info?: string;
}

async function analyzeOne(med: MedicationInput): Promise<{ drug_name: string; result: unknown; error?: string }> {
  try {
    const response = await fetch("https://web-production-4382.up.railway.app/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drug_name: med.drug_name,
        manufacturer: med.manufacturer || "",
        quantity: med.quantity || "1",
        tests: med.tests || [],
        additional_info: med.additional_info || "",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { drug_name: med.drug_name, result: null, error: `API ${response.status}: ${errText}` };
    }

    const data = await response.json();
    return { drug_name: med.drug_name, result: data };
  } catch (err) {
    return { drug_name: med.drug_name, result: null, error: err.message };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { medications } = await req.json() as { medications: MedicationInput[] };

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return new Response(JSON.stringify({ error: "medications array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Batch analyzing ${medications.length} medications`);

    // Call Railway API for ALL medications in parallel
    const results = await Promise.all(medications.map(analyzeOne));

    console.log(`Batch complete: ${results.filter(r => r.result).length}/${medications.length} succeeded`);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Batch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
