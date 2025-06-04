export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });

  return response;
}
