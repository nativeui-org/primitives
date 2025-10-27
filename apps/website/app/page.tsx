import Link from "next/link";

export default function HomePage() {
  const items = [
    { href: "/primitives/view", label: "View" },
    { href: "/primitives/text", label: "Text" },
    { href: "/primitives/switch", label: "Switch" },
    { href: "/primitives/checkbox", label: "Checkbox" },
  ];

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-semibold mb-6">Native UI Primitives</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Showcasing `@native-ui-org/primitives` rendered on the web using Next.js, Tailwind, and shadcn-style components.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              className="block rounded-lg border bg-card p-4 hover:shadow-sm transition"
              href={item.href}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-muted-foreground">View examples</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
