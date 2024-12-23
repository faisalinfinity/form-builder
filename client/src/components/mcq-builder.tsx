import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2 } from 'lucide-react'
import type { MCQ, MCQOption } from '@/types/comprehension'

interface MCQBuilderProps {
  mcq: MCQ;
  onUpdate: (updatedMCQ: MCQ) => void;
  onDelete: () => void;
}

export function MCQBuilder({ mcq, onUpdate, onDelete }: MCQBuilderProps) {
  const [localMCQ, setLocalMCQ] = useState<MCQ>(mcq);

  const handleQuestionChange = (question: string) => {
    const updated = { ...localMCQ, question };
    setLocalMCQ(updated);
    onUpdate(updated);
  };

  const handleOptionChange = (optionId: string, text: string) => {
    const updatedOptions = localMCQ.options.map(opt =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    const updated = { ...localMCQ, options: updatedOptions };
    setLocalMCQ(updated);
    onUpdate(updated);
  };

  const handleCorrectOptionChange = (optionId: string) => {
    const updated = { ...localMCQ, correctOptionId: optionId };
    setLocalMCQ(updated);
    onUpdate(updated);
  };

  const addOption = () => {
    const newOption: MCQOption = {
      id: `option-${localMCQ.options.length + 1}`,
      text: '',
    };
    const updated = {
      ...localMCQ,
      options: [...localMCQ.options, newOption],
    };
    setLocalMCQ(updated);
    onUpdate(updated);
  };

  const removeOption = (optionId: string) => {
    const updatedOptions = localMCQ.options.filter(opt => opt.id !== optionId);
    const updated = { ...localMCQ, options: updatedOptions };
    if (localMCQ.correctOptionId === optionId) {
      updated.correctOptionId = '';
    }
    setLocalMCQ(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Label htmlFor={`question-${mcq.id}`} className="text-lg font-semibold">
          Question
        </Label>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Input
        id={`question-${mcq.id}`}
        value={localMCQ.question}
        onChange={(e) => handleQuestionChange(e.target.value)}
        placeholder="Enter your question here"
      />
      <RadioGroup
        value={localMCQ.correctOptionId}
        onValueChange={handleCorrectOptionChange}
      >
        {localMCQ.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Input
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder="Enter option text"
              className="flex-grow"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOption(option.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </RadioGroup>
      <Button onClick={addOption} variant="outline" className="w-full">
        Add Option
      </Button>
    </div>
  );
}

