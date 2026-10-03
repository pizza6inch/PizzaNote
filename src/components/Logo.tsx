import React from "react";
import PizzaMark from "./PizzaMark";

const Logo = ({ name = "披薩筆記", size = 40 }: { name?: string; size?: number }) => {
  return (
    <>
      <PizzaMark size={size} />
      <span className="font-display text-2xl leading-none">{name}</span>
    </>
  );
};

export default Logo;
