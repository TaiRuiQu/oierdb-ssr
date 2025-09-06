import Link from "next/link"

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-4xl px-4 py-10 text-center">
      <p className="text-xs text-muted-foreground">
        Powered by OIerDB
        <span className="mx-2">·</span>
        <Link href="https://github.com/TaiRuiQu/oierdb-ssr" className="underline-offset-4 hover:underline">Source Code</Link>
      </p>
    </footer>
  )
}


