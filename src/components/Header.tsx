"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onNewUpload?: () => void;
}

export default function Header({ onNewUpload }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onNewUpload}
            className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors"
          >
            LineSketcher
          </button>

          <nav className="flex items-center space-x-4">
            <Link href="/history">
              <Button variant="ghost" size="sm">
                历史记录
              </Button>
            </Link>

            <Link href="/settings">
              <Button variant="ghost" size="sm">
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
