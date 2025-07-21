import { Sparkles } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const EmptyFeed = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full py-12">
      <div className="relative mb-8">
        <span className="absolute -top-4 -left-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-blue-400/80" />
        </span>
        <div className="relative flex size-full max-w-lg flex-col gap-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-md bg-white/90 dark:bg-gray-900/90">
          <Image
            src="/images/community-empty.jpg"
            alt="No posts"
            width={200}
            height={200}
            className="rounded-2xl shadow-lg mx-auto"
            loading="eager"
          />
        </div>
        <span className="absolute -bottom-4 -right-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-purple-400/80" />
        </span>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          No Hot Tweets Yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md text-lg">
          Looks like there are no trending posts right now.
          <br />
          Be the first to share something awesome with the community!
        </p>
        
        <Link
          href="https://x.com/intent/tweet?text=Check%20out%20this%20community!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <BsTwitterX className="w-5 h-5 mr-2" />
          Share on Twitter
        </Link>
      </div>
    </div>
  );
};

export default EmptyFeed;
