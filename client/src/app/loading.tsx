import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Tasmil Finance logo"
            width={48}
            height={48}
            priority
          />
          <h1 className="text-2xl font-semibold text-gradient">
            Tasmil Finance
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
