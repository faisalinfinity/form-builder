'use client'

import type { ClozeQuestion } from '@/types/cloze'

interface ClozePreviewProps {
  question: ClozeQuestion
}

export function ClozePreview({ question }: ClozePreviewProps) {
  const previewContent = question.content.replace(
    /<mark data-type="cloze-gap">(.*?)<\/mark>/g,
    '____'
  )

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium mb-2">Preview</h3>
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    </div>
  )
}

