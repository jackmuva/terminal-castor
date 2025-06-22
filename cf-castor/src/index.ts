import { Hono } from 'hono'

type Bindings = {
  GEMINI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('Hello Castor!')
});

app.post('/api/chat', async (c) => {
  const body = await c.req.json();
  const GEMINI_API_KEY = c.env.GEMINI_API_KEY;
  const request = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const response = await request.json();
  return c.json(response);
})

export default app
