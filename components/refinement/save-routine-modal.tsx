"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { saveRoutineData } from "@/lib/refinement/refinement-state";
import { motion as motionConfig } from "@/lib/motion-config";

interface SaveRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveRoutineModal({ isOpen, onClose }: SaveRoutineModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    saveRoutineData({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
    });

    setSaved(true);
    setTimeout(() => {
      onClose();
      setSaved(false);
      setName("");
      setEmail("");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: motionConfig.duration.modal / 1000,
          ease: motionConfig.easing.standard,
        }}
        className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-bold text-on-surface">Save your routine</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-on-surface transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {saved ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center space-y-3"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-on-surface">Routine saved!</p>
              {email && <p className="text-sm text-muted">Check your email for a copy.</p>}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-muted">
                Get a copy of your routine sent to your email. Both fields are optional.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-2">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-sm font-medium text-on-surface bg-surface-container-low hover:bg-surface-container-highest rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
