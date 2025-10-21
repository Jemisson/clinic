"use client";

import * as React from "react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  zoom?: number;
  lensSize?: number;
  imgClassName?: string;
  className?: string;
};

export default function MagnifyImage({
  src,
  alt = "",
  zoom = 2,
  lensSize = 160,
  imgClassName,
  className,
}: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgSize, setBgSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const updateBgSize = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    setBgSize({ w: rect.width * zoom, h: rect.height * zoom });
  }, [zoom]);

  useEffect(() => {
    updateBgSize();
    window.addEventListener("resize", updateBgSize);
    return () => window.removeEventListener("resize", updateBgSize);
  }, [updateBgSize]);

  function onMove(e: React.MouseEvent) {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap) return;

    const rect = img.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const half = lensSize / 2;
    const x = Math.max(half, Math.min(rect.width - half, cursorX));
    const y = Math.max(half, Math.min(rect.height - half, cursorY));

    setLensPos({ x, y });
  }

  const bgPosX = -(lensPos.x * (zoom) - lensSize / 2);
  const bgPosY = -(lensPos.y * (zoom) - lensSize / 2);

  return (
    <div
      ref={wrapRef}
      className={clsx("relative select-none", className)}
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      onMouseMove={onMove}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={800}
        height={600}
        draggable={false}
        className={clsx("block w-full", imgClassName)}
      />

      {showLens && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-lg border border-white/70 shadow-lg ring-1 ring-black/10"
          style={{
            width: lensSize,
            height: lensSize,
            left: lensPos.x - lensSize / 2,
            top: lensPos.y - lensSize / 2,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${bgSize.w}px ${bgSize.h}px`,
            backgroundPosition: `${bgPosX}px ${bgPosY}px`,
          }}
        />
      )}
    </div>
  );
}
