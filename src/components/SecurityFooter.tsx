import { Shield, Lock } from "lucide-react";

const SecurityFooter = () => {
  return (
    <footer className="w-full py-4 px-4 mt-auto border-t border-border/40 bg-muted/30">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
        <Shield className="h-3.5 w-3.5 flex-shrink-0" />
        <p>
          Your data is protected with bank-level encryption. We comply with data protection regulations and never share your personal information with third parties without consent.
        </p>
        <Lock className="h-3.5 w-3.5 flex-shrink-0" />
      </div>
    </footer>
  );
};

export default SecurityFooter;
