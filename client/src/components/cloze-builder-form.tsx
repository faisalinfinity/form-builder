import { v4 as uuidv4 } from "uuid";

import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClozeEditor } from "./cloze-editor";
import { ClozePreview } from "./cloze-preview";
import { AnswerOption } from "./answer-option";
import type { ClozeQuestion, ClozeAnswer } from "@/types/cloze";
import PreviewToggler from "./ui/preview";
import ClozeAnswerPage from "@/pages/cloze-answer";
import { extractMarkText, replaceMarkWithGap } from "@/utils/utility-fn";

const initialQuestion: ClozeQuestion = {
  id: "1",
  title: "Question 1",
  content:
    'World War II was fought between the Allies and the <mark data-type="cloze-gap">Axis</mark> powers.',
  answers: [
    { id: "1", text: "Axis", isCorrect: true },
    { id: "2", text: "Central", isCorrect: false },
  ],
  points: 10,
};

export function ClozeBuilderForm({
  questionTitle,
  isEditor,
  onSave,
}: {
  questionTitle: string;
  onSave: (question: ClozeQuestion) => void;
  isEditor?: boolean;
}) {
  const [question, setQuestion] = useState<ClozeQuestion>(initialQuestion);
  const [isPreview, setIsPreview] = useState(false);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestion((prev) => ({
        ...prev,
        answers: arrayMove(
          prev.answers,
          prev.answers.findIndex((answer) => answer.id === active.id),
          prev.answers.findIndex((answer) => answer.id === over.id)
        ),
      }));
    }
  };

  const addAnswer = () => {
    const newAnswer: ClozeAnswer = {
      id: `answer-${question.answers.length + 1}`,
      text: "",
      isCorrect: false,
    };
    setQuestion((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
    }));
  };

  const addCorrectAnswers = (content: string) => {
    setQuestion((prev) => ({
      ...prev,
      answers: extractMarkText(content).map((ans, i) => {
        const newAnswer: ClozeAnswer = {
          id: `answer-${i + 1}`,
          text: ans,
          isCorrect: true,
        };
        return newAnswer;
      }),
    }));
  };

  const removeAnswer = (id: string) => {
    setQuestion((prev) => ({
      ...prev,
      answers: prev.answers.filter((answer) => answer.id !== id),
    }));
  };

  const updateAnswer = (id: string, text: string) => {
    setQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) =>
        answer.id === id ? { ...answer, text } : answer
      ),
    }));
  };

  const updateAnswerCorrect = (id: string, isCorrect: boolean) => {
    setQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) =>
        answer.id === id ? { ...answer, isCorrect } : answer
      ),
    }));
  };

  const handleSave = () => {
    onSave({
      id: uuidv4(),
      title: questionTitle,
      content: replaceMarkWithGap(question.content),
      answers: question.answers,
      points: question.points,
    });
  };

  return (
    <form className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Input
          value={question.title}
          onChange={(e) =>
            setQuestion((prev) => ({ ...prev, title: e.target.value }))
          }
          className="text-2xl font-semibold w-auto"
        />
        <div className="flex items-center gap-4">
          <PreviewToggler isPreview={isPreview} setIsPreview={setIsPreview} />
        </div>
      </div>

      {isPreview ? (
        <>
          <ClozeAnswerPage
            question={{
              id: "1",
              title: questionTitle,
              content: replaceMarkWithGap(question.content),
              gaps: question.answers
                .filter((answer) => answer.isCorrect)
                .map((_, i) => ({ id: `gap-${i + 1}` })),
              options: question.answers.map((answer) => ({
                id: answer.id,
                text: answer.text,
              })),
              points: question.points,
            }}
          />{" "}
        </>
      ) : (
        <>
          <ClozePreview question={question} />
          <div className="space-y-4">
            <Label>Sentence</Label>
            <ClozeEditor
              content={question.content}
              onChange={(content) => {
                addCorrectAnswers(content);
                setQuestion((prev) => ({ ...prev, content }));
              }}
            />
          </div>

          {/* <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Media</Label>
              <Select
                value={question.media}
                onValueChange={(value) =>
                  setQuestion((prev) => ({ ...prev, media: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <Button type="button" variant="outline" onClick={addAnswer}>
                Add Option
              </Button>
            </div>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={question.answers.map((answer) => answer.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {question.answers.map((answer) => (
                    <AnswerOption
                      key={answer.id}
                      answer={answer}
                      onRemove={removeAnswer}
                      onChange={updateAnswer}
                      onCorrectChange={updateAnswerCorrect}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* <div className="space-y-2">
            <Label>Feedback (Optional)</Label>
            <Textarea
              value={question.feedback}
              onChange={(e) =>
                setQuestion((prev) => ({ ...prev, feedback: e.target.value }))
              }
              placeholder="Add feedback for this question..."
            />
          </div> */}

          <Button onClick={handleSave} className="w-full">
            Save Question
          </Button>
        </>
      )}
    </form>
  );
}
