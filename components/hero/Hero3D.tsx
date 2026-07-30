"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* Scena grea (three.js) se încarcă doar pe client, lazy — nu intră în bundle-ul
 * inițial și nu se randează la server. */
const Hero3DScene = dynamic(() => import("./Hero3DScene"), {
  ssr: false,
  loading: () => <StaticGlow />,
});

/* Fallback static: un glow emerald difuz. Se folosește la încărcare și pentru
 * utilizatorii cu prefers-reduced-motion (fără nicio animație). */
function StaticGlow() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(closest-side at 50% 45%, rgba(16,185,129,0.22), transparent 72%)",
      }}
    />
  );
}

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Respectă prefers-reduced-motion: doar glow static, fără scenă animată.
  if (!mounted || reducedMotion) {
    return <StaticGlow />;
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <Hero3DScene />
    </div>
  );
}
