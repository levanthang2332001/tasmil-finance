import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, QrCode } from "lucide-react";

interface ReceiveProps {
  className?: string;
  onClose?: () => void;
}

const Receive = ({ className, onClose }: ReceiveProps) => {
  return (
    <div className={cn("p-4 space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
          <ArrowLeft className="size-4" />
        </Button>
        <h2 className="text-lg font-semibold">Receive</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
          <QrCode className="size-32 mb-4" />
          <p className="text-sm text-muted-foreground">Scan QR code to receive</p>
        </div>

        <div className="text-sm text-muted-foreground">
          Share this address to receive funds. Make sure you&apos;re receiving the correct asset.
        </div>
      </div>
    </div>
  );
};

export default Receive;
