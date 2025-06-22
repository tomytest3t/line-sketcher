"use client";

import { Button } from "@/components/ui/button";
import { Settings, History, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onNewUpload?: () => void;
}

export default function Header({ onNewUpload }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-pink-50 to-yellow-50 border-b-2 border-pink-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onNewUpload}
            className="flex items-center space-x-2 text-2xl font-bold rainbow-text hover:scale-105 transition-transform duration-300"
          >
            <Sparkles className="w-8 h-8 text-pink-500 floating" />
            <span>🎨 小画家</span>
          </button>

          <nav className="flex items-center space-x-4">
            <Link href="/history">
              <Button variant="ghost" size="sm" className="cute-button bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white border-0">
                <History className="w-4 h-4 mr-2" />
                我的作品
              </Button>
            </Link>

            <Link href="/settings">
              <Button variant="ghost" size="sm" className="cute-button bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white border-0">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
