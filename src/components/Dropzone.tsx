"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UploadedImage } from "@/types";
import { Camera, Upload, X } from "lucide-react";
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
      toast.success(`成功上传 ${newImages.length} 张图片！`);
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
    <div className="space-y-4">
      {uploadedImages.length === 0 ? (
        <div
          className={`dropzone relative min-h-[400px] rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer ${
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
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
              <Camera size={64} />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              用色彩点亮童心，简笔画涂色
            </h1>

            <p className="text-lg text-gray-700 mb-4 font-medium">
              让孩子更专注、更自信、更有创造力！
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              将你的照片变成线稿
            </h2>

            <p className="text-gray-600 mb-4">拖放图片到这里，或点击选择文件</p>

            <p className="text-sm text-gray-500">
              支持 JPG, PNG, WEBP格式, 单张不超过10MB
            </p>
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="p-4 relative fade-in">
                <button
                  onClick={() => onImageRemove(image.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X size={14} />
                </button>

                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.size)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div
            className="dropzone min-h-[120px] rounded-lg flex items-center justify-center p-6 cursor-pointer"
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
              <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">添加更多图片</p>
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
