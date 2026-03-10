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

    const responseText = await response.text();
    console.log("Response keys preview:", responseText.slice(0, 200));
    
    const data = JSON.parse(responseText);
    const choice = data.choices?.[0]?.message;
    
    // Log the message keys to understand structure
    console.log("Message keys:", choice ? Object.keys(choice).join(", ") : "no choice");
    
    // Try multiple possible response formats
    let imageUrl = 
      choice?.images?.[0]?.image_url?.url ||
      choice?.image_url?.url ||
      null;
    
    // Check for inline_data in parts (Gemini format)
    if (!imageUrl && choice?.parts) {
      const imagePart = choice.parts.find((p: any) => p.inline_data?.mime_type?.startsWith('image/'));
      if (imagePart) {
        imageUrl = `data:${imagePart.inline_data.mime_type};base64,${imagePart.inline_data.data}`;
      }
    }
    
    // Check content array format
    if (!imageUrl && Array.isArray(choice?.content)) {
      const imgContent = choice.content.find((c: any) => c.type === 'image_url' || c.image_url);
      if (imgContent) {
        imageUrl = imgContent.image_url?.url || imgContent.url;
      }
    }

    if (!imageUrl) {
      console.error("Message structure:", JSON.stringify(choice ? Object.keys(choice) : data).slice(0, 500));
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
