"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, APP_TAGLINE, RESTAURANT_BG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${RESTAURANT_BG})` }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/60 via-amber-950/40 to-background" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 border-orange-400/30 bg-orange-500/20 text-orange-100">
            {APP_TAGLINE}
          </Badge>
        </motion.div>

        <motion.h1
          className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Run your restaurant like a{" "}
          <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            Michelin-star operation
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-lg text-white/80"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {APP_NAME} unifies reservations, kitchen ops, inventory, and analytics
          in one premium platform built for modern restaurateurs.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="bg-orange-500 px-8 hover:bg-orange-600"
            asChild
          >
            <Link href="/auth/register">
              Start Free Trial
              <ArrowRight className="ml-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            asChild
          >
            <Link href="/features">
              <Play className="mr-1 size-4" />
              Explore Features
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
