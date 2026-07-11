import "dotenv/config";
import dotenv from "dotenv";

// Also load the shared .env in the parent GenAI directory
dotenv.config({ path: new URL("../.env", import.meta.url) });

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

async function generateVectorEmbeddingsForFile(filePath) {
  const loader = new PDFLoader(filePath);
  const documents = await loader.load();

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

  vectorStore.addDocuments(documents);
}

generateVectorEmbeddingsForFile("nodejs.pdf");
