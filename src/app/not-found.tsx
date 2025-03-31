import React from "react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
          <h2 className="text-2xl font-semibold mb-6">找不到頁面</h2>
          <p className="text-gray-600 mb-8">
            你所尋找的頁面不存在或已經被移除。請回到首頁，或瀏覽其他文章。
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <Button>回到首頁</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
