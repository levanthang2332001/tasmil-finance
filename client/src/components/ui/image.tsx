import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import NextImage from "next/image";
import { Typography } from "@/components/ui/typography";

interface ImageProps {
  fallbackSrc?: string;
  fallbackName?: string;
  className?: string;
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  sphereEffect?: boolean;
}

const COLORS = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-red-100", text: "text-red-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-yellow-100", text: "text-yellow-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
];

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      fallbackSrc = "",
      fallbackName = "",
      alt = "image",
      src,
      width,
      height,
      sphereEffect = false,
      ...props
    },
  ) => {
    const [imgSrc, setImgSrc] = React.useState<string | null>(() => src);
    const [isLoading, setIsLoading] = React.useState(() => !!src);
    const [showFallbackLetter, setShowFallbackLetter] = React.useState(() => !src);

    const colorIndex = React.useMemo(() => {
      let hash = 0;
      for (let i = 0; i < fallbackName.length; i++) {
        hash = fallbackName.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash % COLORS.length);
    }, [fallbackName]);

    React.useEffect(() => {
      if (src && src !== imgSrc) {
        setImgSrc(src);
        setIsLoading(true);
        setShowFallbackLetter(false);
      }
    }, [src, imgSrc]);

    const handleError = () => {
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc(null);
        setShowFallbackLetter(true);
      }
      setIsLoading(false);
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    const fallbackElement = React.useMemo(
      () => (
        <div
          className={cn(
            "flex items-center justify-center text-2xl font-medium",
            COLORS[colorIndex].bg,
            sphereEffect && "relative overflow-hidden rounded-full shadow-lg",
            className
          )}
          style={{
            width,
            height,
            ...(sphereEffect && {
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255,255,255,1) 0%, 
                ${COLORS[colorIndex].bg.replace("bg-", "")} 40%, 
                rgba(0,0,0,0.5) 100%)`,
              boxShadow: "inset 0 0 15px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.45)",
            }),
          }}
        >
          <Typography className={cn(COLORS[colorIndex].text, "text-2xl font-medium")}>
            {fallbackName.charAt(0).toUpperCase()}
          </Typography>
          {sphereEffect && (
            <div
              className="absolute left-0 top-0 h-1/3 w-1/3 rounded-full opacity-70"
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 80%)",
                transform: "translate(40%, 40%)",
              }}
            />
          )}
        </div>
      ),
      [fallbackName, width, height, className, colorIndex, sphereEffect]
    );

    return (
      <div className={cn("relative", sphereEffect && "overflow-hidden rounded-full")}>
        {isLoading && (
          <Skeleton className={cn("absolute inset-0 bg-third", sphereEffect && "rounded-full", className)} />
        )}
        {showFallbackLetter ? (
          fallbackElement
        ) : (
          <div className={cn(sphereEffect && "sphere-container overflow-hidden rounded-full", "relative")}>
            <NextImage
              className={cn(
                "transition-all",
                isLoading && "invisible",
                sphereEffect && "rounded-full object-cover",
                className
              )}
              src={imgSrc || ""}
              alt={alt}
              width={width}
              height={height}
              onError={handleError}
              onLoad={handleLoad}
              {...props}
            />
            {sphereEffect && !isLoading && !showFallbackLetter && (
              <div
                className="pointer-events-none absolute left-0 top-0 h-full w-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, 
                    rgba(255,255,255,0.3) 0%, 
                    rgba(255,255,255,0.05) 50%, 
                    rgba(0,0,0,0.2) 100%)`,
                  boxShadow: "inset 0 0 15px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  className="absolute left-0 top-0 h-1/3 w-1/3 rounded-full opacity-70"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 80%)",
                    transform: "translate(40%, 40%)",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Image.displayName = "Image";

export { Image };
