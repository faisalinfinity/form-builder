import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MCQBuilder } from "./mcq-builder";
import { SortableMCQ } from "./sortable-mcq";
// import { ComprehensionPreview } from './comprehension-preview'
import type { ComprehensionQuestion, MCQ } from "@/types/quiz";
import PreviewToggler from "./ui/preview";
import { ComprehensionQuestionRenderer } from "./comprehension-renderer";
import { v4 as uuidv4 } from "uuid";

interface ComprehensionBuilderProps {
  initialData?: ComprehensionQuestion;
  questionTitle?: string;
  onSave: (question: ComprehensionQuestion) => void;
}

export function ComprehensionBuilder({
  questionTitle,
  initialData,
  onSave,
}: ComprehensionBuilderProps) {
  const [question, setQuestion] = useState<ComprehensionQuestion>(
    initialData || {
      id: `${uuidv4()}`,
      type: "comprehension",
      title: questionTitle || "",
      passage: "",
      mcqs: [],
    }
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestion((prev) => {
        const oldIndex = prev.mcqs.findIndex((mcq) => mcq.id === active.id);
        const newIndex = prev.mcqs.findIndex((mcq) => mcq.id === over.id);

        return {
          ...prev,
          mcqs: arrayMove(prev.mcqs, oldIndex, newIndex),
        };
      });
    }
  };

  const addMCQ = () => {
    const newMCQ: MCQ = {
      id: `mcq-${question.mcqs.length + 1}`,
      question: "",
      options: [
        { id: "option-1", text: "" },
        { id: "option-2", text: "" },
      ],
      correctOptionId: "",
    };
    setQuestion((prev) => ({
      ...prev,
      mcqs: [...prev.mcqs, newMCQ],
    }));
  };

  const updateMCQ = (updatedMCQ: MCQ) => {
    setQuestion((prev) => ({
      ...prev,
      mcqs: prev.mcqs.map((mcq) =>
        mcq.id === updatedMCQ.id ? updatedMCQ : mcq
      ),
    }));
  };

  const deleteMCQ = (mcqId: string) => {
    setQuestion((prev) => ({
      ...prev,
      mcqs: prev.mcqs.filter((mcq) => mcq.id !== mcqId),
    }));
  };

  return (
    <div className="space-y-8">
      <div className=" gap-8">
        <div className="space-y-4">
          <div className="p-1 flex justify-end">
            <PreviewToggler isPreview={isPreview} setIsPreview={setIsPreview} />
          </div>

          {isPreview ? (
            <div className="w-full">
              <ComprehensionQuestionRenderer isEditor question={question} />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="passage">Passage</Label>
                <Textarea
                  id="passage"
                  value={question.passage}
                  onChange={(e) =>
                    setQuestion((prev) => ({
                      ...prev,
                      passage: e.target.value,
                    }))
                  }
                  placeholder="Enter the comprehension passage"
                  className="min-h-[200px]"
                />
              </div>
            </>
          )}
        </div>
        {/* <div>
          <ComprehensionPreview question={question} />
        </div> */}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Multiple Choice Questions</h2>
          <Button onClick={addMCQ}>Add MCQ</Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={question.mcqs.map((mcq) => mcq.id)}
            strategy={verticalListSortingStrategy}
          >
            {question.mcqs.map((mcq) => (
              <SortableMCQ key={mcq.id} id={mcq.id}>
                <MCQBuilder
                  mcq={mcq}
                  onUpdate={updateMCQ}
                  onDelete={() => deleteMCQ(mcq.id)}
                />
              </SortableMCQ>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Button onClick={() => onSave(question)} className="w-full">
        Save Comprehension Question
      </Button>
    </div>
  );
}
