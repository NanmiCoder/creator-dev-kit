import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const DIRS = ["前", "右前", "右", "右后", "后", "左后", "左", "左前"];

/**
 * Interactive spatial sound field. A single canvas driven by one rAF
 * loop, completely isolated from the React tree (no state, no re-renders).
 * Pointer direction shifts the azimuth emphasis, pulses and waveform;
 * the field drifts gently when idle.
 */
export function SoundField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let size = 0;
    let dpr = 1;
    const pointer = { x: 0, y: 0, active: false, lastMove: 0 };
    const sm = { ang: -Math.PI / 2, px: 0, py: 0 };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.max(240, Math.min(rect.width, 680));
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      pointer.active = true;
      pointer.lastMove = performance.now();
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const draw = (now: number) => {
      const c = size / 2;
      const R = c * 0.72;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const idle = !pointer.active || now - pointer.lastMove > 4200;
      const prox = idle
        ? 0.42
        : Math.max(
            0,
            1 - Math.hypot(pointer.x, pointer.y) / 1.5,
          );
      const targetAng = idle
        ? now * 0.00007 - Math.PI / 2
        : Math.atan2(pointer.y, pointer.x);
      let d = targetAng - sm.ang;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      sm.ang += d * 0.06;
      sm.px += (pointer.x - sm.px) * 0.06;
      sm.py += (pointer.y - sm.py) * 0.06;
      const ang = sm.ang;
      const deg = Math.round(
        (((ang + Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) /
          (Math.PI / 45),
      );
      const activeIdx = Math.round(deg / 45) % 8;
      const fieldRot = sm.px * 0.16;

      /* rings */
      const ringAlpha = [0.09, 0.11, 0.13, 0.16];
      [0.27, 0.5, 0.73, 1].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(c, c, R * r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${ringAlpha[i]})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      /* degree ticks on the outer ring */
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1;
      for (let t = 0; t < 24; t++) {
        const a = (t / 24) * Math.PI * 2 + fieldRot;
        const l1 = Math.cos(a) * R;
        const l2 = Math.sin(a) * R;
        ctx.beginPath();
        ctx.moveTo(c + l1 * 0.97, c + l2 * 0.97);
        ctx.lineTo(c + l1, c + l2);
        ctx.stroke();
      }

      /* radial spokes */
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      for (let t = 0; t < 8; t++) {
        const a = (t / 8) * Math.PI * 2 - Math.PI / 2 + fieldRot;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.lineTo(c + Math.cos(a) * R, c + Math.sin(a) * R);
        ctx.stroke();
      }

      /* undulating waveform ring, peak toward the active azimuth */
      const N = 140;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const th = (i / N) * Math.PI * 2 + fieldRot;
        let dd = th - ang;
        while (dd > Math.PI) dd -= Math.PI * 2;
        while (dd < -Math.PI) dd += Math.PI * 2;
        const bias = Math.pow(Math.max(0, Math.cos(dd)), 2);
        const amp =
          (4 + 13 * bias * prox) * (0.55 + 0.45 * Math.sin(now * 0.0024 + i * 0.3));
        const r = R * 0.57 + amp;
        const x = c + Math.cos(th) * r;
        const y = c + Math.sin(th) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      /* azimuth pulses */
      for (let k = 0; k < 3; k++) {
        const ph = (now * 0.00035 + k / 3) % 1;
        const pr = ph * R * 0.9;
        ctx.beginPath();
        ctx.arc(c, c, pr, ang - 0.42, ang + 0.42);
        ctx.strokeStyle = `rgba(207,154,85,${(1 - ph) * 0.5})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        const px = c + Math.cos(ang) * pr;
        const py = c + Math.sin(ang) * pr;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(207,154,85,${(1 - ph) * 0.7})`;
        ctx.fill();
      }

      /* drifting particles */
      for (let i = 0; i < 44; i++) {
        const a =
          i * 2.39996 + now * 0.00006 * (1 + (i % 3) * 0.35) + fieldRot * 2;
        const rr = R * (0.3 + ((i * 37) % 100) / 100 * 0.62);
        const x = c + Math.cos(a) * rr;
        const y = c + Math.sin(a) * rr;
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.16 + 0.14 * Math.sin(now * 0.001 + i)})`;
        ctx.fill();
      }

      /* direction markers */
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 4 + fieldRot;
        const active = i === activeIdx;
        const x = c + Math.cos(a) * R;
        const y = c + Math.sin(a) * R;
        if (active) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(207,154,85,0.9)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(207,154,85,0.28)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.fill();
        }
        const lx = c + Math.cos(a) * R * 1.14;
        const ly = c + Math.sin(a) * R * 1.14;
        ctx.font = '11px "Geist Mono", monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = active ? "rgba(217,171,108,1)" : "rgba(160,166,174,0.6)";
        ctx.fillText(DIRS[i], lx, ly);
      }

      /* listener head */
      const hr = c * 0.085;
      ctx.beginPath();
      ctx.arc(c, c, hr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(14,16,19,0.92)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
      /* ear cups */
      ctx.beginPath();
      ctx.arc(c - hr * 1.05, c, hr * 0.42, 0, Math.PI * 2);
      ctx.arc(c + hr * 1.05, c, hr * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fill();
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = "rgba(160,166,174,0.75)";
      ctx.fillText("听者", c, c + hr + 16);

      /* azimuth readout */
      ctx.textAlign = "left";
      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillStyle = "rgba(217,171,108,0.95)";
      ctx.fillText(
        `方位 ${String(deg).padStart(3, "0")}° · ${DIRS[activeIdx]}`,
        10,
        18,
      );
      ctx.fillStyle = "rgba(160,166,174,0.55)";
      ctx.fillText(
        `proximity ${Math.round(prox * 100)}%`,
        10,
        34,
      );
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const drawStatic = () => {
      draw(0);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[0]?.isIntersecting ?? true;
        if (vis && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!vis && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) drawStatic();
    });
    ro.observe(wrap);

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onLeave);

    resize();
    if (reduced) {
      drawStatic();
    } else {
      running = true;
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className="relative flex w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="block touch-none"
        aria-label="可交互的空间声场可视化，移动指针可改变声像方位"
        role="img"
      />
    </div>
  );
}
