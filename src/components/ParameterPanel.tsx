"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ProcessingParams } from "@/types";
import { Wand2, Sparkles, Palette, Zap } from "lucide-react";

interface ParameterPanelProps {
  params: ProcessingParams;
  onParamsChange: (params: ProcessingParams) => void;
  onStartProcessing: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export default function ParameterPanel({
  params,
  onParamsChange,
  onStartProcessing,
  isProcessing,
  disabled,
}: ParameterPanelProps) {
  const lineThicknessMap = {
    thin: 0,
    normal: 1,
    thick: 2,
  };

  const lineThicknessLabels = ["细", "中等", "粗"];

  const handleLineThicknessChange = (value: number[]) => {
    const thickness = Object.keys(lineThicknessMap)[
      value[0]
    ] as keyof typeof lineThicknessMap;
    onParamsChange({
      ...params,
      lineThickness: thickness,
    });
  };

  const handleShadingChange = (checked: boolean) => {
    onParamsChange({
      ...params,
      preserveShading: checked,
    });
  };

  const handleStyleChange = (style: "pencil-sketch" | "modern-sketch" | "test-sketch") => {
    onParamsChange({
      ...params,
      style: style,
    });
  };

  return (
    <Card className="cute-card p-8 bounce-in">
      <div className="flex items-center space-x-3 mb-8">
        <Wand2 className="w-8 h-8 text-pink-500 floating" />
        <h3 className="text-2xl font-bold text-pink-600">🎨 魔法设置</h3>
      </div>

      <div className="space-y-8">
        {/* Line Thickness Setting */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-blue-500" />
            <label className="text-lg font-semibold text-gray-800">线条粗细</label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[lineThicknessMap[params.lineThickness]]}
              onValueChange={handleLineThicknessChange}
              max={2}
              min={0}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              {lineThicknessLabels.map((label, index) => (
                <span
                  key={label}
                  className={`px-3 py-1 rounded-full ${
                    lineThicknessMap[params.lineThickness] === index
                      ? "bg-pink-100 text-pink-700 font-semibold"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <label className="text-lg font-semibold text-gray-800">魔法风格</label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => handleStyleChange("pencil-sketch")}
              disabled={disabled}
              className={`p-6 rounded-2xl border-3 transition-all text-sm font-medium cute-card ${
                params.style === "pencil-sketch"
                  ? "border-pink-400 bg-pink-50 text-pink-700 shadow-lg"
                  : "border-gray-200 hover:border-pink-300 text-gray-700 hover:bg-pink-50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
            >
              <div className="space-y-3">
                <div className="text-3xl">🖍️</div>
                <div className="font-bold">铅笔素描</div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  传统手绘风格<br/>
                  适合真实感涂色
                </div>
                <div className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                  💰 $0.013/次
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleStyleChange("modern-sketch")}
              disabled={disabled}
              className={`p-6 rounded-2xl border-3 transition-all text-sm font-medium cute-card ${
                params.style === "modern-sketch"
                  ? "border-blue-400 bg-blue-50 text-blue-700 shadow-lg"
                  : "border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-blue-50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
            >
              <div className="space-y-3">
                <div className="text-3xl">✨</div>
                <div className="font-bold">现代素描</div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  数字化线条风格<br/>
                  干净简洁
                </div>
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  💰 $0.009/次
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleStyleChange("test-sketch")}
              disabled={disabled}
              className={`p-6 rounded-2xl border-3 transition-all text-sm font-medium cute-card ${
                params.style === "test-sketch"
                  ? "border-purple-400 bg-purple-50 text-purple-700 shadow-lg"
                  : "border-gray-200 hover:border-purple-300 text-gray-700 hover:bg-purple-50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
            >
              <div className="space-y-3">
                <div className="text-3xl">🧪</div>
                <div className="font-bold">实验模式</div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  实验性参数配置<br/>
                  探索新效果
                </div>
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  💰 $0.013/次
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Shading Setting */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <label className="text-lg font-semibold text-gray-800">
                  保留阴影细节 ✨
                </label>
              </div>
              <p className="text-sm text-gray-600">
                开启后将保留图片中的阴影和明暗变化，让线稿更有层次感
              </p>
            </div>
            <Switch
              checked={params.preserveShading}
              onCheckedChange={handleShadingChange}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Start Processing Button */}
      <div className="mt-8 pt-6 border-t-2 border-pink-200">
        <Button
          onClick={onStartProcessing}
          disabled={disabled}
          className="w-full h-14 text-lg font-bold cute-button bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 shadow-lg"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>🎨 正在施展魔法...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Wand2 className="w-6 h-6" />
              <span>✨ 开始魔法转换</span>
            </div>
          )}
        </Button>
        <p className="text-center text-sm text-gray-500 mt-3">
          🌟 让AI为您的照片施展魔法，创造独特的线稿作品！
        </p>
      </div>
    </Card>
  );
}
