"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import CardNewsFeed, { BentoItem } from "@/components/community/CardNewsFeed";
import { useEffect, useState, useRef } from "react";

// Social media style fake data
const FAKE_SOCIAL_DATA = [
  {
    "id": 20,
    "batch_id": 4,
    "tweet_id": "1941798950832607612",
    "reason": "This tweet shares a personal experience from a hackathon focused on Aptos, showcasing community engagement and development activity.",
    "score": 85,
    "user_avatar_url": "https://pbs.twimg.com/profile_images/1935946775661076480/380TtOUS_normal.jpg",
    "user_name": "Sirisha",
    "user_href": "https://x.com/SiriSyncs",
    "is_verify": false,
    "tweet_text": "🚀 First time hacking on @Aptos!\nHad an unforgettable experience at the Build on Aptos Hackathon – Kolkata from July 5-6 💻🔥\n\nFrom check-ins to sleepless coding nights, here’s how it all went down 👇🧵 https://t.co/yRiFN745dg",
    "photo_url": "https://pbs.twimg.com/media/GvKn2nFXgAAW8_O.jpg",
    "video_url": "",
    "tweet_url": "https://x.com/SiriSyncs/status/1941798950832607612",
    "date": "2025-07-06T09:58:41+00:00",
    "x_handle": "SiriSyncs",
    "created_at": "2025-07-06T09:58:41+00:00"
  },
  {
    "id": 21,
    "batch_id": 4,
    "tweet_id": "1941798326690599014",
    "reason": "Provides insightful statistics about Aptos' transaction volume and user engagement, highlighting its growth and relevance in the crypto space.",
    "score": 82,
    "user_avatar_url": "https://pbs.twimg.com/profile_images/1921898584057712640/Ygk5PKNM_normal.jpg",
    "user_name": "Luken.apt🚀💯",
    "user_href": "https://x.com/Xx_Luken_xX",
    "is_verify": true,
    "tweet_text": "GM Aptos Fam!\n\nHere some interesting facts about @Aptos :\n\nAptos now records over $30 billion in native USDT transfer volume, ranking it 2nd in the USDT network, with around 1.1 million active user addresses.\n\nThese development show strong progress in on-chain adoption, global https://t.co/5dmt8x8l3i",
    "photo_url": "https://pbs.twimg.com/media/GvKnSVwWkAAQDBJ.jpg",
    "video_url": "",
    "tweet_url": "https://x.com/Xx_Luken_xX/status/1941798326690599014",
    "date": "2025-07-06T09:56:12+00:00",
    "x_handle": "Xx_Luken_xX",
    "created_at": "2025-07-06T09:56:12+00:00"
  },
]

const getSocialData = async (): Promise<BentoItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return FAKE_SOCIAL_DATA.map((item) => ({
    id: item.tweet_id,
    title: item.user_name,
    description: item.tweet_text,
    icon: null, // No icon needed for social media posts
    author: item.user_name,
    handle: item.x_handle,
    time: new Date(item.date).toLocaleDateString(),
    avatar: item.user_avatar_url,
    verified: item.is_verify,
    hasImage: !!item.photo_url,
    imageUrl: item.photo_url || undefined,
    tags: ["Aptos", "Crypto", "DeFi"],
    meta: `Score: ${item.score}`,
    cta: "View on X",
    colSpan: 1,
    hasPersistentHover: false,
    tweetUrl: item.tweet_url
  }));
};

const CommunityPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadMoreItems = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newItems = await getSocialData();

      // Only add items if we have new data
      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialItems = async () => {
      try {
        setLoading(true);
        const initialItems = await getSocialData();
        setItems(initialItems);
      } catch (error) {
        console.error("Error loading initial items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialItems();
  }, []);

  const handleScroll = () => {
    if (loading) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      loadMoreItems();
    }, 200); // 200ms debounce
  };

  return (
    <ContentLayout title="🔥 Hot tweets" className="overflow-hidden px-0">
      <div className="h-full w-full">
        <CardNewsFeed items={items} onScrollEnd={handleScroll} loading={loading} />
      </div>
    </ContentLayout>
  );
};

export default CommunityPage;
