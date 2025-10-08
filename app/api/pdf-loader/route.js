import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const pdfUrl="https://diligent-lapwing-885.convex.cloud/api/storage/a5f0526b-204a-451d-94d7-65f2544d81a6"


export async function GET(req){
   const reqUrl=req.url;
   const {searchParams}=new URL(reqUrl);
   const pdfUrl=searchParams.get('pdfUrl');
   console.log("pdfUrl",pdfUrl);
   // load the pdf file
  const res=await fetch(pdfUrl);
  const data=await res.blob();
  const loader=new WebPDFLoader(data);
  const docs=await loader.load();
  let pdfTextContent='';
  docs.forEach(doc =>{
    pdfTextContent+=doc.pageContent;
  })
  // split the text into smaller chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 50,
  });
 const output=await textSplitter.createDocuments([pdfTextContent])
    let splitterList=[]
    output.forEach(doc =>{
      splitterList.push(doc.pageContent)
    })

  
  return NextResponse.json({result:splitterList})
}