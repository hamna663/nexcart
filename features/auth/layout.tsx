import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-lvh bg-muted justify-center items-center ">
      <Link href="/" className="text-lg font-bold my-2 flex gap-x-3">
        <Image
          src="/logo/logo.png"
          alt="Ecommerce App"
          width="30"
          height="30"
          className="in-dark:invert"
        />
        Ecommerce App
      </Link>
      {children}
    </div>
  );
};

export default AuthLayout;
