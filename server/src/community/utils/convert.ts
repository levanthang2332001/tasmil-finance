type SimpleTweet = {
  id: string;
  user_avatar_url: string;
  user_name: string;
  user_href: string;
  is_verify: boolean;
  tweet_text: string;
  photo_url: string;
  video_url: string;
  tweet_url: string;
  date: string;
  x_handle: string;
  created_at: string;
};

type User = {
  id: string;
  username: string;
  name: string;
  verified: boolean;
  profile_image_url: string;
};

type Tweet = {
  id: string;
  author_id: string;
  text: string;
  created_at: string;
};

type Media = {
  tweet_id: string;
  type: string;
  url?: string;
};

export function convertTweet(
  tweet: Tweet,
  users: User[],
  media: Media[],
): SimpleTweet {
  const user = users.find((u) => u.id === tweet.author_id);
  const tweetMedia = media.filter((m) => m.tweet_id === tweet.id);

  const photo = tweetMedia.find((m) => m.type === 'photo');
  const video = tweetMedia.find(
    (m) => m.type === 'video' || m.type === 'animated_gif',
  );

  const x_handle = user?.username ?? '';
  const user_href = x_handle ? `https://x.com/${x_handle}` : '';
  const tweet_url = x_handle
    ? `https://x.com/${x_handle}/status/${tweet.id}`
    : '';

  return {
    id: tweet.id,
    user_avatar_url: user?.profile_image_url ?? '',
    user_name: user?.name ?? '',
    user_href,
    is_verify: user?.verified ?? false,
    tweet_text: tweet.text,
    photo_url: photo?.url ?? '',
    video_url: video?.url ?? '',
    tweet_url,
    date: tweet.created_at,
    x_handle,
    created_at: tweet.created_at,
  };
}
