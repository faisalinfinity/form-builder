"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ComprehensionQuestion } from "@/types/quiz";

interface ComprehensionQuestionRendererProps {
  question: ComprehensionQuestion;
  onAnswer?: (answers: Record<string, string>) => void;
  isEditor?: boolean;
}

export function ComprehensionQuestionRenderer({
  question,
  onAnswer,
  isEditor,
}: ComprehensionQuestionRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleOptionChange = (mcqId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [mcqId]: optionId }));
  };

  const handleSubmit = () => {
    onAnswer(answers);
  };

  const allQuestionsAnswered = question.mcqs.every((mcq) => answers[mcq.id]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle> {question.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="prose max-w-none">
            <p>{question.passage}</p>
          </div>
        </ScrollArea>
        <div className="space-y-8">
          {question.mcqs.map((mcq,i) => (
            <div key={mcq.id} className="space-y-4">
              <h3 className="font-medium text-lg">{i+1}. {mcq.question}</h3>
              <RadioGroup
                value={answers[mcq.id]}
                onValueChange={(value) => handleOptionChange(mcq.id, value)}
              >
                {mcq.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.id}
                      id={`${mcq.id}-${option.id}`}
                    />
                    <Label htmlFor={`${mcq.id}-${option.id}`}>
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </CardContent>
      {!isEditor && (
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!allQuestionsAnswered}
          >
            Submit Answers
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
