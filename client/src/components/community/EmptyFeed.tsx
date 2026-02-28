import { Sparkles } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const EmptyFeed = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/90 p-6 text-center shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-8">
        <span className="absolute -left-3 -top-3 animate-pulse">
          <Sparkles className="h-6 w-6 text-blue-400/80 sm:h-7 sm:w-7" />
        </span>
        <span className="absolute -bottom-3 -right-3 animate-pulse">
          <Sparkles className="h-6 w-6 text-purple-400/80 sm:h-7 sm:w-7" />
        </span>

        <div className="mx-auto mb-6 max-w-xs overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-700/70">
          <Image
            src="/images/community-empty.jpg"
            alt="Community feed is empty"
            width={320}
            height={220}
            className="h-auto w-full object-cover"
            loading="eager"
          />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          No hot tweets yet
        </h2>

        <p className="mx-auto mb-6 max-w-lg text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          The feed is quiet for now. New trending posts will appear here automatically.
          You can also start the momentum by sharing an update with the community.
        </p>

        <Link
          href="https://x.com/intent/tweet?text=Check%20out%20this%20community!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 hover:shadow-xl sm:px-6 sm:py-3 sm:text-base"
        >
          <BsTwitterX className="mr-2 h-5 w-5" />
          Share on X
        </Link>
      </div>
    </div>
  );
};

export default EmptyFeed;
