import Link from "next/link";
import { Utensils } from "lucide-react";
import { APP_NAME, MARKETING_NAV } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                <Utensils className="size-5" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The all-in-one platform for modern restaurant management. Run your restaurant smarter.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {MARKETING_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/support" className="hover:text-foreground">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Newsletter</h4>
            <p className="mb-3 text-sm text-muted-foreground">Get restaurant tips and product updates.</p>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="border-white/10 bg-background/50" />
              <Button className="shrink-0 bg-orange-500 hover:bg-orange-600">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
