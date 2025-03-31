"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error" | "maintenance">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription success
    setSubscriptionStatus("success");

    // Reset after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus("idle");
      setEmail("");
    }, 3000);
  };

  return (
    <footer className="mt-12 bg-background dark:bg-background border-t dark:border-border">
      <div className="container">
        <div className="row justify-content-center pb-4">
          <div className="col-12 text-center mb-5">
            <Link href="/">
              {/* Logo would go here if needed */}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-4">
          <div className="lg:col-span-8 text-center">
            <h4 className="text-xl font-medium mb-6">免費訂閱電子報，每週二學習後端技術🚀</h4>
            <div className="newsletter max-w-xl mx-auto">
              {subscriptionStatus === "success" && (
                <div className="success bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 p-3 rounded mb-4">
                  已發送 Email 驗證信！請前往信箱驗證你的訂閱
                </div>
              )}
              {subscriptionStatus === "error" && (
                <div className="error bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 p-3 rounded mb-4">
                  訂閱失敗，請檢查 Email 是否輸入錯誤，或是聯繫 service@kucw.io 取得協助
                </div>
              )}
              {subscriptionStatus === "maintenance" && (
                <div className="maintenance bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 p-3 rounded mb-4">
                  電子報伺服器正在維護中，請稍後再試
                </div>
              )}
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 justify-center">
                <div className="flex-grow max-w-md">
                  <Input
                    type="email"
                    placeholder="輸入你的 Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full dark:bg-card"
                  />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  免費訂閱
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 pb-3">
            <h5 className="text-lg font-medium mb-4">追蹤古古</h5>
            <ul className="flex space-x-4 mb-4">
              <li>
                <Link href="https://github.com/kucw" target="_blank" rel="noopener">
                  <Button variant="outline" size="icon" className="rounded-full dark:bg-card dark:hover:bg-accent">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="https://www.facebook.com/kucw.io" target="_blank" rel="noopener">
                  <Button variant="outline" size="icon" className="rounded-full dark:bg-card dark:hover:bg-accent">
                    <Facebook className="h-5 w-5" />
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/kucw.io/" target="_blank" rel="noopener">
                  <Button variant="outline" size="icon" className="rounded-full dark:bg-card dark:hover:bg-accent">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </Link>
              </li>
            </ul>
            <p className="dark:text-gray-300">聯絡信箱: service@kucw.io</p>
          </div>
        </div>

        <div className="border-t py-4 text-center text-sm text-gray-600 dark:text-gray-400 dark:border-border">
          © 2020-2025 古古的後端筆記 | All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
