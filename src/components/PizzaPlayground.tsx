"use client";
import React, { useState, useEffect, useRef } from "react";
import { animate, createScope, createSpring, createDraggable, utils } from "animejs";
import Image from "next/image";

const PizzaPlayground = () => {
  const root = useRef<any>(null);
  const scope = useRef<any>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((scope) => {
      // Every anime.js instances declared here are now scopped to <div ref={root}>

      // Created a bounce animation loop
      animate(".logoB", {
        scale: [
          { to: 1.25, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],
        loop: true,
        loopDelay: 250,
      });

      createDraggable(".logoB", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });

      // Make the logo draggable around its center
      // createDraggable(".logoA", {
      //   x: { mapTo: "rotateY" },
      //   y: { mapTo: "rotateX" },
      // });
    });

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current.revert();
  }, []);

  return (
    <div ref={root}>
      <div className="flex gap-4 justify-center">
        <Image src={"/logo.svg"} width={80} height={80} className="logoB " alt="React logo" />
      </div>
    </div>
  );
};

export default PizzaPlayground;
