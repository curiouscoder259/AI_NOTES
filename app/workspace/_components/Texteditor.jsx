import React, { useEffect } from 'react'
import { useEditor,EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import EditorExtentions from './EditorExtentions'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { useQueries,useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

function Texteditor({fileId}) {
  const notes=useQuery(api.notes.GetNotes,{
   fileId:fileId,
  });

  const editor = useEditor({
    extensions: [StarterKit,
      Placeholder.configure({
        placeholder:'Start writing your notes!'
      }),Underline, Highlight.configure({ multicolor: true })
    ],
    
    editorProps:{
      attributes:{
        class:'focus:outline-none h-screen p-5'
      }

    } 
  })
   useEffect(()=>{
    editor&&editor.commands.setContent(notes);
   },[notes])
  
  return (
    <div>
       <EditorExtentions editor={editor}></EditorExtentions>
      <div className='overflow-scroll h-[88vh]'>
       <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Texteditor
