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

export function MainNav({ menuContent, overviewLabel }: { menuContent: menuType; overviewLabel: string }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuContent.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.content.length > 0 ? (
              <>
                <NavigationMenuTrigger className="bg-transparent text-lg font-bold">{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[250px] gap-0 p-0">
                    <li className="row-span-1">
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.links}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-lg font-bold">{overviewLabel}</div>
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
                            <div className="text-lg font-bold">{link.text}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.links} legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()}`}>
                  <p className="text-lg font-bold">{item.title}</p>
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
