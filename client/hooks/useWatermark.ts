import { useEffect } from "react";

/**
 * Watermarks eligible images with tiled diagonal text.
 * - Tries to bake watermark via Canvas (DPR-aware) so Save As includes it
 * - Falls back to CSS/SVG overlay if canvas is CORS-tainted
 * - Targets specific selectors; respects exclusion rules
 * - Lazy via IntersectionObserver; handles dynamic images via MutationObserver
 */
export function useWatermark() {
  useEffect(() => {
    const TEXT = "ASHISH PROPERTY";
    const ANGLE_DEG = -30;
    const OPACITY = 0.18;
    const FONT_SIZE = 14; // CSS px at 1x
    const FONT_WEIGHT = 700;
    const TILE_SPACING = 48; // px at 1x; effective tile is larger to fit rotation

    const selectors = [
      '[data-role="property-hero"] img',
      '.property-hero img',
      '.property-gallery img',
      '.lightbox img',
      '[role="dialog"] img',
    ];

    const exclude = (img: HTMLImageElement) => {
      if (!img || img.dataset.noWm === "true") return true;
      if (img.classList.contains("no-wm")) return true;
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      if (w < 120 || h < 120) return true;
      return false;
    };

    const alreadyProcessed = (img: HTMLImageElement) => img.dataset.wmProcessed === "1";
    const markProcessed = (img: HTMLImageElement) => {
      img.dataset.wmProcessed = "1";
    };

    const ensureLoaded = (img: HTMLImageElement) =>
      new Promise<void>((resolve, reject) => {
        if (img.complete && img.naturalWidth > 0) return resolve();
        const onLoad = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error("img-error"));
        };
        const cleanup = () => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
        };
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onError);
      });

    const createPatternCanvas = (dpr: number) => {
      const tileBase = TILE_SPACING * 4; // larger tile to get nice spacing when rotated
      const tile = Math.max(160, tileBase); // min
      const w = Math.round(tile * dpr);
      const h = Math.round(tile * dpr);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return c;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, tile, tile);

      // Diagonal background is transparent; draw multiple instances
      ctx.save();
      ctx.translate(tile / 2, tile / 2);
      ctx.rotate((ANGLE_DEG * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${FONT_WEIGHT} ${FONT_SIZE}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
      ctx.fillStyle = `rgba(0,0,0,${OPACITY})`;
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw central text and 4 neighbors to ensure tiling continuity
      const step = TILE_SPACING * 2;
      const positions = [
        [0, 0],
        [-step, -step],
        [step, step],
        [-step, step],
        [step, -step],
      ];
      for (const [x, y] of positions as number[][]) {
        ctx.fillText(TEXT, x, y);
      }
      ctx.restore();

      return c;
    };

    const bakeWatermark = async (img: HTMLImageElement) => {
      await ensureLoaded(img);
      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) throw new Error("no-size");

      // Load the image into an offscreen Image with CORS attempt
      const src = img.currentSrc || img.src;
      const off = new Image();
      off.crossOrigin = "anonymous";
      off.decoding = "async";
      off.loading = "eager";
      const loadPromise = new Promise<void>((resolve, reject) => {
        off.onload = () => resolve();
        off.onerror = () => reject(new Error("cors-blocked"));
      });
      off.src = src;
      await loadPromise;

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("ctx");

      ctx.scale(dpr, dpr);
      ctx.drawImage(off, 0, 0, w, h);

      // Overlay pattern
      const patCanvas = createPatternCanvas(dpr);
      const pat = ctx.createPattern(patCanvas, "repeat");
      if (pat) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = pat as any;
        ctx.fillRect(0, 0, w, h);
      }

      // Try to export without taint errors
      return await new Promise<string>((resolve, reject) => {
        try {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve(url);
              } else {
                // Fallback to dataURL if blob failed
                try {
                  const data = canvas.toDataURL();
                  resolve(data);
                } catch (e) {
                  reject(new Error("toDataURL"));
                }
              }
            },
            "image/png",
            0.92,
          );
        } catch (e) {
          reject(new Error("tainted"));
        }
      });
    };

    const setOverlay = (img: HTMLImageElement) => {
      const parent = img.closest("[data-role=property-hero], .property-hero, .lightbox, [role=dialog], [role=dialog], [role='dialog']") || img.parentElement;
      if (!parent) return;

      const host = parent as HTMLElement;
      const prev = host.querySelector<HTMLElement>("[data-wm-overlay='1']");
      if (prev) return;

      // Ensure positioning context
      const style = window.getComputedStyle(host);
      if (style.position === "static") {
        (host as HTMLElement).style.position = "relative";
      }

      const overlay = document.createElement("div");
      overlay.setAttribute("data-wm-overlay", "1");
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "2";
      overlay.style.mixBlendMode = "normal";
      overlay.style.opacity = String(OPACITY);

      // Build SVG tile for CSS background
      const tileSize = 240; // px
      const svg = encodeURIComponent(
        `<?xml version='1.0' encoding='UTF-8'?>` +
          `<svg xmlns='http://www.w3.org/2000/svg' width='${tileSize}' height='${tileSize}' viewBox='0 0 ${tileSize} ${tileSize}'>` +
          `<defs>` +
          `<style>` +
          `@font-face{font-family:Inter; font-weight:${FONT_WEIGHT}; src:local(Inter);}` +
          `</style>` +
          `</defs>` +
          `<g transform='translate(${tileSize / 2} ${tileSize / 2}) rotate(${ANGLE_DEG})'>` +
          `<text x='0' y='0' text-anchor='middle' dominant-baseline='central' font-family='Inter, Arial, sans-serif' font-weight='${FONT_WEIGHT}' font-size='${FONT_SIZE}' fill='rgba(0,0,0,1)'>${TEXT}</text>` +
          `</g>` +
          `</svg>`,
      );
      const dataUrl = `url("data:image/svg+xml,${svg}")`;
      overlay.style.backgroundImage = dataUrl;
      overlay.style.backgroundRepeat = "repeat";
      overlay.style.backgroundSize = `${tileSize}px ${tileSize}px`;

      host.appendChild(overlay);
    };

    const process = async (img: HTMLImageElement) => {
      if (alreadyProcessed(img) || exclude(img)) return;
      try {
        const url = await bakeWatermark(img);
        if (url) {
          // Replace source with watermarked URL without layout shift
          img.src = url;
          markProcessed(img);
          return;
        }
      } catch {
        // fall back
      }
      // CSS/SVG overlay fallback
      setOverlay(img);
      markProcessed(img);
    };

    // Intersection observer per eligible image
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.target instanceof HTMLImageElement) {
            process(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );

    const observeExisting = () => {
      const nodes = document.querySelectorAll<HTMLImageElement>(selectors.join(","));
      nodes.forEach((img) => {
        if (!alreadyProcessed(img) && !exclude(img)) io.observe(img);
      });
    };

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n instanceof HTMLImageElement) {
              if (!alreadyProcessed(n) && !exclude(n)) io.observe(n);
            } else if (n instanceof HTMLElement) {
              const imgs = n.querySelectorAll<HTMLImageElement>(selectors.join(","));
              imgs.forEach((img) => {
                if (!alreadyProcessed(img) && !exclude(img)) io.observe(img);
              });
            }
          });
        } else if (m.type === "attributes" && m.target instanceof HTMLImageElement && m.attributeName === "src") {
          const img = m.target as HTMLImageElement;
          img.dataset.wmProcessed = ""; // reset so it can reprocess on new src
          if (!exclude(img)) io.observe(img);
        }
      }
    });

    // Start observers
    observeExisting();
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => {
      try { io.disconnect(); } catch {}
      try { mo.disconnect(); } catch {}
      // Cleanup ephemeral overlays created; leave baked images as-is
      document
        .querySelectorAll<HTMLElement>("[data-wm-overlay='1']")
        .forEach((el) => el.remove());
    };
  }, []);
}
