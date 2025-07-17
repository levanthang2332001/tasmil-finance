import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EmptyFeed = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full py-12">
      <div className="relative mb-6">
        <span className="absolute -top-4 -left-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-blue-400/80" />
        </span>
        <Image
          src="/images/community-empty.jpg"
          alt="No posts"
          width={180}
          height={180}
          className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
          loading="eager"
        />
        <span className="absolute -bottom-4 -right-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-purple-400/80" />
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No Hot Tweets Yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
        Looks like there are no trending posts right now.
        <br />
        Be the first to share something awesome with the community!
      </p>
      <Link
        href="https://x.com/intent/tweet?text=Check%20out%20this%20community!"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-lg background-gradient2 text-white font-semibold shadow hover:background-gradient3 transition"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Share on Twitter
      </Link>
    </div>
  );
};

export default EmptyFeed;
