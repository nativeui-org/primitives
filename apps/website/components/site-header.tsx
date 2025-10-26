import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="container h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Native UI</Link>
        <nav className="text-sm text-muted-foreground">
          <Link className="hover:text-foreground" href="/">Home</Link>
        </nav>
      </div>
    </header>
  );
}
