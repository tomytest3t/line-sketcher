"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProcessedResult } from "@/types";
import { Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ResultsGalleryProps {
  results: ProcessedResult[];
  isProcessing: boolean;
}

export default function ResultsGallery({
  results,
  isProcessing,
}: ResultsGalleryProps) {
  const handleDownload = async (result: ProcessedResult) => {
    if (result.status !== "completed" || !result.processedImageUrl) return;

    try {
      // In a real app, this would download the processed image
      // For demo purposes, we'll simulate downloading the original with filters
      const link = document.createElement("a");
      link.href = result.processedImageUrl;
      link.download = `line-art-${result.originalImage.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("图片下载成功！");
    } catch (error) {
      toast.error("下载失败，请重试");
    }
  };

  const getStatusText = (result: ProcessedResult): string => {
    switch (result.status) {
      case "queued":
        return "排队中...";
      case "processing":
        return `正在处理 ${result.progress}%`;
      case "completed":
        return "完成!";
      case "error":
        return "处理失败";
      default:
        return "";
    }
  };

  const renderLineArtImage = (result: ProcessedResult) => {
    if (result.status === "completed" && result.processedImageUrl) {
      return (
        <img
          src={result.processedImageUrl}
          alt="线稿"
          className="w-full h-full object-cover fade-in"
        />
      );
    }

    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-2">
          <RotateCcw className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500">生成中...</p>
        </div>
      </div>
    );
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无处理结果</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">处理结果</h2>
        <p className="text-gray-600">
          {isProcessing ? "正在处理您的图片..." : "所有图片处理完成"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result) => (
          <Card key={result.id} className="p-6 fade-in">
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {result.originalImage.name}
                </h3>
                {result.status === "completed" && (
                  <Button
                    onClick={() => handleDownload(result)}
                    size="sm"
                    className="shrink-0"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载 PNG
                  </Button>
                )}
              </div>

              {/* Progress Bar (only show when processing) */}
              {result.status === "processing" && (
                <div className="space-y-2">
                  <Progress value={result.progress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">
                    {getStatusText(result)}
                  </p>
                </div>
              )}

              {/* Image Comparison */}
              <div className="grid grid-cols-2 gap-4">
                {/* Original Image */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">原图</h4>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={result.originalImage.dataUrl}
                      alt="原图"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Line Art Image */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">线稿</h4>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {renderLineArtImage(result)}
                  </div>
                </div>
              </div>

              {/* Status */}
              {result.status !== "processing" && (
                <div className="text-center">
                  <p
                    className={`text-sm ${
                      result.status === "completed"
                        ? "text-green-600"
                        : result.status === "error"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {getStatusText(result)}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {result.status === "error" && result.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{result.error}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
