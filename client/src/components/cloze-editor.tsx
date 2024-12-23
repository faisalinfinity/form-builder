'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ClozeGap } from './tiptap/cloze-extension'
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, Underline } from 'lucide-react'

interface ClozeEditorProps {
  content: string
  onChange: (content: string) => void
}

export function ClozeEditor({ content, onChange }: ClozeEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ClozeGap,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg">
      <div className="flex items-center gap-1 p-2 border-b">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('clozeGap')}
          onPressedChange={() => editor.chain().focus().toggleClozeGap().run()}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-4 focus:outline-none"
      />
    </div>
  )
}

