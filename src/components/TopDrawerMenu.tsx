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

import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";

type menuContentType = {
  title: string;
  links: string;
  content: { links: string; text: string }[];
}[];

export default function TopDrawerMenu({ content }: { content: menuContentType }) {
  // TODO: 用state來控制內容的開關
  const [openIndex, setOpenIndex] = useState<null | number>(null);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Menu size={36} className="cursor-pointer" />
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerContent className="bg-background h-fit fixed bottom-0 left-0 right-0 outline-none">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl font-bold">菜單</DrawerTitle>
            <DrawerDescription className="text-center text-sm text-muted-foreground">OWO</DrawerDescription>
          </DrawerHeader>
          <nav className="flex flex-col gap-4 p-6 text-lg">
            {content.map((item, index) => (
              <div key={index} className="relative group">
                {item.content.length === 0 ? (
                  <Link
                    className="flex items-center justify-start px-2 py-2 text-foreground hover:text-primary"
                    href={item.links}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center justify-start px-2 py-2 text-foreground hover:text-primary"
                  >
                    <text>{item.title}</text>
                    {item.content.length > 0 && <ChevronDown />}
                  </button>
                )}

                {openIndex === index && item.content.length > 0 && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {item.content.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.links}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground rounded"
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
