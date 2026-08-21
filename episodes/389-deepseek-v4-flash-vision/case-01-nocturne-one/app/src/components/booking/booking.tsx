import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BookingOrigin = { x: number; y: number; w: number; h: number };

type BookingContextValue = {
  open: (anchor: HTMLElement | null) => void;
  close: () => void;
  isOpen: boolean;
  origin: BookingOrigin | null;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState<BookingOrigin | null>(null);

  const open = useCallback((anchor: HTMLElement | null) => {
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      setOrigin({ x: r.left, y: r.top, w: r.width, h: r.height });
    } else {
      setOrigin(null);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ open, close, isOpen, origin }),
    [open, close, isOpen, origin],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
