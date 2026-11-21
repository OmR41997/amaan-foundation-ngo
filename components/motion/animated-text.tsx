"use client";

import React from "react";

type AnimatedTextProps = {
  text: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  id?: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
};

export function AnimatedText({
  text,
  as: Component = "p",
  id,
  className = "",
}: AnimatedTextProps) {
  return (
    <Component id={id} className={className}>
      {text}
    </Component>
  );
}

export default AnimatedText;