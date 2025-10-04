"use client"
import React from 'react'
import Bold from '@tiptap/extension-bold'
import { BoldIcon, HighlighterIcon, ItalicIcon, UnderlineIcon,SparklesIcon } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { search } from '@/convex/myAction';
import { chatSession } from '@/app/configs/AIModel';
import { toast } from "sonner"
//import { useMutation } from '@/convex/_generated/server';
import { useUser } from '@clerk/nextjs';


function EditorExtentions({editor}) {
  const {fileId}=useParams();
  const {user}=useUser();

   const SearchAI=useAction(api.myAction.search);
   const saveNotes=useMutation(api.notes.AddNotes)
  const onAiClick=async(e)=>{
    toast("AI is generating the answer.....")

    const selectedText=editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    )
    const result=await SearchAI({
      query:selectedText,
      fileId:fileId
    })
    const unfomattedAns=JSON.parse(result)
    let allunfomattedAns=''
    unfomattedAns && unfomattedAns.forEach((item)=>{
      allunfomattedAns+=item.pageContent;
    })
    // const PROMPT="for question:"+selectedText+"and with the given content please give the appropriate answer by taking this as a context  in html formt. Dont repeat the question just give the answer.Answer content is:"+allunfomattedAns;
    const PROMPT = `
     You are given the following question: "${selectedText}".
     Use the provided content as context to generate the most appropriate answer.

  Requirements:
- Output only the answer in valid, well-structured HTML format.
- Do NOT repeat or restate the question.
- Focus only on the answer using the given context.
- Use the following content as the answer base: "${allunfomattedAns}".
- Use the given context and your knewledge also.
`;


    const AimodelResult=await chatSession.sendMessage(PROMPT)
    console.log(AimodelResult.response.text())
    const finalAnswer=AimodelResult.response.text().replace('```','').replace('html','').replace('```','');

    const Alltext=editor.getHTML();
    editor.commands.setContent(Alltext+`<p> <div> <strong>Question:</strong> ${selectedText}  </div> <div><strong>Answer:</strong>${finalAnswer}</div>  </p>`)
    saveNotes({
      notes:editor.getHTML(),
      fileId:fileId,
      createdBy:user?.primaryEmailAddress?.emailAddress
    })

  }
  if (!editor) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="control-group">
        <div className="button-group flex gap-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-red-500' : ''}
          >
            <BoldIcon></BoldIcon>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-red-500' : ''}
          >
            <ItalicIcon></ItalicIcon>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'text-red-500' : ''}
          >
            <UnderlineIcon></UnderlineIcon>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'text-red-500' : ''}
          >
            <HighlighterIcon></HighlighterIcon>
          
          </button>
          <button onClick={(e)=>onAiClick(e)} className='hover:text-slate-500'>
            <SparklesIcon></SparklesIcon>
          </button>
          </div>
          </div>
    </div>
  )
}

export default EditorExtentions
