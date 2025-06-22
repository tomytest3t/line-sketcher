import type { ProcessingParams } from "@/types";

export class ImageProcessor {
  async generateLineArt(
    imageDataUrl: string,
    params: ProcessingParams,
  ): Promise<string> {
    try {
      // Get API key from localStorage (optional now, fallback to server-side key)
      const apiKey = localStorage.getItem("replicate_api_key");

      // Generate prompt based on parameters
      const prompt = this.generatePrompt(params);

      // Call our API endpoint
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Only add API key header if we have one
      if (apiKey) {
        headers["x-replicate-api-key"] = apiKey;
      }

      const response = await fetch("/api/generate-scribble", {
        method: "POST",
        headers,
        body: JSON.stringify({
          imageDataUrl,
          prompt,
          style: params.style, // 传递风格参数
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate scribble");
      }

      if (result.success && result.output) {
        return result.output;
      }
      throw new Error("No output received from API");
    } catch (error) {
      console.error("Error generating line art:", error);
      throw error;
    }
  }

  private generatePrompt(params: ProcessingParams): string {
    let prompt = "";

    if (params.style === "modern-sketch") {
      // SDXL-sketch model prompts (no TOK trigger word needed)
      prompt = "black and white sketch, line drawing, coloring book style";

      // Base style for modern digital sketch - emphasize B&W
      prompt += ", monochrome line art, clean black lines on white background";

      // Adjust line style based on parameters
      if (params.lineThickness === "thin") {
        prompt += ", fine thin lines, delicate black strokes, minimal line weight";
      } else if (params.lineThickness === "thick") {
        prompt += ", bold thick black lines, strong dark outlines, heavy black strokes";
      } else {
        prompt += ", medium black lines, balanced stroke weight";
      }

      // Handle shading preferences
      if (params.preserveShading) {
        prompt += ", subtle black and white gradients, monochrome shading";
      } else {
        prompt += ", pure black line art, no shading, simple black outlines only";
      }

      // Add strong B&W keywords for SDXL model
      prompt += ", pure black and white, no color, monochrome, minimalist";
      prompt += ", coloring book page, simple design, clear black boundaries";

    } else if (params.style === "test-sketch") {
      // Test sketch-lora model with simple pencil sketch conversion
      prompt = "Transform the image into a beautiful, simple pencil-sketch drawing.";

    } else {
      // sketch-lora model prompts (needs TOK trigger word)
      prompt = "TOK black and white pencil sketch";

      // Base style for traditional pencil sketch - emphasize B&W
      prompt += ", simple black line drawing, monochrome coloring book style";

      // Adjust line style based on parameters
      if (params.lineThickness === "thin") {
        prompt += ", fine delicate black lines, light thin pencil strokes";
      } else if (params.lineThickness === "thick") {
        prompt += ", bold thick black lines, dark heavy pencil strokes, strong black outlines";
      } else {
        prompt += ", medium weight black lines, clear pencil strokes";
      }

      // Handle shading preferences
      if (params.preserveShading) {
        prompt += ", subtle black and white shading, soft monochrome gradients, artistic sketch";
      } else {
        prompt += ", clean black outlines only, no shading, simple black line art";
      }

      // Add strong B&W keywords for sketch-lora model
      prompt += ", pure black and white, no color, monochrome, minimalist hand-drawn style";
      prompt += ", coloring book page, suitable for children coloring, clear black boundaries";
    }

    return prompt;
  }
}

// Create instance only when needed (client-side)
export const getImageProcessor = (): ImageProcessor => {
  if (typeof window === "undefined") {
    throw new Error("ImageProcessor can only be used in browser environment");
  }
  return new ImageProcessor();
};
