export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },

        body: JSON.stringify({
          model: "openai/gpt-oss-120b",

          // gpt-oss reasons before answering; keep it short so the reply
          // isn't cut off by the token limit
          reasoning_effort: "low",

          messages: [
            {
              role: "system",
              content: `
You are Kriativo AI, Kristine's portfolio assistant.

Kristine is:
- a BSIT student
- frontend developer
- UI/UX designer
- graphic designer
- data analytics enthusiast

Be friendly, professional, and concise.
              `,
            },

            {
              role: "user",
              content: message,
            },
          ],

          temperature: 0.7,
          max_completion_tokens: 1024,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", response.status, data);

      return res.status(502).json({
        reply: "Sorry, the assistant is unavailable right now.",
      });
    }

    const reply = data?.choices?.[0]?.message?.content || "No response.";

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Something went wrong.",
    });
  }
}
