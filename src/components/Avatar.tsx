"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { animate, createScope, createSpring, createDraggable, utils } from "animejs";

const Avatar = () => {
  const root = useRef<any>(null);
  const scope = useRef<any>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  useEffect(() => {
    scope.current = createScope({ root }).add((scope) => {
      utils.set(".avatar", { z: 100 });

      // Make the logo draggable around its center
      createDraggable(".avatar", {
        x: { mapTo: "rotateY" },
        y: { mapTo: "rotateX" },
        trigger: ".dragArea",
        releaseMass: 0.1,
        onDrag: () => {
          setIsAutoRotate(false);
        },
        onRelease: () => {
          setIsAutoRotate(true);
        },
      });

      animate(".autoRotate", {
        rotateY: 360,
        duration: 2000,
        easing: "ease-in-out",
        loop: true,
        autoplay: true,
      });
    });

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current.revert();
  }, []);

  return (
    <div ref={root}>
      <div className="flex gap-4 justify-center dragArea">
        <Image
          src={"/avatar.png"}
          width={150}
          height={150}
          alt="avatar"
          className={`mx-auto my-4 rounded-full avatar autoRotate ${isAutoRotate ? "autoRotate" : ""}`}
        />
      </div>
    </div>
  );
};

export default Avatar;
