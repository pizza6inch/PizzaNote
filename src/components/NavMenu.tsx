"use client";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type menuType = {
  title: string;
  links: string;
  content: {
    links: string;
    text: string;
  }[];
}[];

// 假設這是您的菜單內容

export function MainNav({ menuContent }: { menuContent: menuType }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuContent.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.content.length > 0 ? (
              <>
                <NavigationMenuTrigger className="bg-transparent">{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[250px] gap-0 p-0">
                    <li className="row-span-1">
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.links}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">總覽</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {item.content.map((link, idx) => (
                      <li key={idx} className="row-span-1">
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.links}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium">{link.text}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.links} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// 如果您想要自定義的 hover 下拉菜單，這是另一個選項
export function CustomHoverNav({ menuContent }: { menuContent: menuType }) {
  return (
    <div className="hidden md:flex space-x-4">
      {menuContent.map((item, index) => (
        <div key={index} className="relative group">
          <Link
            href={item.links}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:text-primary transition-colors"
          >
            {item.title}
            {item.content.length > 0 && (
              <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            )}
          </Link>

          {item.content.length > 0 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0, scaleY: 0 }}
                animate={{ opacity: 1, height: "auto", scaleY: 1 }}
                exit={{ opacity: 0, height: 0, scaleY: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute left-0 top-full w-64 bg-card dark:bg-card border border-border shadow-lg rounded-md overflow-hidden z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Link
                  href={item.links}
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  總覽
                </Link>
                {item.content.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.links}
                    className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );
}
