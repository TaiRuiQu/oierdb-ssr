import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Database } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="mx-auto w-full max-w-4xl py-6 flex justify-between items-center">
      <h1 className="text-xl font-mono">OIerDB</h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}


