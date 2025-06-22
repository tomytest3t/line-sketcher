"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UploadedImage } from "@/types";
import { Camera, Upload, X, Heart, Star, Palette } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface DropzoneProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  uploadedImages: UploadedImage[];
  onImageRemove: (id: string) => void;
}

export default function Dropzone({
  onImagesUploaded,
  uploadedImages,
  onImageRemove,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("上传失败。请确保图片为 JPG/PNG/WEBP 格式，且小于 10MB。");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("上传失败。请确保图片为 JPG/PNG/WEBP 格式，且小于 10MB。");
      return false;
    }

    return true;
  }, []);

  const processFiles = useCallback(
    async (files: FileList) => {
      const validFiles: File[] = [];

      for (const file of Array.from(files)) {
        if (validateFile(file)) {
          validFiles.push(file);
        }
      }

      if (validFiles.length === 0) return;

      const newImages: UploadedImage[] = [];

      for (const file of validFiles) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          dataUrl,
          name: file.name,
          size: file.size,
        });
      }

      onImagesUploaded([...uploadedImages, ...newImages]);
      toast.success(`🎉 成功上传 ${newImages.length} 张图片！`);
    },
    [uploadedImages, onImagesUploaded, validateFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {uploadedImages.length === 0 ? (
        <div
          className={`dropzone relative min-h-[450px] rounded-3xl flex flex-col items-center justify-center p-8 cursor-pointer sparkle ${
            isDragOver ? "dragover" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {/* 装饰性元素 */}
          <div className="absolute top-4 left-4 text-2xl">🌈</div>
          <div className="absolute top-4 right-4 text-2xl">🎨</div>
          <div className="absolute bottom-4 left-4 text-2xl">⭐</div>
          <div className="absolute bottom-4 right-4 text-2xl">💖</div>

          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 text-pink-400 mb-6 floating">
              <Camera size={80} />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold rainbow-text mb-4 leading-tight">
                🎨 小画家的魔法工坊 ✨
              </h1>

              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-red-400 floating" />
                <p className="text-xl text-pink-600 font-semibold">
                  让每个孩子都成为小艺术家！
                </p>
                <Star className="w-6 h-6 text-yellow-400 floating" />
              </div>

              <p className="text-lg text-gray-700 mb-6 font-medium max-w-2xl mx-auto">
                🌟 把照片变成可爱的线稿，让宝贝们尽情发挥想象力，创作出独一无二的彩色世界！
              </p>

              <div className="bg-gradient-to-r from-pink-100 to-yellow-100 rounded-2xl p-4 mb-6">
                <h2 className="text-2xl font-bold text-pink-700 mb-3 flex items-center justify-center">
                  <Palette className="w-6 h-6 mr-2" />
                  照片变线稿魔法
                </h2>
                <p className="text-gray-600 mb-4">把照片拖到这里，或者点击选择文件</p>
                <p className="text-sm text-gray-500">
                  ✨ 支持 JPG, PNG, WEBP格式 ✨ 单张不超过10MB
                </p>
              </div>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  简单易用
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  安全可靠
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  创意无限
                </span>
              </div>
            </div>
          </div>

          <input
            id="file-input"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">🎉 已选择的照片</h2>
            <p className="text-gray-600">准备开始魔法转换吧！</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="cute-card p-4 relative bounce-in">
                <button
                  onClick={() => onImageRemove(image.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors z-10 shadow-lg"
                >
                  <X size={16} />
                </button>

                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-2 border-pink-200">
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    📸 {image.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    📏 {formatFileSize(image.size)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div
            className="dropzone min-h-[120px] rounded-2xl flex items-center justify-center p-6 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() =>
              document.getElementById("file-input-additional")?.click()
            }
          >
            <div className="text-center">
              <Upload className="mx-auto w-8 h-8 text-pink-400 mb-2 floating" />
              <p className="text-sm text-pink-600 font-medium">➕ 添加更多照片</p>
            </div>

            <input
              id="file-input-additional"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
