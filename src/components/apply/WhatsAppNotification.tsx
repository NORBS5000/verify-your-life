import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

interface WhatsAppNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const WhatsAppNotification = ({ show, message, onClose }: WhatsAppNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Play notification sound effect (simulated with a small delay)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-4 z-50 animate-notification">
      <div className="flex max-w-sm items-start gap-3 rounded-xl bg-white p-4 shadow-elegant-lg">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-secondary">CheckUps COVA</p>
            <button
              onClick={onClose}
              className="ml-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <p className="mt-2 text-xs text-muted-foreground">now</p>
        </div>
      </div>
    </div>
  );
};