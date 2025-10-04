"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutListIcon, ShieldIcon } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaFilePdf } from "react-icons/fa6";


function Sidebar() {
  const {user}=useUser();
  const path=usePathname();
  const GetUserInfo=useQuery(api.user.GetUserInfo,{
    userEmail:user?.primaryEmailAddress.emailAddress

  })
  console.log(GetUserInfo)
  // const userEmail='diptanshumaurya2005@gmail.com'
   const fileList=useQuery(api.fileStorage.GetUserFiles,{
     userEmail:user?.primaryEmailAddress?.emailAddress
   })
  return (
    <div className='shadow-md h-screen p-4'>
      <div className='flex items-center justify-center'> 
        <span className='text-3xl '><FaFilePdf ></FaFilePdf></span>

      </div>
      

      {/* <Image className='ml-16' src={'/logo.svg'} alt='logo' width={70} height={120}></Image> */}
      <div className='mt-6'>
        
        <UploadPdfDialog isMaxFile={(fileList?.length>=5&&!GetUserInfo.upgrade)?true:false}>
        <Button className='w-full'>Upload PDF</Button>
        </UploadPdfDialog>
      </div>
      <Link href={'/dashboard'}>
      <div className={`flex items-center gap-2 justify-center mt-2 p-2 hover:bg-slate-200 rounded-lg cursor-pointer ${path=='/dashboard'&&'bg-slate-200'}`} >
        <LayoutListIcon></LayoutListIcon>
        <h2 className=''>Workspace</h2>
      </div>
      </Link>
      {!GetUserInfo?.upgrade &&
      <Link href={'/dashboard/Upgrade'}>
      <div className={`flex items-center gap-2 justify-center mt-2 p-2 hover:bg-slate-200 rounded-lg cursor-pointer ${path=='/dashboard/Upgrade'&&'bg-slate-200'}`}>
        <ShieldIcon></ShieldIcon>
        <h2 className=''>Upgrade</h2>
      </div>
      </Link>}
      
      {!GetUserInfo?.upgrade&&
      <div className='  absolute bottom-20 w-[80%]'>
      <Progress value={(fileList?.length/5)*100} />
      <p className='text-sm mt-2 font-semibold'>{fileList?.length} pdf out of 5</p>
      <p className='text-sm mt-2  text-gray-400'>Upgrade to upload more pdf </p>
      </div>}
      

      
    </div>
  )
}

export default Sidebar
