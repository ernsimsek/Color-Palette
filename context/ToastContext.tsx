"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ToastCtx {
  show: (msg: string) => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback((m: string) => {
    setMsg(m);
    setVisible(true);
    setTimeout(() => setVisible(false), 2200);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          background: "#5b4fff",
          color: "#fff",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 500,
          padding: "10px 22px",
          borderRadius: 100,
          letterSpacing: "0.05em",
          zIndex: 9999,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {msg}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
