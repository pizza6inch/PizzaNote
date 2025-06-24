import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image src="/logo.svg" alt="披薩筆記" width={40} height={40} className="" />
      <span className="inline-block font-bold text-xl">披薩筆記</span>
    </>
  );
};

export default Logo;
