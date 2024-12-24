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
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import  QuestionEditor from "./question-editor";
import { SortableQuestion } from "./sortable-question";
import type { Quiz, Question } from "@/types/quiz";

const initialQuiz: Quiz = {
  id: uuidv4(),
  title: "",
  description: "",
  questions: [],
};

export function QuizBuilder() {
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
  const [editingQuestion, setEditingQuestion] = useState<Question[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuiz((prev) => {
        const oldIndex = prev.questions.findIndex((q) => q.id === active.id);
        const newIndex = prev.questions.findIndex((q) => q.id === over.id);

        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex),
        };
      });
    }
  };

  const addQuestion = () => {
    setEditingQuestion(
      Array.isArray(editingQuestion)
        ? [...editingQuestion, { id: uuidv4() }]
        : [{ id: uuidv4() }]
    );
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const deleteQuestion = (questionId: string) => {
    setEditingQuestion((prev) => prev.filter((q) => q.id !== questionId));
  };

  const saveQuestion = (question: Question) => {
    setEditingQuestion((prev) => {
      // const existingIndex = prev.findIndex((q) => q.id === question.id);
      // if (existingIndex !== -1) {
      //   const updatedQuestions = [...prev];
      //   updatedQuestions[existingIndex] = question;

      //   return [ ...prev, updatedQuestions ];
      // } else {
      //   return [ ...prev, question] ;
      // }
      return prev.map((q) => {
        if (q.id === question.id) {
          return question;
        }
        return q;
      });
    });
    // setEditingQuestion(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <Input
          value={quiz.title}
          onChange={(e) =>
            setQuiz((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Quiz Title"
          className="text-2xl font-semibold"
        />
        <Textarea
          value={quiz.description}
          onChange={(e) =>
            setQuiz((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Quiz Description"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions</h2>
        </div>

        {Array.isArray(editingQuestion) &&
          editingQuestion.map((question, index) => (
            <QuestionEditor
              key={index}
              question={question}
              onSave={saveQuestion}
              onCancel={deleteQuestion}
            />
          ))}

        <div className="flex justify-end">
          {" "}
          <Button onClick={addQuestion}>Add Question</Button>
        </div>
        {/* {!editingQuestion ? (
          <QuestionEditor
            question={editingQuestion}
            onSave={saveQuestion}
            onCancel={() => setEditingQuestion(null)}
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={quiz.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {quiz.questions.map((question) => (
                <SortableQuestion
                  key={question.id}
                  id={question.id}
                  question={question}
                  onEdit={() => editQuestion(question)}
                  onDelete={() => deleteQuestion(question.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )} */}
      </div>

      {editingQuestion.length > 0 && (
        <Button
        
          onClick={() => console.log(JSON.stringify({quiz,questions:editingQuestion}, null, 2))}
          className="w-full"
        >
          Save Quiz
        </Button>
      )}
    </div>
  );
}
