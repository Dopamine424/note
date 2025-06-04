"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1.5,
  ease = "power4.out",
  scrollStart = "top bottom",
  scrollEnd = "center bottom",
  stagger = 0.02,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitWords = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(" ").map((word, index) => (
      <span className="inline-block whitespace-nowrap" key={index}>
        {word}
        {index < text.split(" ").length - 1 && "\u00A0"}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const wordElements = el.querySelectorAll(".inline-block");

    gsap.fromTo(
      wordElements,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: animationDuration,
        ease: ease,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      }
    );
  }, [
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
  ]);

  return (
    <h2
      ref={containerRef}
      className={`my-5 overflow-hidden ${containerClassName}`}
    >
      <span
        className={`inline-block text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`}
      >
        {splitWords}
      </span>
    </h2>
  );
};

export default ScrollReveal;