import "dotenv/config";
import dotenv from "dotenv";

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

// Also load the shared .env in the parent GenAI directory
dotenv.config({ path: new URL("../.env", import.meta.url) });

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function query(userQuery) {
  // Process documents to generate vector embeddings
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      collectionName: "my_collection",
      url: "http://localhost:6333",
    },
  );

  const vectorRetriever = vectorStore.asRetriever({ k: 5 });
  const results = await vectorRetriever.invoke(userQuery);

  const SYSTEM_PROMPT = `
    You are a helpful assistant that answers the user's question using ONLY the context provided below.

    Rules:
    - Base your answer strictly on the context. If the answer is not found in the context, reply exactly: "I don't know."
    - Do not make up any information that is not in the context.
    - Keep your answer short and to the point.
    - Always cite the page number(s) from the context where the information was found.

    Context:
    ${results
      .map((e) =>
        JSON.stringify({
          pageContent: e.pageContent,
          metadata: e.metadata,
          pageNumber: e.metadata.loc.pageNumber,
        }),
      )
      .join("\n\n")}
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
  });

  console.log("Response from OpenAI:", response.choices[0].message.content);

  return response;
}

// Take the question from the command line, e.g.
//   node query.js "How does asynchronous Node.js work?"
// Falls back to a default question that the ingested PDF actually covers.
const userQuery =
  process.argv.slice(2).join(" ").trim() ||
  "What is the Node.js module system?";

query(userQuery);
