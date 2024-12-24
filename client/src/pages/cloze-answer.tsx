import { ClozeQuestion } from "@/components/cloze-question"
import type { ClozeQuestion as ClozeQuestionType } from "@/types/cloze-answer"

const sampleQuestion: ClozeQuestionType = {
  id: "1",
  title: "Question 1",
  content: "World War II was fought between the Allies and the {{gap}} powers. It started in {{gap}} and ended in {{gap}}.",
  gaps: [
    { id: "gap-1" },
    { id: "gap-2" },
    { id: "gap-3" },
  ],
  options: [
    { id: "1", text: "1939" },
    { id: "2", text: "Italy" },
    { id: "3", text: "1945" },
    { id: "4", text: "Germans" },
    { id: "5", text: "1920" },
    { id: "6", text: "Axis" },
  ],
  points: 10,
}

export default function ClozeAnswerPage({question}: {question: ClozeQuestionType}) {
  return (
    <main className="">
      <ClozeQuestion question={question} />
    </main>
  )
}

