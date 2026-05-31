import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={loading ? undefined : onCancel} />
      <div className="relative bg-background border border-border p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 
          className="mb-4 text-foreground"
          style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
        >
          {title}
        </h2>
        <p className="text-muted-foreground mb-6" style={{ lineHeight: 1.7 }}>
          {message}
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ letterSpacing: "0.06em" }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Déconnexion...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}