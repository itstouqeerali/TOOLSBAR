import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { PaginationPlus } from 'tiptap-pagination-plus'

export default function Test() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      PaginationPlus.configure({ enabled: true })
    ]
  })
  return <EditorContent editor={editor} />
}
