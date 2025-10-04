"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import WorkSpaceHeader from '../_components/WorkSpaceHeader';
import PdfViewer from '../_components/PdfViewer';
import { useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Texteditor from '../_components/Texteditor';



function workspace() {
  const {fileId}=useParams();
  const fileInfo=useQuery(api.fileStorage.GetFileRecord,{fileId:fileId})
  // const GetFileInfo= async()=>{
  //    const result=await GetFileRecord({fileId:fileId})
  // }
  useEffect(()=>{
     console.log(fileInfo)

  },[fileInfo])
  return (
    <div>
      
      <WorkSpaceHeader fileName={fileInfo?.fileName} fileId={fileId}></WorkSpaceHeader>
      <div className='grid grid-cols-2 gap-5 p-4'>
        <div>
                <Texteditor fileId={fileId}></Texteditor>
        </div>
        <div>
   
      <PdfViewer fileUrl={fileInfo?.fileUrl}></PdfViewer>
        </div>
      </div>
    </div>
  )
}

export default workspace
