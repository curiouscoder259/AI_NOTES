import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { action } from "./_generated/server.js";
import { v } from "convex/values";


// export const ingest = action({
//   args: {
//     splitText: v.array(v.string()),
//     fileId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     await ConvexVectorStore.fromTexts(
//       args.splitText, 
//       // must be an array of metadata, one per split
//       args.splitText.map(() => ({ fileId: args.fileId })),  
//       new GoogleGenerativeAIEmbeddings({
//         apiKey: 'AIzaSyC_Xr61bxpUj......................',
//         model: "text-embedding-004",
//         taskType: TaskType.RETRIEVAL_DOCUMENT,
//         title: "Document title",
//       }),
//       { ctx, table: "documents" }  // 👈 target your table
//     );
//     return "completed";
//   },
// });





export const ingest = action({
  args: {
    splitText: v.array(v.string()),
    fileId:v.string()
  },

  handler: async (ctx,args) => {
    // console.log("Ingesting data:", { 
    //   textCount: args.splitText.length, 
    //   fileId: args.fileId 
    // });
     console.log("chal ja bhai")
    await ConvexVectorStore.fromTexts(
      args.splitText,
      
      args.splitText.map(() => ({ fileId: args.fileId })),
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyA-AlUpmVPii_e6iy1SNgCnzAibjRcKOns',
       
        
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx,table: "documents"}
    
    );
    return "completed"
  },
});

// export const ingest = action({
//   args: {
    
//   },
//   handler: async (ctx,args) => {
//     await ConvexVectorStore.fromTexts(
//       ["Hello world", "bye bye", " tata"], //array
//       [{ fileId: "abc" }, { fileId: "def" }], //string
//       new GoogleGenerativeAIEmbeddings({
//         apiKey: 'AIzaSyC_Xr61bxpUjJUAPz.................',
//         model: "text-embedding-004", // 768 dimensions
//         taskType: TaskType.RETRIEVAL_DOCUMENT,
//         title: "Document title",
//       }),
//       { ctx, table: "documents" }
    
//     );
//     return "completed"
//   },
// });

export const search = action({
  args: {
    query: v.string(),
    fileId:v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyA-AlUpmVPii_e6iy1SNgCnzAibjRcKOns',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
       { ctx });

    const resultOne = (await vectorStore.similaritySearch(args.query, 1)).filter(q=>q.metadata.fileId==args.fileId);
    console.log(resultOne);
    return JSON.stringify(resultOne);
  },
});
