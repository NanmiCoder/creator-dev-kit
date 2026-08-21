import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Spinner, Check, CaretDown } from "@phosphor-icons/react";
import { useBooking } from "./booking/booking";

const STORES = [
  "上海 · 静安旗舰店",
  "上海 · 前滩店",
  "深圳 · 南山店",
  "北京 · 国贸店",
  "线上 · 试听寄送",
];

type Phase = "form" | "submitting" | "success";
type Errors = { name?: string; contact?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^1[3-9]\d{9}$/;

const inputCls = (invalid: boolean) =>
  `w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-3/70 focus:bg-white/[0.06] ${
    invalid
      ? "border-[#c96a4a] focus:border-[#d98a70]"
      : "border-white/12 focus:border-accent/60"
  }`;

export function BookingPanel() {
  const { isOpen, close, origin } = useBooking();
  return (
    <AnimatePresence>
      {isOpen && <PanelInner origin={origin} close={close} />}
    </AnimatePresence>
  );
}

function PanelInner({
  origin,
  close,
}: {
  origin: { x: number; y: number; w: number; h: number } | null;
  close: () => void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("form");
  const [errors, setErrors] = useState<Errors>({});
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [store, setStore] = useState(STORES[0]);

  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const savedFocus = useRef<HTMLElement | null>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  const W = Math.min(540, vw - 28);
  const H = Math.min(660, vh - 40);

  /* measure viewport + focus management */
  useEffect(() => {
    setVw(window.innerWidth);
    setVh(window.innerHeight);
    savedFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      nameRef.current?.focus();
    }, reduced ? 0 : 420);
    return () => {
      window.clearTimeout(t);
      savedFocus.current?.focus?.();
    };
  }, [reduced]);

  /* body scroll lock */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleClose = useCallback(() => {
    if (phase === "submitting") return;
    close();
    setPhase("form");
    setErrors({});
  }, [close, phase]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      handleClose();
      return;
    }
    if (e.key !== "Tab") return;
    const f = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (f.length === 0) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const validate = (): Errors => {
    const errs: Errors = {};
    if (name.trim().length < 2) errs.name = "请输入姓名（至少 2 个字符）";
    const c = contact.trim();
    if (!EMAIL_RE.test(c) && !PHONE_RE.test(c))
      errs.contact = "请输入有效的手机号或邮箱";
    return errs;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.name) {
      nameRef.current?.focus();
      return;
    }
    if (errs.contact) {
      contactRef.current?.focus();
      return;
    }
    setPhase("submitting");
    await new Promise((r) => setTimeout(r, 1100));
    setPhase("success");
  };

  const finalX = (vw - W) / 2;
  const finalY = (vh - H) / 2;
  const originX = origin?.x ?? finalX;
  const originY = origin?.y ?? finalY;
  const originW = origin?.w ?? W;
  const originH = origin?.h ?? 52;

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3.5"
      onKeyDown={onKeyDown}
      role="presentation"
    >
      {/* backdrop */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[6px]"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="glass relative z-10 overflow-hidden"
        initial={
          reduced
            ? false
            : {
                x: originX - finalX,
                y: originY - finalY,
                width: originW,
                height: originH,
                borderRadius: 999,
                opacity: 0.4,
              }
        }
        animate={{
          x: 0,
          y: 0,
          width: W,
          height: H,
          borderRadius: 24,
          opacity: 1,
        }}
        exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.22 } }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* content fades in after the morph */}
        <motion.div
          className="flex h-full flex-col overflow-y-auto p-7 sm:p-9"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 0.3 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 id="booking-title" className="text-[22px] font-semibold text-ink">
                预约试听
              </h3>
              <p className="mt-1.5 text-[13px] leading-[1.7] text-ink-2">
                我们将为你保留 45 分钟专属聆听，无需付款。
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="关闭预约面板"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 text-ink-2 transition-colors duration-200 hover:border-white/28 hover:text-ink"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          <div aria-live="polite" className="mt-6 flex-1">
            {phase === "success" ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                  <span className="absolute inset-0 rounded-full bg-accent/12 blur-[8px]" aria-hidden="true" />
                  <Check size={26} weight="bold" aria-hidden="true" />
                </span>
                <h4 className="mt-6 text-[20px] font-semibold text-ink">预约成功</h4>
                <p className="mt-3 max-w-[36ch] text-[14px] leading-[1.8] text-ink-2">
                  {name.trim()}，我们已收到你的试听预约。
                  <br />
                  {store} 将在 24 小时内与你确认具体时间。
                </p>
                <p className="mt-4 text-[12px] leading-[1.7] text-ink-3">
                  确认邮件已发送至 {contact.trim()}。
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-primary mt-8"
                >
                  完成
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="flex flex-col gap-2">
                  <label htmlFor="bk-name" className="text-[13px] font-medium text-ink-2">
                    姓名
                  </label>
                  <input
                    id="bk-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    placeholder="你的称呼"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "bk-name-err" : undefined}
                    className={inputCls(!!errors.name)}
                    style={{ colorScheme: "dark" }}
                  />
                  {errors.name && (
                    <p id="bk-name-err" className="text-[12px] text-[#d98a70]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <label htmlFor="bk-contact" className="text-[13px] font-medium text-ink-2">
                    手机号或邮箱
                  </label>
                  <input
                    id="bk-contact"
                    ref={contactRef}
                    type="text"
                    autoComplete="tel email"
                    placeholder="用于接收确认信息"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      if (errors.contact)
                        setErrors((p) => ({ ...p, contact: undefined }));
                    }}
                    aria-invalid={!!errors.contact}
                    aria-describedby={errors.contact ? "bk-contact-err" : undefined}
                    className={inputCls(!!errors.contact)}
                    style={{ colorScheme: "dark" }}
                  />
                  {errors.contact && (
                    <p id="bk-contact-err" className="text-[12px] text-[#d98a70]">
                      {errors.contact}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <label htmlFor="bk-store" className="text-[13px] font-medium text-ink-2">
                    试听门店
                  </label>
                  <div className="relative">
                    <select
                      id="bk-store"
                      value={store}
                      onChange={(e) => setStore(e.target.value)}
                      className={`${inputCls(false)} appearance-none pr-11`}
                      style={{ colorScheme: "dark" }}
                    >
                      {STORES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <CaretDown
                      size={14}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={phase === "submitting"}
                  className="btn btn-primary mt-7 w-full"
                >
                  {phase === "submitting" ? (
                    <>
                      <Spinner size={16} className="animate-spin" aria-hidden="true" />
                      提交中…
                    </>
                  ) : (
                    "确认预约"
                  )}
                </button>
                <p className="mt-4 text-center text-[12px] leading-[1.7] text-ink-3">
                  提交即代表同意我们通过所留联系方式与你确认试听时间。
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
