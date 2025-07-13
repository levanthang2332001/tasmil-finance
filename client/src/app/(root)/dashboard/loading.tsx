import { RefreshCw } from "lucide-react";

function Loading() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
export default Loading;
