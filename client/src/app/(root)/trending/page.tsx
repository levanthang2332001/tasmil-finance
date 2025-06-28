"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import CardNewsFeed, { BentoItem } from "@/components/trending/CardNewsFeed";
import { Newspaper } from "lucide-react";
import { useEffect, useState } from "react";

// Fake data constant
const FAKE_NEWS_DATA = [
  {
    id: "1",
    title: "Bitcoin Surges Past $50,000 as Institutional Adoption Grows",
    description: "Bitcoin has reached a new milestone as major financial institutions continue to show interest in cryptocurrency investments.",
    author: "Crypto Analyst",
    tags: ["Bitcoin", "Cryptocurrency", "Institutional"],
    sourceLink: "https://example.com/bitcoin-surge",
  },
  {
    id: "2", 
    title: "DeFi Protocol Launches Revolutionary Yield Farming Strategy",
    description: "A new decentralized finance protocol introduces innovative yield farming mechanisms that could reshape the DeFi landscape.",
    author: "DeFi Expert",
    tags: ["DeFi", "Yield Farming", "Innovation"],
    sourceLink: "https://example.com/defi-protocol",
  },
  {
    id: "3",
    title: "Ethereum Layer 2 Solutions Show Promising Results",
    description: "Layer 2 scaling solutions on Ethereum are demonstrating significant improvements in transaction speed and cost reduction.",
    author: "Blockchain Developer",
    tags: ["Ethereum", "Layer 2", "Scaling"],
    sourceLink: "https://example.com/ethereum-layer2",
  },
  {
    id: "4",
    title: "NFT Market Sees Record-Breaking Sales Volume",
    description: "The non-fungible token market experiences unprecedented growth with new artists and collectors entering the space.",
    author: "NFT Specialist",
    tags: ["NFT", "Digital Art", "Market"],
    sourceLink: "https://example.com/nft-market",
  },
  {
    id: "5",
    title: "Central Bank Digital Currencies Gain Global Momentum",
    description: "Countries worldwide are accelerating their CBDC development programs as digital currency adoption increases.",
    author: "Financial Analyst",
    tags: ["CBDC", "Digital Currency", "Global"],
    sourceLink: "https://example.com/cbdc-momentum",
  },
  {
    id: "6",
    title: "Web3 Gaming Platform Raises $100M in Funding",
    description: "A blockchain-based gaming platform secures major funding to expand its metaverse gaming ecosystem.",
    author: "Gaming Reporter",
    tags: ["Web3", "Gaming", "Metaverse"],
    sourceLink: "https://example.com/web3-gaming",
  },
];

const getNewsData = async (pageNum: number = 1): Promise<BentoItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate pagination - return different data for each page
  const startIndex = (pageNum - 1) * 3;
  const endIndex = startIndex + 3;
  const pageData = FAKE_NEWS_DATA.slice(startIndex, endIndex);
  
  // If no more data, return empty array
  if (pageData.length === 0) {
    return [];
  }

  return pageData.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    author: item.author,
    tags: item.tags,
    cta: item.sourceLink,
    colSpan: 1,
    icon: <Newspaper className="w-4 h-4 text-blue-500" />,
    hasPersistentHover: false,
  }));
};

const TrendingPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreItems = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newItems = await getNewsData(pageNum + 1);
      
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
        const initialItems = await getNewsData(1);
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
    loadMoreItems();
  };

  return (
    <ContentLayout title="Trending">
      <div className="h-full w-full p-6 flex items-center justify-center">
        <CardNewsFeed items={items} onScrollEnd={handleScroll} loading={loading} />
      </div>
    </ContentLayout>
  );
};

export default TrendingPage;
