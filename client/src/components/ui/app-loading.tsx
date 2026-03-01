import Image from "next/image";

interface AppLoadingProps {
  fullWidth?: boolean;
}

export default function AppLoading({ fullWidth = true }: AppLoadingProps) {
  return (
    <div
      className={
        fullWidth
          ? "h-screen w-screen flex items-center justify-center bg-background"
          : "h-screen w-full flex items-center justify-center bg-background"
      }
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Tasmil Finance logo"
            width={48}
            height={48}
            priority
          />
          <h1 className="text-2xl font-semibold text-gradient">Tasmil Finance</h1>
        </div>
      </div>
    </div>
  );
}
