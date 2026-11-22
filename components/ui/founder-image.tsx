"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DEFAULT_FOUNDER_IMAGE,
  fetchTeamMembers,
  resolveFounderImageFromMembers,
} from "@/lib/api/teams";

interface FounderImageProps {
  initialSrc?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fallbackSrc?: string;
}

export function FounderImage({
  initialSrc,
  alt,
  priority = false,
  className = "object-contain p-2",
  sizes = "(max-width: 768px) 100vw, 40vw",
  fallbackSrc = DEFAULT_FOUNDER_IMAGE,
}: FounderImageProps) {
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchTeamMembers({ limit: 100 })
      .then((res) => {
        if (isMounted && Array.isArray(res?.data) && res.data.length > 0) {
          const resolved = resolveFounderImageFromMembers(res.data);
          if (resolved) {
            setOverrideSrc(resolved);
            setHasError(false);
          }
        }
      })
      .catch(() => {
        // Keep current source if fetch fails
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rawSrc = overrideSrc || initialSrc || fallbackSrc;
  const imageSrc = hasError ? fallbackSrc : rawSrc;
  const isRemote = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isRemote}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
