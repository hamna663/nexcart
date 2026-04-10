import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-primary-foreground px-4 py-4">
      <Card className="text-center w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2 justify-center">
            <Image src="/logo.png" alt="NexCart" width={40} height={40} />
            NexCart
          </CardTitle>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};

export default Layout;
