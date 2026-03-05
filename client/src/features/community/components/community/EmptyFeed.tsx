import { Sparkles } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const EmptyFeed = () => {
  return (
    <div className="min-h-full overflow-y-auto scroll-container flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-2">
        <div className="flex min-h-[60vh] w-full items-center justify-center py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#00DEF2]/20 bg-card p-4 md:p-8 text-center shadow-[0_0_40px_-8px_rgba(0,222,242,0.12)] backdrop-blur-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            >
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-48 w-64 rounded-full bg-[#00DEF2]/[0.06] blur-3xl" />
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 h-36 w-48 rounded-full bg-[#F161C9]/[0.05] blur-3xl" />
            </div>

            <span className="absolute -left-3 -top-3 animate-pulse">
              <Sparkles className="h-6 w-6 text-[#00DEF2]/70 md:h-7 md:w-7" />
            </span>
            <span className="absolute -bottom-3 -right-3 animate-pulse">
              <Sparkles className="h-6 w-6 text-[#F161C9]/70 md:h-7 md:w-7" />
            </span>

            <div className="mx-auto mb-6 max-w-xs overflow-hidden rounded-2xl border border-[#00DEF2]/15">
              <Image
                src="/images/community-empty.jpg"
                alt="Community feed is empty"
                width={320}
                height={220}
                className="h-auto w-full object-cover"
                loading="eager"
              />
            </div>

            <h2 className="text-gradient mb-2 text-2xl font-bold md:text-3xl">
              No hot tweets yet
            </h2>

            <p className="mx-auto mb-6 max-w-lg text-sm text-foreground/50 md:text-base">
              The feed is quiet for now. New trending posts will appear here
              automatically. You can also start the momentum by sharing an
              update with the community.
            </p>

            <Link
              href="https://x.com/intent/tweet?text=Check%20out%20this%20community!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl bg-[#00DEF2] px-5 py-2.5 text-sm font-semibold text-[#000C18] shadow-[0_0_20px_-4px_rgba(0,222,242,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_-4px_rgba(0,222,242,0.55)] md:px-6 md:py-3 md:text-base"
            >
              <BsTwitterX className="mr-2 h-5 w-5" />
              Share on X
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyFeed;
