"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, ShoppingBag, Star, Utensils } from "lucide-react";

const stats = [
  { label: "Restaurants", value: 500, suffix: "+", icon: Utensils },
  { label: "Orders Processed", value: 2, suffix: "M+", icon: ShoppingBag },
  { label: "Satisfaction Rate", value: 98, suffix: "%", icon: Star },
  { label: "Countries", value: 50, suffix: "+", icon: Globe },
];

function AnimatedNumber({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative -mt-16 z-10 mx-auto max-w-6xl px-4 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-orange-950/20 backdrop-blur-xl lg:grid-cols-4 lg:gap-6 lg:p-8 dark:bg-white/5"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-500">
              <stat.icon className="size-5" />
            </div>
            <p className="text-2xl font-bold text-foreground lg:text-3xl">
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                inView={inView}
              />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
