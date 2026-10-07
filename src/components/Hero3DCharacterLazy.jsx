import React, { useState, useEffect, Suspense, lazy } from 'react';

// Lazy load Three.js component after initial paint
const Hero3DCharacter = lazy(() => import('./Hero3DCharacter'));

export default function Hero3DCharacterLazy() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if desktop view and after initial paint
    if (typeof window === 'undefined') return;

    // Gracefully disable on screens < 1024px to preserve mobile speed & clean vertical rhythm
    if (window.innerWidth < 1024) {
      return;
    }

    // Lazy load after browser is idle so first paint is unblocked
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(() => setShouldRender(true), { timeout: 800 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setShouldRender(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <Hero3DCharacter />
    </Suspense>
  );
}
// Final submission update
