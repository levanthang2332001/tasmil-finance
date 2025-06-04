'use client';
import CardNewsFeed, { BentoItem } from "@/components/trending/CardNewsFeed";
import { NewsItem } from "@/lib/apiNewsFeed";
import { Newspaper } from "lucide-react";
import { useEffect, useState } from "react";

const getNewsData = async (pageNum: number = 1): Promise<BentoItem[]> => {
  const res = await fetch(`/api/news?page=${pageNum}`);
  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }
  const data = await res.json();

  return data.list.map((item: NewsItem) => {
    const description = item.multilanguageContent.find((language: any) => language.language === 'en')?.content || 'No description available';
    return {
      id: item.id,
      title: item.multilanguageContent.find((language: any) => language.language === 'en')?.title || 'Untitled',
      description,
      author: item.author,
      tags: item.tags,
      cta: item.sourceLink,
      colSpan: 1,
      icon: <Newspaper className="w-4 h-4 text-blue-500" />,
      hasPersistentHover: false,
    };
  });
}

const TrendingPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreItems = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newItems = await getNewsData(pageNum + 1);
      setItems(prev => [...prev, ...newItems]);
      setPageNum(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
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
        console.error('Error loading initial items:', error);
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
    <div className="h-full w-full p-6 flex items-center justify-center">
      <CardNewsFeed
        items={items}
        onScrollEnd={handleScroll}
        loading={loading}
      />
    </div>
  );
};

export default TrendingPage;
