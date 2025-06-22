import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      imageDataUrl,
      prompt = "TOK pencil sketch, simple line drawing, coloring book style",
      style = "pencil-sketch", // 新增：风格参数
    } = await request.json();

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 },
      );
    }

    // Try to get API key from environment variable first, then from headers
    const replicateApiKey = process.env.REPLICATE_API_TOKEN || request.headers.get("x-replicate-api-key");

    if (!replicateApiKey) {
      return NextResponse.json(
        {
          error:
            "Replicate API key is required. Please add your API key in the settings.",
        },
        { status: 400 },
      );
    }

    // Convert data URL to blob for upload
    const base64Data = imageDataUrl.split(",")[1];
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    // Configure model based on style selection
    let modelConfig: {
      version: string;
      input: Record<string, string | number | boolean>;
    };

    if (style === "modern-sketch") {
      // SDXL-sketch model for modern digital sketch style
      modelConfig = {
        version: "8307ba5394e5ad08f885a5d9df48f9ec3d16c2dc124209c2ca3eb9077e32d2d5",
        input: {
          image: imageDataUrl,
          prompt: prompt,
          negative_prompt: "color, colorful, colored, rainbow, red, blue, green, yellow, orange, purple, pink, complex, detailed, realistic, photographic, cluttered, messy, painting, watercolor, oil painting, digital art, 3d render",
          prompt_strength: 0.75, // Slightly lower to preserve more structure while converting to sketch
          width: 512,
          height: 512,
          num_inference_steps: 30,
          guidance_scale: 5.0, // Lower value for simpler, less detailed output
          num_outputs: 1,
          scheduler: "K_EULER",
        },
      };
    } else if (style === "test-sketch") {
      // Test configuration with specified sketch-lora version
      modelConfig = {
        version: "32d7a493bcbd5212bf43e6a3f48b7ba716f9f159eabd13ccdbe5d0bcd747ff08",
        input: {
          image: imageDataUrl,
          prompt: prompt, // Use the prompt from client (already includes TOK)
          prompt_strength: 0.8, // Original strength for testing
          model: "dev", // Use dev model for best quality
          num_inference_steps: 28, // Default steps for better quality
          guidance_scale: 3.5, // Higher guidance for more precise control
          lora_scale: 1.0,
          aspect_ratio: "1:1",
          num_outputs: 1,
          output_format: "webp",
          output_quality: 90,
          go_fast: false, // Use original model for better quality
        },
      };
    } else {
      // sketch-lora model for traditional pencil sketch style (default)
      modelConfig = {
        version: "32d7a493bcbd5212bf43e6a3f48b7ba716f9f159eabd13ccdbe5d0bcd747ff08",
        input: {
          image: imageDataUrl,
          prompt: prompt, // Use the prompt from client (already includes TOK)
          prompt_strength: 0.75, // Slightly lower to preserve more structure while converting to sketch
          model: "dev", // Use dev model for best quality
          num_inference_steps: 20, // Reduce steps for faster processing
          guidance_scale: 3.0,
          lora_scale: 1.0,
          aspect_ratio: "1:1",
          num_outputs: 1,
          output_format: "webp",
          output_quality: 90,
          go_fast: false, // Use original model for better quality
        },
      };
    }

    // Call Replicate API with selected model
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${replicateApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modelConfig),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Replicate API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to call Replicate API",
          details: errorData,
        },
        { status: response.status },
      );
    }

    const prediction = await response.json();

    // Start polling for completion
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (
      result.status !== "succeeded" &&
      result.status !== "failed" &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            Authorization: `Token ${replicateApiKey}`,
          },
        },
      );

      if (pollResponse.ok) {
        result = await pollResponse.json();
        attempts++;
      } else {
        break;
      }
    }

    if (result.status === "succeeded") {
      return NextResponse.json({
        success: true,
        output: result.output[0], // Return the generated image URL
      });
    }
    if (result.status === "failed") {
      return NextResponse.json(
        {
          error: "Image processing failed",
          details: result.error,
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        error: "Processing timeout. Please try again.",
      },
      { status: 408 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
