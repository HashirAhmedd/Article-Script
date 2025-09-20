const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function optimizeContent(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(`Respond only with the revised content, without extra headings or filler. Use the article provided to create a professional, SEO-friendly news summary with clear source attribution.

 

Follow this exact output template:

 

Title: <SEO-friendly, 60–70 characters, include primary keyword>

Meta Description: <150–160 characters, compelling and keyword-rich>

 

Key Takeaways:

- <Bullet 1 with a primary keyword, ~12–18 words>

- <Bullet 2 with a secondary keyword, ~12–18 words>

- <Optional Bullet 3, if materially additive>

 

Summary (250–350 words):

<1-sentence hook. Then 2–4 short paragraphs that: explain key facts in plain language; highlight what matters most for businesses or consumers; incorporate concrete data points, dates, metrics, or brief expert quotes if present. Briefly explain technical terms inline. Keep a neutral, journalistic tone.>

 

Key Terms (max 3):

- <Term>: <1-line plain-English explanation>

- <Term>: <1-line plain-English explanation>

- <Term>: <1-line plain-English explanation>

 

FAQ (2–3 Q&As for rich results):

Q: <Likely reader question derived from the article>

A: <Concise, factual answer that reflects the article’s content>

Q: <Second question>

A: <Answer>

<Q/A optional third>

 

Sources (1–3 authoritative originals):

- <Publication/Author — Article Title> — <URL> (Published: <Mon DD, YYYY>)

- <Additional source if needed> — <URL> (Published: <Mon DD, YYYY>)

 

Related Tags (3–6): <comma-separated topical tags for internal linking>

Target Keywords (3–6): <comma-separated SEO keywords naturally reflected in the piece>

Internal Link Suggestions (2–3): <short topics or slugs on your site this piece should link to>

 

Rules:

- Paraphrase; do not copy sentences. If quoting, keep quotes ≤75 characters, in quotes, with attribution.

- Use descriptive anchor text for any in-body mention of a source; avoid raw URLs in the body. List full URLs only in the “Sources” section.

- Prefer the original reporting/research (e.g., company blog posts, academic or primary news reports) over re-blogs. Avoid paywalled sources unless essential.

- Maintain neutrality; avoid hype. Include dates, figures, and context where available.

- Use concise sentences and short paragraphs for readability. Default to US English and “Mon DD, YYYY” dates unless the article specifies otherwise.

 

Here is the article content:
${content}`);
  const response = await result.response;
  return response.text().replace(/^(Here is your response:|Sure!|.*?\n\n)/i, "").trim();
}

module.exports = optimizeContent;
