import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Smartphone, Globe, Code, Zap, Heart } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "Write once, run everywhere. Works seamlessly on web, iOS, and Android using React Native Web.",
    },
    {
      icon: Code,
      title: "Unified API",
      description: "Consistent API across all platforms with platform-specific optimizations handled automatically.",
    },
    {
      icon: Zap,
      title: "asChild Pattern",
      description: "Polymorphic components via the asChild prop, avoiding unnecessary wrapper elements.",
    },
    {
      icon: Heart,
      title: "Accessible",
      description: "Built with accessibility in mind. Full ARIA support on web, VoiceOver on iOS, TalkBack on Android.",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              v0.5.0
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Native UI Primitives
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Cross-platform UI components that work everywhere. Build once with React Native,
              deploy to web, iOS, and Android with a unified API.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs">View Documentation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/native-ui-org/primitives">View on GitHub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="border-b py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                One Codebase, All Platforms
              </h2>
              <p className="text-lg text-muted-foreground">
                NativeUI Primitives provides a foundation for building cross-platform design systems
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  How It Works
                </CardTitle>
                <CardDescription>
                  Components that adapt to their environment automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Smartphone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold mb-1">Mobile (iOS/Android)</h3>
                    <p className="text-sm text-muted-foreground">
                      Uses native React Native components for optimal performance and native look and feel.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Globe className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold mb-1">Web</h3>
                    <p className="text-sm text-muted-foreground">
                      Renders semantic HTML via React Native Web with full accessibility support and DOM capabilities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documentation CTA Section */}
      <section className="border-b py-16" id="documentation">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">Browse Components</CardTitle>
                <CardDescription className="text-base">
                  Explore our full library of 16+ cross-platform UI components
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="border-b py-16 bg-muted/50" id="installation">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started
              </h2>
              <p className="text-lg text-muted-foreground">
                Install NativeUI Primitives in your project
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Installation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">npm</h3>
                  <code className="block bg-background border rounded-md p-3 text-sm">
                    npm install @native-ui-org/primitives
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">yarn</h3>
                  <code className="block bg-background border rounded-md p-3 text-sm">
                    yarn add @native-ui-org/primitives
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">pnpm</h3>
                  <code className="block bg-background border rounded-md p-3 text-sm">
                    pnpm add @native-ui-org/primitives
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-muted-foreground">
              Built with ❤️ by the NativeUI community
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              MIT License • Open Source
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
