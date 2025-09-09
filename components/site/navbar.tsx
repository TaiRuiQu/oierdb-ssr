"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const router = useRouter();

  return (
    <header className="mx-auto w-full max-w-4xl px-4 py-6 flex justify-between items-center">
      <h1 className="text-xl font-mono font-medium">
        <Link href="/">OIerDB</Link>
      </h1>
      <NavigationMenu className="hidden sm:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/oiers">OIers</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/contests">Contests</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/schools">Schools</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="sm:hidden w-32">
        <Select onValueChange={(value) => router.push(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Menu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="/">Home</SelectItem>
            <SelectItem value="/oiers">OIers</SelectItem>
            <SelectItem value="/contests">Contests</SelectItem>
            <SelectItem value="/schools">Schools</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
