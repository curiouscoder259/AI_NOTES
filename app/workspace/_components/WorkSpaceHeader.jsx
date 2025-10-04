
import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FaDownload } from "react-icons/fa6";
import html2pdf from "html2pdf.js";
import { FaFilePdf } from "react-icons/fa6";

function WorkSpaceHeader({fileName,fileId}) {
  const notes=useQuery(api.notes.GetNotes,{
     fileId:fileId,
    });

    function exportPDF(){
      if (!notes) return;
      const element=document.createElement("div");
      element.innerHTML=notes;
      const opt = {
      margin: 0.5,
      filename: `${fileName || "notes"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
       html2pdf().from(element).set(opt).save();

      console.log("notes",notes);

    }


  return (
    <div className='flex justify-between px-8 py-5 shadow-md'>
      <span className='text-3xl py-1'><FaFilePdf></FaFilePdf></span>
      
      {/* <Image src={'/logo.svg'} width={60} height={100} alt='logo'></Image> */}
       <h2> FileName:{fileName}</h2>
      <div className='flex items-center justify-center gap-3'>
        <Link href={'/dashboard'}>
        <Button >Dashboard</Button>
        </Link>
      
      <Button onClick={exportPDF}>Download <FaDownload></FaDownload> </Button>
      <UserButton></UserButton>
      </div>
    </div>
  )
}

export default WorkSpaceHeader
