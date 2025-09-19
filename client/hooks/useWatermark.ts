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
    const TEXT = "AP.IN";
    const OPACITY = 0.45; // pill bg opacity
    const FONT_WEIGHT = 700;

    const selectors = [
      '[data-role="property-hero"] img',
      '.property-hero img',
      '.property-gallery img',
      '.lightbox img',
      '[role="dialog"] img',
      'img[data-wm="1"]',
    ];

    const exclude = (img: HTMLImageElement) => {
      if (!img || img.dataset.noWm === "true") return true;
      if (img.classList.contains("no-wm")) return true;
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      if (w < 120 || h < 120) return true;
      return false;
    };

    const alreadyProcessed = (img: HTMLImageElement) =>
      img.dataset.wmProcessed === "1";
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

    const drawRoundedRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      const radius = Math.min(r, h / 2, w / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    const measureTextWithSpacing = (
      ctx: CanvasRenderingContext2D,
      text: string,
      letterSpacing: number,
    ) => {
      let w = 0;
      const upper = text.toUpperCase();
      for (let i = 0; i < upper.length; i++) {
        const m = ctx.measureText(upper[i]);
        w += m.width;
        if (i !== upper.length - 1) w += letterSpacing;
      }
      return w;
    };

    const bakeWatermark = async (img: HTMLImageElement) => {
      await ensureLoaded(img);

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
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("ctx");

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(off, 0, 0, w, h);

      // Determine displayed size for responsive metrics
      const rect = img.getBoundingClientRect();
      const dispW = Math.max(1, rect.width || img.width || w);
      const dispH = Math.max(1, rect.height || img.height || h);
      const scale = w / dispW; // CSS px -> image px

      const isMd = window.innerWidth >= 768;
      const marginCss = isMd ? 14 : 8;
      const padVcss = isMd ? 8 : 6;
      const padHcss = isMd ? 10 : 8;
      const baseFontCss = isMd ? 14 : 11;
      const fontCss = dispH < 220 ? Math.max(10, baseFontCss - 1) : baseFontCss;
      const letterSpacingCss = fontCss * 0.08;
      const iconDiaCss = isMd ? 12 : 10;
      const gapCss = isMd ? 6 : 5;

      const margin = marginCss * scale;
      let padV = padVcss * scale;
      let padH = padHcss * scale;
      let fontPx = fontCss * scale;
      let letterSpacing = letterSpacingCss * scale;
      let iconDia = iconDiaCss * scale;
      let gap = gapCss * scale;

      ctx.font = `${FONT_WEIGHT} ${fontPx}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
      const text = TEXT.toUpperCase();
      let textW = measureTextWithSpacing(ctx, text, letterSpacing);
      let iconW = iconDia;
      let pillW = Math.ceil(padH + iconW + (iconW ? gap : 0) + textW + padH);
      let pillH = Math.ceil(padV * 2 + Math.max(iconDia, fontPx));

      // Constrain width to <= 28% of displayed width (in image px), and >= 120px
      const maxAllowed = dispW * 0.28 * scale;
      const minAllowed = 120 * scale;
      if (pillW > maxAllowed) {
        const s = Math.max(0.6, maxAllowed / pillW);
        fontPx *= s;
        letterSpacing *= s;
        iconDia *= s;
        padV *= s;
        padH *= s;
        gap *= s;
        ctx.font = `${FONT_WEIGHT} ${fontPx}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
        textW = measureTextWithSpacing(ctx, text, letterSpacing);
        iconW = iconDia;
        pillW = Math.ceil(padH + iconW + (iconW ? gap : 0) + textW + padH);
        pillH = Math.ceil(padV * 2 + Math.max(iconDia, fontPx));
      }
      if (pillW < minAllowed) {
        pillW = minAllowed;
      }

      const x = Math.max(0, w - pillW - margin);
      const y = Math.max(0, h - pillH - margin);

      // Draw pill background with shadow and border
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 2 * scale;
      ctx.shadowOffsetY = 1 * scale;
      drawRoundedRect(ctx, x, y, pillW, pillH, 9999 * scale);
      ctx.fillStyle = `rgba(0,0,0,${OPACITY})`;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.lineWidth = 1 * scale;
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.stroke();

      // Optional gradient underline inside pill
      const ulH = 2 * scale;
      const ulY = y + pillH - ulH - 1 * scale;
      const grad = ctx.createLinearGradient(x + padH, 0, x + pillW - padH, 0);
      grad.addColorStop(0, "#0ea5e9");
      grad.addColorStop(1, "#14b8a6");
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, x + padH, ulY, pillW - padH * 2, ulH, ulH);
      ctx.fill();

      // Draw icon (circle + AP)
      const cy = y + pillH / 2;
      let cx = x + padH + iconDia / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, iconDia / 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fill();
      ctx.lineWidth = 1 * scale;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.stroke();
      // AP letters
      const monoFont = Math.max(8 * scale, iconDia * 0.55);
      ctx.fillStyle = "#ffffff";
      ctx.font = `${FONT_WEIGHT} ${monoFont}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AP", cx, cy);

      // Draw text
      ctx.font = `${FONT_WEIGHT} ${fontPx}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      let tx = x + padH + iconDia + (iconDia ? gap : 0);
      const ty = cy;
      // manual letter spacing
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        ctx.fillText(ch, tx, ty);
        tx += ctx.measureText(ch).width + letterSpacing;
      }
      ctx.restore();

      // Export
      return await new Promise<string>((resolve, reject) => {
        try {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve(url);
              } else {
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
      const parent =
        img.closest(
          "[data-role=property-hero], .property-hero, .lightbox, [role=dialog], [role='dialog']",
        ) || img.parentElement;
      if (!parent) return;

      const host = parent as HTMLElement;
      const prev = host.querySelector<HTMLElement>("[data-wm-overlay='1']");
      if (prev) return;

      const rect = img.getBoundingClientRect();
      const dispW = Math.max(1, rect.width || img.width);
      const dispH = Math.max(1, rect.height || img.height);
      const isMd = window.innerWidth >= 768;

      // Ensure positioning context
      const style = window.getComputedStyle(host);
      if (style.position === "static") {
        host.style.position = "relative";
      }

      const overlay = document.createElement("div");
      overlay.setAttribute("data-wm-overlay", "1");
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.position = "absolute";
      overlay.style.right = isMd ? "14px" : "8px";
      overlay.style.bottom = isMd ? "14px" : "8px";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "3";

      // Build pill
      const pill = document.createElement("div");
      pill.style.position = "relative";
      pill.style.display = "inline-flex";
      pill.style.alignItems = "center";
      pill.style.borderRadius = "9999px";
      pill.style.background = "rgba(0,0,0,0.45)";
      pill.style.padding = isMd ? "8px 10px" : "6px 8px";
      pill.style.border = "1px solid rgba(255,255,255,0.15)";
      pill.style.boxShadow = "0 1px 2px rgba(0,0,0,0.25)";
      pill.style.backdropFilter = "blur(2px)";
      pill.style.maxWidth = `${Math.floor(dispW * 0.28)}px`;
      pill.style.minWidth = "120px";

      const icon = document.createElement("span");
      icon.textContent = "AP";
      icon.style.display = "inline-flex";
      icon.style.alignItems = "center";
      icon.style.justifyContent = "center";
      icon.style.width = isMd ? "12px" : "10px";
      icon.style.height = isMd ? "12px" : "10px";
      icon.style.borderRadius = "9999px";
      icon.style.background = "rgba(255,255,255,0.12)";
      icon.style.border = "1px solid rgba(255,255,255,0.25)";
      icon.style.color = "#fff";
      icon.style.fontWeight = String(FONT_WEIGHT);
      icon.style.fontSize = isMd ? "8px" : "7px";
      icon.style.marginRight = isMd ? "6px" : "5px";

      const text = document.createElement("span");
      text.textContent = TEXT;
      text.style.color = "#fff";
      text.style.fontWeight = String(FONT_WEIGHT);
      text.style.textTransform = "uppercase";
      const baseFont = dispH < 220 ? (isMd ? 13 : 10) : isMd ? 14 : 11;
      text.style.fontSize = `${baseFont}px`;
      text.style.letterSpacing = `${Math.round(baseFont * 0.08)}px`;
      text.style.whiteSpace = "nowrap";
      text.style.overflow = "hidden";
      text.style.textOverflow = "ellipsis";
      text.style.maxWidth = `calc(${Math.floor(dispW * 0.28)}px - ${isMd ? 10 + 12 + 6 + 10 : 8 + 10 + 5 + 8}px)`;

      // Gradient underline
      const underline = document.createElement("div");
      underline.style.position = "absolute";
      underline.style.left = isMd ? "10px" : "8px";
      underline.style.right = isMd ? "10px" : "8px";
      underline.style.bottom = "2px";
      underline.style.height = "2px";
      underline.style.borderRadius = "2px";
      underline.style.background = "linear-gradient(90deg, #0ea5e9, #14b8a6)";

      pill.appendChild(icon);
      pill.appendChild(text);
      pill.appendChild(underline);
      overlay.appendChild(pill);
      host.appendChild(overlay);
    };

    const process = async (img: HTMLImageElement) => {
      if (alreadyProcessed(img) || exclude(img)) return;
      try {
        const url = await bakeWatermark(img);
        if (url) {
          // Replace source with watermarked URL without layout shift
          const prev = img.dataset.wmUrl;
          img.src = url;
          img.dataset.wmUrl = url;
          if (prev && prev.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(prev);
            } catch {}
          }
          markProcessed(img);
          return;
        }
      } catch {
        // fall back to CSS overlay pill
      }
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
      const nodes = document.querySelectorAll<HTMLImageElement>(
        selectors.join(","),
      );
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
              const imgs = n.querySelectorAll<HTMLImageElement>(
                selectors.join(","),
              );
              imgs.forEach((img) => {
                if (!alreadyProcessed(img) && !exclude(img)) io.observe(img);
              });
            }
          });
        } else if (
          m.type === "attributes" &&
          m.target instanceof HTMLImageElement &&
          m.attributeName === "src"
        ) {
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
      try {
        io.disconnect();
      } catch {}
      try {
        mo.disconnect();
      } catch {}
      // Cleanup ephemeral overlays created; leave baked images as-is
      document
        .querySelectorAll<HTMLElement>("[data-wm-overlay='1']")
        .forEach((el) => el.remove());
    };
  }, []);
}
