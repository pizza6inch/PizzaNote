"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Logo from "@/components/Logo";

import { useState } from "react";

import { Menu } from "lucide-react";
import Link from "next/link";

type menuContentType = [
  {
    title: string;
    links: string;
    content: { href: string; text: string }[];
  }
];

export default function TopDrawerMenu({
  content,
}: {
  content: menuContentType;
}) {
  // TODO: 用state來控制內容的開關
  const [contentOpened, setContentOpened] = useState<number | null>(null);

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Menu size={36} className="cursor-pointer" />
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerContent className="bg-background h-fit fixed bottom-0 left-0 right-0 outline-none">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl font-bold">
              菜單
            </DrawerTitle>
            <DrawerDescription className="text-center text-sm text-muted-foreground">
              OWO
            </DrawerDescription>
          </DrawerHeader>
          <nav className="flex flex-col gap-4 p-6 text-lg">
            {content.map((item, index) => (
              <div key={index} className="relative group">
                <Link
                  href={item.links}
                  className="flex items-center px-2 py-2 text-foreground hover:text-primary"
                >
                  {item.title}
                  {item.content.length > 0 && (
                    <span className="ml-auto">▼</span>
                  )}
                </Link>
                {item.content.length > 0 && (
                  <div className="absolute left-0 top-full w-64 bg-background dark:bg-card shadow-2xl rounded-lg overflow-hidden z-10 hidden group-hover:block transition-opacity duration-200">
                    {item.content.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="block px-4 py-4 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <DrawerFooter className="p-4 flex flex-row justify-center items-center">
            <Logo />
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
