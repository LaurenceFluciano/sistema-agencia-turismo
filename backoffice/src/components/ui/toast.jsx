"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, ...toast }]);
    // auto remove
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, toast.duration || 4000);
  }, []);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full rounded-md shadow-lg p-3 text-sm text-left border ${
              t.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
            }`}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && <div className="mt-1 text-xs opacity-90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default ToastProvider;
