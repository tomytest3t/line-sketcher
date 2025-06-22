export interface UploadedImage {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  size: number;
}

export interface ProcessingParams {
  lineThickness: "thin" | "normal" | "thick";
  preserveShading: boolean;
  style: "pencil-sketch" | "modern-sketch" | "test-sketch";
}

export interface ProcessedResult {
  id: string;
  originalImage: UploadedImage;
  status: "queued" | "processing" | "completed" | "error";
  progress: number;
  processedImageUrl: string;
  createdAt: Date;
  error?: string;
}

export interface HistoryItem {
  id: string;
  originalImageUrl: string;
  processedImageUrl: string;
  filename: string;
  createdAt: Date;
  params: ProcessingParams;
}

export type ToastType = "success" | "error" | "warning" | "info";
