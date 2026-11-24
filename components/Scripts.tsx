"use client";
import { useEffect } from "react";

declare global {
  interface Window { __dwScripts?: boolean }
}

// Loads the page's behaviour scripts one after another, in order, once React has taken over the page.
// (They change the page directly, so they must not run before hydration.) Every navigation is a full page load,
// so this runs once per page view.
export function Scripts({ srcs }: { srcs: string[] }) {
  useEffect(() => {
    if (window.__dwScripts) return;
    window.__dwScripts = true;
    (async () => {
      for (const src of srcs) {
        await new Promise<void>(done => {
          const el = document.createElement("script");
          el.src = src;
          el.async = false;
          el.onload = el.onerror = () => done();
          document.body.appendChild(el);
        });
      }
      document.dispatchEvent(new Event("dw:ready"));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {srcs.map(src => (
        <link key={src} rel="preload" as="script" href={src} />
      ))}
    </>
  );
}
