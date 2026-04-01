const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = "https://orionapisalpha.onrender.com";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    
    const file = formData.get("file") as File;
    const userId = formData.get("user_id") as string;
    const loanId = formData.get("loan_id") as string;
    const password = formData.get("password") as string;

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
    if (password) {
      proxyFormData.append("password", password);
    }

    const response = await fetch(`${API_BASE_URL}/bank_statements/analyze`, {
      method: "POST",
      body: proxyFormData,
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Proxy bank statement error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
