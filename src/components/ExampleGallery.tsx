"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const examples = [
  {
    id: 1,
    title: "3D角色转换",
    original: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fYs0xqZReqr8TIm5cj69ePHyB7gxtd.png",
    sketch: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jC2t8C5PaT7Bfo9lQ6tNFCDGEcOcIn.png",
    description: "3D渲染角色转换为简洁线稿"
  },
  {
    id: 2,
    title: "卡通女孩转换",
    original: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5wc0Yt2CtdJ3ZJ7WkCAPZXDYmLSJay.png",
    sketch: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1DfA5UQadLJH56VDrS7lJOp6P0c3U1.png",
    description: "可爱卡通角色的线条化"
  },
  {
    id: 3,
    title: "胖子角色转换",
    original: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-x4wDcZw4eUwA0HIjbBGLQVhfB6RGvZ.png",
    sketch: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AK5NvmI1SMLt2KrIAEfMZDpYrLY7ig.png",
    description: "卡通角色的完美线稿转换"
  },
  {
    id: 4,
    title: "真人照片转换",
    original: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bJuubUiWLODLrAzWQkzjb5DGD7sUi7.jpeg",
    sketch: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-w5vbELOOKQCXOVJk8IbYL9Ni8T3TRL.png",
    description: "真实人像的创意线条化"
  }
];

export default function ExampleGallery() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
            ✨ 效果展示
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            看看其他用户的神奇转换
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            从复杂的彩色图片到简洁的黑白线稿，让孩子们尽情发挥创造力
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {examples.map((example) => (
            <Card key={example.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  {example.title}
                </h3>

                <div className="grid grid-cols-5 gap-3 items-center">
                  {/* Original Image */}
                  <div className="col-span-2 space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={example.original}
                        alt={`${example.title} - 原图`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center">
                      原图
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="text-3xl text-primary font-bold">→</div>
                  </div>

                  {/* Sketch Image */}
                  <div className="col-span-2 space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200">
                      <img
                        src={example.sketch}
                        alt={`${example.title} - 简笔画`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium text-primary text-center">
                      简笔画
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 text-center bg-gray-50 p-3 rounded-lg">
                  {example.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 font-medium">
            🎨 您的作品也能有如此神奇的转换！
          </p>
          <p className="text-sm text-gray-500 mt-2">
            立即上传图片，开始创作属于您孩子的专属涂色本
          </p>
        </div>
      </div>
    </div>
  );
}
