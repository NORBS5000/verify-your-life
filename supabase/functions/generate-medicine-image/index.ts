import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { drugName } = await req.json();

    if (!drugName) {
      return new Response(JSON.stringify({ error: "Drug name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Generate a hyper-realistic, high-resolution pharmacy product photo of the real medication "${drugName}". Show the actual branded commercial packaging — the box, blister pack, bottle, or tube — exactly as it would appear on a pharmacy shelf. Include the real manufacturer's branding, logo, dosage info, and packaging colors. The image should look like a professional product photograph taken for an online pharmacy catalog. Solid white background, studio lighting, no watermarks or text overlays.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Gateway response structure:", JSON.stringify(data).slice(0, 500));
    
    // Try multiple possible response formats for image data
    const choice = data.choices?.[0]?.message;
    const imageUrl = 
      choice?.images?.[0]?.image_url?.url ||  // images array format
      choice?.image_url?.url ||                // direct image_url format
      (choice?.content && typeof choice.content === 'string' && choice.content.startsWith('data:') ? choice.content : null) || // base64 in content
      data.images?.[0]?.url ||                 // top-level images
      null;

    if (!imageUrl) {
      console.error("Could not extract image from response:", JSON.stringify(data).slice(0, 1000));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating medicine image:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
