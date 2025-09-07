import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="mx-auto w-full max-w-4xl py-6 flex justify-between items-center">
      <h1 className="text-xl font-mono font-medium">
        <Link href="/">OIerDB</Link>
      </h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/oiers">
              <NavigationMenuLink>OIers</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/contests">
              <NavigationMenuLink>Contests</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/schools">
              <NavigationMenuLink>Schools</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
