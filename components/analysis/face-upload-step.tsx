"use client";

import { useState } from "react";
import Image from "next/image";

interface FaceUploadStepProps {
  onImageSelect: (file: File | null) => void;
  currentImage: File | null;
}

export function FaceUploadStep({ onImageSelect }: FaceUploadStepProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onImageSelect(file);
  };

  return (
    <div className="space-y-6">
      <div className="clinical-card space-y-6">
        <div className="space-y-2">
          <span className="clinical-label">Upload Reference Image</span>
          <p className="text-sm text-muted leading-relaxed">
            Clear frontal photo in natural light. Used for context only — not analyzed by AI in Sprint 1.
          </p>
        </div>

        <div className="space-y-3">
          <input
            id="face-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <label htmlFor="face-upload" className="clinical-button inline-block cursor-pointer">
            Choose File
          </label>
          {preview && (
            <p className="text-xs text-muted">
              ✓ Image selected
            </p>
          )}
        </div>

        {preview && (
          <div className="pt-4 border-t border-border space-y-3">
            <p className="text-xs text-muted uppercase tracking-wider">Preview</p>
            <div className="relative w-full aspect-[3/4] max-w-xs">
              <Image
                src={preview}
                alt="Uploaded face preview"
                fill
                className="object-cover border border-border"
              />
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted/70 space-y-1">
        <p>• Image stored locally only</p>
        <p>• No server upload in Sprint 1</p>
        <p>• Used for future analysis enhancement</p>
      </div>
    </div>
  );
}
