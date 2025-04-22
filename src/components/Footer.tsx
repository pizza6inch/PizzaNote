"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Facebook, Instagram, Mail } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  // const [email, setEmail] = useState("");
  // const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error" | "maintenance">("idle");

  // const handleSubscribe = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Simulate subscription success
  //   setSubscriptionStatus("success");

  //   // Reset after 3 seconds
  //   setTimeout(() => {
  //     setSubscriptionStatus("idle");
  //     setEmail("");
  //   }, 3000);
  // };

  return (
    <footer className=" bg-background dark:bg-background border-t dark:border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10">
          <div className="md:col-span-6 pb-3 flex flex-col justify-center items-center">
            <h5 className="text-md font-medium mb-4">追蹤</h5>
            <ul className="flex space-x-4 mb-4">
              <li>
                <Link href="https://github.com/pizza6inch" target="_blank" rel="noopener">
                  <Button variant="outline" size="icon" className="rounded-full dark:bg-card dark:hover:bg-accent">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              </li>

              <li>
                <Link href="https://www.instagram.com" target="_blank" rel="noopener">
                  <Button variant="outline" size="icon" className="rounded-full dark:bg-card dark:hover:bg-accent">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="mailto:pizza6inch@gmail.com" target="_blank" rel="noopener">
                  <Button variant="outline" size="icon" className="rounded-full dark:bg-card dark:hover:bg-accent">
                    <Mail className="h-5 w-5" />
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-6 text-center flex justify-center items-center">
            <Link href="/" className=" flex items-center gap-2">
              <Logo />
            </Link>
          </div>
        </div>

        <div className="border-t py-4 text-center text-sm text-gray-600 dark:text-gray-400 dark:border-border">
          © 2025-2025 披薩筆記 | All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
