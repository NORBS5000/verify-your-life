const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const API_BASE_URL = "https://web-production-4382.up.railway.app";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Proxy M-Pesa: received request");
    const formData = await req.formData();
    
    const file = formData.get("file") as File;
    const userId = formData.get("user_id") as string;
    const loanId = formData.get("loan_id") as string;
    const password = formData.get("password") as string || "";

    console.log(`Proxy M-Pesa: file=${file?.name}, userId=${userId}, loanId=${loanId}, hasPassword=${!!password}`);

    if (!file || !userId || !loanId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: file, user_id, loan_id" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const proxyFormData = new FormData();
    proxyFormData.append("file", file);
    proxyFormData.append("user_id", userId);
    proxyFormData.append("loan_id", loanId);
    proxyFormData.append("password", password);

    console.log(`Proxy M-Pesa: calling ${API_BASE_URL}/mpesa/extractmpesa`);
    const response = await fetch(`${API_BASE_URL}/mpesa/extractmpesa`, {
      method: "POST",
      body: proxyFormData,
    });

    const responseBody = await response.text();
    console.log(`Proxy M-Pesa: upstream status=${response.status}, body length=${responseBody.length}`);

    if (!response.ok) {
      console.error(`Proxy M-Pesa: upstream error: ${responseBody}`);
    }

    return new Response(responseBody, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Proxy M-Pesa error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
