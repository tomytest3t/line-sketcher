"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ProcessingParams } from "@/types";

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
    <Card className="p-6 fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">参数设置</h3>

      <div className="space-y-6">
        {/* Line Thickness Setting */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">线条粗细</label>
          <div className="space-y-3">
            <Slider
              value={[lineThicknessMap[params.lineThickness]]}
              onValueChange={handleLineThicknessChange}
              max={2}
              min={0}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              {lineThicknessLabels.map((label, index) => (
                <span
                  key={label}
                  className={`${
                    lineThicknessMap[params.lineThickness] === index
                      ? "text-primary font-medium"
                      : ""
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">素描风格</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleStyleChange("pencil-sketch")}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all text-sm font-medium ${
                params.style === "pencil-sketch"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="space-y-2">
                <div className="text-base">🖍️</div>
                <div>铅笔素描</div>
                <div className="text-xs text-gray-500">
                  传统手绘风格
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleStyleChange("modern-sketch")}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all text-sm font-medium ${
                params.style === "modern-sketch"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="space-y-2">
                <div className="text-base">✨</div>
                <div>现代素描</div>
                <div className="text-xs text-gray-500">
                  数字化线条风格
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleStyleChange("test-sketch")}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all text-sm font-medium ${
                params.style === "test-sketch"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="space-y-2">
                <div className="text-base">🧪</div>
                <div>测试模式</div>
                <div className="text-xs text-gray-500">
                  实验版本
                </div>
              </div>
            </button>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>铅笔素描</strong>: 传统手绘效果，适合真实感涂色 ($0.013/次)<br/>
            <strong>现代素描</strong>: 数字化线条，干净简洁 ($0.009/次)<br/>
            <strong>测试模式</strong>: 实验性参数配置，用于测试不同效果 ($0.013/次)
          </div>
        </div>

        {/* Shading Setting */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              保留阴影细节
            </label>
            <p className="text-xs text-gray-500">
              开启后将保留图片中的阴影和明暗变化
            </p>
          </div>
          <Switch
            checked={params.preserveShading}
            onCheckedChange={handleShadingChange}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Start Processing Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={onStartProcessing}
          disabled={disabled}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          {isProcessing ? "处理中..." : "生成线稿"}
        </Button>
      </div>
    </Card>
  );
}
