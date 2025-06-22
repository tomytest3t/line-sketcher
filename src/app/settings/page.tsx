"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ExternalLink, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem("replicate_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("请输入 API Key");
      return;
    }

    if (!apiKey.startsWith("r8_")) {
      toast.error("API Key 格式不正确，应以 'r8_' 开头");
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem("replicate_api_key", apiKey.trim());
      toast.success("API Key 保存成功！");
    } catch (error) {
      toast.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("replicate_api_key");
    setApiKey("");
    toast.success("API Key 已清除");
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("请先输入 API Key");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api.replicate.com/v1/models", {
        headers: {
          Authorization: `Token ${apiKey.trim()}`,
        },
      });

      if (response.ok) {
        toast.success("API Key 验证成功！");
      } else {
        toast.error("API Key 验证失败，请检查是否正确");
      }
    } catch (error) {
      toast.error("网络错误，无法验证 API Key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">设置</h1>
              <p className="text-gray-600">配置 Replicate API 以生成简笔画</p>
            </div>
          </div>

          {/* API Key Section */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Key className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Replicate API Key
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    你的 API Key 只会保存在本地浏览器中，不会上传到服务器
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSaveApiKey}
                    disabled={loading}
                    className="flex-1"
                  >
                    保存 API Key
                  </Button>

                  <Button
                    variant="outline"
                    onClick={testApiKey}
                    disabled={loading || !apiKey.trim()}
                  >
                    测试连接
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleClearApiKey}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    清除
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  如何获取 Replicate API Key？
                </h3>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                      1
                    </span>
                    <div>
                      访问{" "}
                      <a
                        href="https://replicate.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        Replicate.com <ExternalLink className="w-3 h-3 ml-1" />
                      </a>{" "}
                      并注册账户
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                      2
                    </span>
                    <div>在账户设置中找到 "API tokens" 页面</div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                      3
                    </span>
                    <div>创建新的 API token，复制并粘贴到上面的输入框中</div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                      4
                    </span>
                    <div>确保你的账户有足够的使用额度</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>注意：</strong> 使用 Replicate API
                    会产生费用。简笔画生成大约每张图片 $0.01-0.05。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
