"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import CardNewsFeed, { BentoItem } from "@/components/community/CardNewsFeed";
import { MessageCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Social media style fake data
const FAKE_SOCIAL_DATA = [
  {
    id: "1",
    username: "onigiri",
    handle: "@x_onigiri",
    time: "2h",
    content:
      "Vibe Codingまじしい、意味がないからついうぃうぃない機能を安易に追えようとしてコードのアーキテクチャを破綻する。そこの設計をりきしてる気がする😭😭😭",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar1.jpg",
    verified: true,
    likes: 12,
    retweets: 3,
    replies: 5,
  },
  {
    id: "2",
    username: "Silverhard.sui",
    handle: "@Silverhard_",
    time: "2h",
    content: "Them: There's no real life human cyborg\nMe: 👇 - @kostascrypto",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar2.jpg",
    verified: true,
    likes: 45,
    retweets: 12,
    replies: 8,
  },
  {
    id: "3",
    username: "Gidwell",
    handle: "@gidwell0x",
    time: "3h",
    content: "it's okay, tokenized stocks aren't crypto anyway!",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar3.jpg",
    verified: false,
    likes: 23,
    retweets: 7,
    replies: 15,
    hasImage: true,
    imageUrl: "https://example.com/trading-chart.jpg",
  },
  {
    id: "4",
    username: "onigiri",
    handle: "@x_onigiri",
    time: "3h",
    content:
      "開発コミュニティは目的とすることどんなに技術を見つかにょって、一人て立ち上げられるものもあるし、他価から接続人である程度戦略策にないと建教が美しいとものあるりようなせがする。加らんけど",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar1.jpg",
    verified: true,
    likes: 18,
    retweets: 4,
    replies: 2,
  },
  {
    id: "5",
    username: "Rter",
    handle: "@xyooter",
    time: "3h",
    content:
      "one valid criticism of sui is that there are so many copy pasta projects.\n\nwhat sui needs is more experimentation and fresh ideas.💙ATTItoken is launching a fresh experiment very soon. pay attention.",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar4.jpg",
    verified: true,
    likes: 67,
    retweets: 21,
    replies: 13,
  },
  {
    id: "6",
    username: "Gidwell",
    handle: "@gidwell0x",
    time: "3h",
    content: "imagine the smell",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar3.jpg",
    verified: false,
    likes: 156,
    retweets: 34,
    replies: 89,
  },
  {
    id: "7",
    username: "Matteo.sui",
    handle: "@matteodotsui",
    time: "4h",
    content: "Waiting for the first ever $SUI spot ETF approval be like:",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar5.jpg",
    verified: true,
    likes: 234,
    retweets: 56,
    replies: 43,
    hasImage: true,
    imageUrl: "https://example.com/sui-etf-chart.jpg",
  },
  {
    id: "8",
    username: "Joshua",
    handle: "@JoshuaOrhue",
    time: "4h",
    content: "Sui, the blockchain of infinite possibilities",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar6.jpg",
    verified: true,
    likes: 89,
    retweets: 23,
    replies: 12,
    hasImage: true,
    imageUrl: "https://example.com/sui-possibilities.jpg",
  },
  {
    id: "9",
    username: "Riddle",
    handle: "@Riidduu",
    time: "3h",
    content: "I'm loving this already..🔥",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar7.jpg",
    verified: true,
    likes: 45,
    retweets: 8,
    replies: 6,
    hasImage: true,
    imageUrl: "https://example.com/gaming-screenshot.jpg",
  },
];

const getSocialData = async (pageNum: number = 1): Promise<BentoItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return FAKE_SOCIAL_DATA.map((item) => ({
    id: `${item.id}-${pageNum}`,
    title: "", // Not used in social media layout
    description: item.content,
    author: item.username,
    handle: item.handle,
    time: item.time,
    avatar: item.avatar,
    verified: item.verified,
    likes: item.likes,
    retweets: item.retweets,
    replies: item.replies,
    hasImage: item.hasImage,
    imageUrl: item.imageUrl,
    icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
    hasPersistentHover: false,
  }));
};

const CommunityPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadMoreItems = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newItems = await getSocialData(pageNum + 1);

      // Only add items if we have new data
      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setPageNum((prev) => prev + 1);
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
        const initialItems = await getSocialData(1);
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
