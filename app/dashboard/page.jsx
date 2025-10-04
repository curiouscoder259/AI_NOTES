"use client"
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

function Dashboard() {
  const {user}=useUser();
 // const userEmail='diptanshumaurya2005@gmail.com'
  const fileList=useQuery(api.fileStorage.GetUserFiles,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  })
 // console.log(typeof fileList);
  return (
    <div>

      <div > {fileList?.length==0 && <div className='mt-4 ml-4 font-semibold text-2xl'> NO PDF AVAILABLE ....   </div>} </div>
      
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-6 ml-5'>
        
        {fileList?.length>0?fileList.map((file,i)=>(
          <Link href={'/workspace/'+file.fileId} key={i}>
        
          <div  className='flex p-5  shadow-md rounded-sm  flex-col items-center justify-center border hover:scale-105 transition-all'>
            <Image src={'/pdf.png'} alt='file' width={50} height={60} />
            <h2>{file?.fileName}</h2>
          </div>
          </Link>
        )): <div> </div>}
      </div>
    </div>
  )
}

export default Dashboard;
