"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Sparkles } from "lucide-react";

const examples = [
  {
    id: 1,
    title: "🎭 敖丙 - 龙族太子",
    original: "/examples/aobing-original.webp",
    sketch: "/examples/aobing-sketch.png",
    description: "帅气的敖丙变身简笔画，展现龙族太子的另一种风采！"
  },
  {
    id: 2,
    title: "👧 哪吒 - 魔童降世",
    original: "/examples/nezha-original.webp",
    sketch: "/examples/nezha-sketch.png",
    description: "不羁的哪吒也能变得可爱，快来给他涂上颜色吧！"
  },
  {
    id: 3,
    title: "🍔 太乙真人 - 神仙坐骑",
    original: "/examples/taiyi-original.webp",
    sketch: "/examples/taiyi-sketch.png",
    description: "圆滚滚的太乙真人，变成线稿后是不是更萌了？"
  },
  {
    id: 4,
    title: "👨‍🏫 马老师 - 武学大师",
    original: "/examples/malaoshi-original.jpeg",
    sketch: "/examples/malaoshi-sketch.png",
    description: "武学大师的另一面，快来用色彩填充他的世界吧！"
  }
];

export default function ExampleGallery() {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 py-20 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 floating">🎨</div>
      <div className="absolute top-20 right-20 text-5xl opacity-10 floating" style={{animationDelay: '1s'}}>✨</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-10 floating" style={{animationDelay: '2s'}}>🌟</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-10 floating" style={{animationDelay: '0.5s'}}>💖</div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500 floating" />
            <Badge variant="secondary" className="mb-4 text-lg px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-2 border-pink-200">
              ✨ 魔法效果展示 ✨
            </Badge>
            <Heart className="w-6 h-6 text-red-500 floating" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold rainbow-text mb-6">
            🎪 看看其他小画家的神奇作品
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            🌟 从复杂的彩色图片到简洁的黑白线稿，让每个孩子都能成为小艺术家！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {examples.map((example, index) => (
            <Card key={example.id} className="cute-card p-8 hover:shadow-xl transition-all duration-500 bounce-in" style={{animationDelay: `${index * 0.2}s`}}>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-pink-600 mb-2">
                    {example.title}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-5 gap-4 items-center">
                  {/* Original Image */}
                  <div className="col-span-2 space-y-3">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-3 border-pink-200 shadow-lg">
                      <img
                        src={example.original}
                        alt={`${example.title} - 原图`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700 bg-pink-100 px-3 py-1 rounded-full">
                        📸 原图
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="text-4xl text-pink-500 font-bold floating">✨</div>
                    <div className="text-2xl text-purple-500 font-bold mx-2">→</div>
                    <div className="text-4xl text-purple-500 font-bold floating" style={{animationDelay: '0.5s'}}>✨</div>
                  </div>

                  {/* Sketch Image */}
                  <div className="col-span-2 space-y-3">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-3 border-dashed border-purple-300 shadow-lg">
                      <img
                        src={example.sketch}
                        alt={`${example.title} - 简笔画`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                        🎨 线稿
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border-2 border-yellow-200">
                  <p className="text-sm text-gray-700 text-center font-medium leading-relaxed">
                    {example.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-8 rounded-3xl border-2 border-pink-200 shadow-lg">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="w-8 h-8 text-pink-500 floating" />
              <h3 className="text-2xl font-bold text-pink-600">🎨 您的作品也能有如此神奇的转换！</h3>
              <Sparkles className="w-8 h-8 text-purple-500 floating" style={{animationDelay: '1s'}} />
            </div>
            <p className="text-lg text-gray-700 font-medium mb-2">
              🌟 立即上传图片，开始创作属于您孩子的专属涂色本
            </p>
            <p className="text-sm text-gray-600">
              💝 让每个孩子都能享受创作的快乐，培养艺术天赋！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
