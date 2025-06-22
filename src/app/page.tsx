"use client";

import Dropzone from "@/components/Dropzone";
import ExampleGallery from "@/components/ExampleGallery";
import Header from "@/components/Header";
import ParameterPanel from "@/components/ParameterPanel";
import ResultsGallery from "@/components/ResultsGallery";
import { getImageProcessor } from "@/lib/imageProcessor";
import { indexedDBManager } from "@/lib/indexedDB";
import type {
  HistoryItem,
  ProcessedResult,
  ProcessingParams,
  UploadedImage,
} from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [params, setParams] = useState<ProcessingParams>({
    lineThickness: "normal",
    preserveShading: false,
    style: "pencil-sketch", // 默认使用铅笔素描风格
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [currentView, setCurrentView] = useState<"upload" | "results">(
    "upload",
  );

  const handleImagesUploaded = (images: UploadedImage[]) => {
    setUploadedImages(images);
    setCurrentView("upload");
    setResults([]);
  };

  const handleImageRemove = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    if (uploadedImages.length === 1) {
      setCurrentView("upload");
    }
  };

  const handleStartProcessing = async () => {
    if (uploadedImages.length === 0) return;

    // Check if API key is available (optional check since we have server-side fallback)
    const apiKey = localStorage.getItem("replicate_api_key");
    if (!apiKey) {
      toast.info("使用内置 API Key 进行处理...");
    }

    setIsProcessing(true);
    setCurrentView("results");

    // Process images with API
    const processedResults: ProcessedResult[] = [];

    for (let i = 0; i < uploadedImages.length; i++) {
      const image = uploadedImages[i];
      const result: ProcessedResult = {
        id: image.id,
        originalImage: image,
        status: "processing",
        progress: 0,
        processedImageUrl: "",
        createdAt: new Date(),
      };

      processedResults.push(result);
      setResults([...processedResults]);

      try {
        // Start with initial progress
        result.progress = 10;
        result.status = "processing";
        setResults([...processedResults]);

        // Generate line art using Replicate API
        result.processedImageUrl = await generateLineArt(image.dataUrl, params);

        result.progress = 100;
        result.status = "completed";

        // Save to history
        await saveToHistory(result);
      } catch (error) {
        console.error("Error processing image:", error);
        result.status = "error";
        result.error = error instanceof Error ? error.message : "处理失败";
        toast.error(`图片 "${image.name}" 处理失败：${result.error}`);
      }

      setResults([...processedResults]);
    }

    setIsProcessing(false);
  };

  // Real line art generation using image processing
  const generateLineArt = async (
    originalUrl: string,
    params: ProcessingParams,
  ): Promise<string> => {
    try {
      const processor = getImageProcessor();
      return await processor.generateLineArt(originalUrl, params);
    } catch (error) {
      console.error("Error generating line art:", error);
      toast.error("线稿生成失败，请重试");
      return originalUrl; // Fallback to original image
    }
  };

  // Save result to local history
  const saveToHistory = async (result: ProcessedResult) => {
    try {
      const historyItem: HistoryItem = {
        id: result.id,
        originalImageUrl: result.originalImage.dataUrl,
        processedImageUrl: result.processedImageUrl,
        filename: result.originalImage.name,
        createdAt: result.createdAt,
        params: params,
      };

      await indexedDBManager.addHistoryItem(historyItem);
    } catch (error) {
      console.error("Error saving to history:", error);
      // Don't show error toast as this is not critical to the user experience
    }
  };

  const handleNewUpload = () => {
    setUploadedImages([]);
    setResults([]);
    setCurrentView("upload");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewUpload={handleNewUpload} />

      <main className="container mx-auto px-4 py-6">
        {currentView === "upload" ? (
          <>
            <div className="max-w-sm md:max-w-4xl mx-auto space-y-6">
              <Dropzone
                onImagesUploaded={handleImagesUploaded}
                uploadedImages={uploadedImages}
                onImageRemove={handleImageRemove}
              />

              {uploadedImages.length > 0 && (
                <ParameterPanel
                  params={params}
                  onParamsChange={setParams}
                  onStartProcessing={handleStartProcessing}
                  isProcessing={isProcessing}
                  disabled={isProcessing}
                />
              )}
            </div>

            {/* Show examples only when no images uploaded */}
            {uploadedImages.length === 0 && <ExampleGallery />}
          </>
        ) : (
          <div className="max-w-sm md:max-w-6xl mx-auto">
            <ResultsGallery results={results} isProcessing={isProcessing} />
          </div>
        )}
      </main>
    </div>
  );
}
