import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import VerifyEmailContent from "./verify-email-content";

function VerifyEmailFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-linear-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Verify Your Email</h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Spinner className="w-4 h-4" />
              Loading...
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-linear-to-b from-background to-muted p-4">
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
