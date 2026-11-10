import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Brand } from "./app-shell";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/"><Brand dark={false} /></Link>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm"><Link to="/verify-college">Check status</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
          <Button asChild size="sm"><Link to="/register-college">Register college</Link></Button>
        </nav>
      </div>
    </header>
  );
}

export function AuthLayout({ title, description, children, wide }: { title: string; description: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="relative">
        <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-72 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className={`relative mx-auto px-4 py-12 md:py-16 ${wide ? "max-w-3xl" : "max-w-md"}`}>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          <div className="surface mt-8 p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
