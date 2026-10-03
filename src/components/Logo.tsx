import React from "react";
import Image from "next/image";

const Logo = ({ name = "披薩筆記" }: { name?: string }) => {
  return (
    <>
      <Image src="/logo.svg" alt={name} width={40} height={40} className="" />
      <span className="inline-block font-bold text-xl">{name}</span>
    </>
  );
};

export default Logo;
