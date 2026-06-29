import Link from "next/link";
import { RESTAURANT_BG } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      <div
        className="hidden w-1/2 bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${RESTAURANT_BG})` }}
      >
        <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-black/20 p-12">
          <blockquote className="max-w-md text-white">
            <p className="text-2xl font-semibold leading-relaxed">
              &ldquo;RestoFlow transformed how we run our restaurant. Reservations, kitchen, and analytics — all in one place.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-white/70">— Maria Santos, Owner of Bella Vista</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
