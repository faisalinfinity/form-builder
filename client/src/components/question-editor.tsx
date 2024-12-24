import { useState } from "react";
import { ClozeBuilderForm as ClozeBuilder } from "./cloze-builder-form";
import { ComprehensionBuilder } from "./comprehension-builder";
import { CategorizeBuilderForm as CategorizeBuilder } from "./quiz-builder-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Question, QuestionType } from "@/types/quiz";
import { Trash } from "lucide-react";
import * as React from "react";

interface QuestionEditorProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: (id: string) => void;
}

function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const [questionType, setQuestionType] = useState<QuestionType>(
    question?.type || "cloze"
  );
  const [title, setTitle] = useState(question?.title || "");
  const [points, setPoints] = useState(question?.points || 10);
  const [shrink, setShrink] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  const handleSave = (specificQuestionData: any) => {
    const baseQuestion = {
      id: question?.id || uuidv4(),
      type: questionType,
      title,
      points,
    };

    const fullQuestion = { ...baseQuestion, ...specificQuestionData };
    onSave(fullQuestion as Question);
    setShrink(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Question Title"
          className="flex-grow"
        />
        <Input
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
          placeholder="Points"
          className="w-24"
        />
        <Select
          value={questionType}
          onValueChange={(value: QuestionType) => setQuestionType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cloze">Cloze</SelectItem>
            <SelectItem value="comprehension">Comprehension</SelectItem>
            <SelectItem value="categorize">Categorize</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between gap-2">
        <Button onClick={() => setShrink(!shrink)}>
          {shrink ? "Expand" : "Shrink"}{" "}
        </Button>
        <Button
          variant="outline"
          onClick={() => onCancel(question?.id as string)}
        >
          <Trash />
        </Button>
      </div>
      {!shrink && (
        <>
          {questionType === "cloze" && (
            <ClozeBuilder
              questionTitle={title}
              isEditor={isEditor}
              // initialData={question as ClozeQuestion}
              onSave={handleSave}
            />
          )}
          {questionType === "comprehension" && (
            <ComprehensionBuilder
              questionTitle={title}
              // initialData={question as ComprehensionQuestion}
              onSave={handleSave}
            />
          )}
          {questionType === "categorize" && (
            <CategorizeBuilder
              points={points}
              questionTitle={title}
              // initialData={question as CategorizeQuestion}
              onSave={handleSave}
            />
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(
  QuestionEditor,
  (prev,next) => prev.question?.id === next.question?.id
);
