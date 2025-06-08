export default () => ({
  kyberswap: {
    apiUrl: process.env.KYBER_API_URL || 'https://aggregator-api.kyberswap.com',
    apiKey: process.env.KYBER_AGGREGATOR_CLIENT_ID || 'xaiagent',
  },
  coinketgo: {
    apiUrl: process.env.COINKETGO_API_URL || 'https://api.coingecko.com/api/v3',
    apiKey: process.env.COINKETGO_API_KEY || 'CG-oeeDjCJ5J1GZdnjTc4XPS5q2',
  },
  openai: {
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    temperature: 0,
  },
  mongodb: {
    uri: process.env.MONGODB_URI || '',
  },
});
