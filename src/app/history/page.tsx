"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { indexedDBManager } from "@/lib/indexedDB";
import type { HistoryItem } from "@/types";
import { ArrowLeft, Clock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const items = await indexedDBManager.getHistoryItems();
      setHistoryItems(items);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("加载历史记录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await indexedDBManager.clearHistory();
      setHistoryItems([]);
      setSelectedItem(null);
      toast.success("历史记录已清空");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("清空历史记录失败");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await indexedDBManager.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      toast.success("已删除该项");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("删除失败");
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "刚刚";
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前`;

    return date.toLocaleDateString();
  };

  const handleDownload = (item: HistoryItem) => {
    const link = document.createElement("a");
    link.href = item.processedImageUrl;
    link.download = `line-art-${item.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("图片下载成功！");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-500">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  我的历史记录
                </h1>
                <p className="text-gray-600">
                  最近处理的 {historyItems.length} 个结果
                </p>
              </div>
            </div>

            {historyItems.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearHistory}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空历史记录
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History Grid */}
            <div className="lg:col-span-2">
              {historyItems.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    暂无历史记录
                  </h3>
                  <p className="text-gray-600 mb-4">您的处理结果将在这里显示</p>
                  <Button onClick={() => router.push("/")}>开始创建线稿</Button>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {historyItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                        selectedItem?.id === item.id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-3">
                        <img
                          src={item.processedImageUrl}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(new Date(item.createdAt))}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedItem && (
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        详细信息
                      </h3>
                      <p className="text-sm text-gray-600 break-words">
                        {selectedItem.filename}
                      </p>
                    </div>

                    {/* Original vs Result */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          原图
                        </p>
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={selectedItem.originalImageUrl}
                            alt="原图"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          线稿
                        </p>
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={selectedItem.processedImageUrl}
                            alt="线稿"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parameters */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">
                        处理参数
                      </p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>
                          线条粗细:{" "}
                          {selectedItem.params.lineThickness === "thin"
                            ? "细"
                            : selectedItem.params.lineThickness === "normal"
                              ? "中等"
                              : "粗"}
                        </p>
                        <p>
                          阴影:{" "}
                          {selectedItem.params.preserveShading
                            ? "保留"
                            : "不保留"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t">
                      <Button
                        onClick={() => handleDownload(selectedItem)}
                        className="w-full"
                        size="sm"
                      >
                        下载线稿
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleDeleteItem(selectedItem.id)}
                        className="w-full text-red-600 hover:text-red-700"
                        size="sm"
                      >
                        删除记录
                      </Button>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        创建时间:{" "}
                        {new Date(selectedItem.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
