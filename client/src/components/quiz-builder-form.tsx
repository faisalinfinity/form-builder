import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { FormInput } from "./form-input";
import { CategoryInput } from "./category-input";
import { QuizItemInput } from "./quiz-item-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import type { QuizFormData, Category, QuizItem } from "@/types/quiz-builder";
import PreviewToggler from "./ui/preview";
import { CategorizationQuiz } from "./categorization-quiz";
import { CategorizeQuiz, Item as QuizItem, Category } from "@/types/quiz";

export function CategorizeBuilderForm({
  questionTitle,
  points,
  onSave,
}: {
  questionTitle: string;
  points: number;
  onSave: (question: CategorizeQuiz) => void;
}) {
  const initialFormData: CategorizeQuiz = {
    title: questionTitle,

    categories: [
      { id: "category-1", name: "Country" },
      { id: "category-2", name: "City" },
    ],
    items: [
      { id: "item-1", content: "Paris", categoryId: "category-2" },
      { id: "item-2", content: "Japan", categoryId: "category-1" },
    ],
    points,
  };
  const [formData, setFormData] = useState<CategorizeQuiz>(initialFormData);
  const [isPreview, setIsPreview] = useState(false);

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => ({
        ...prev,
        categories: arrayMove(
          prev.categories!,
          prev.categories!.findIndex((cat) => cat.id === active.id),
          prev.categories!.findIndex((cat) => cat.id === over.id)
        ),
      }));
    }
  };

  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => ({
        ...prev,
        items: arrayMove(
          prev.items!,
          prev.items!.findIndex((item) => item.id === active.id),
          prev.items!.findIndex((item) => item.id === over.id)
        ),
      }));
    }
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: `category-${formData.categories!.length + 1}`,
      name: "",
    };
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories!, newCategory],
    }));
  };

  const removeCategory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories!.filter((cat) => cat.id !== id),
      items: prev.items!.map((item) =>
        item.categoryId === id ? { ...item, categoryId: undefined } : item
      ),
    }));
  };

  const updateCategory = (id: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories!.map((cat) =>
        cat.id === id ? { ...cat, name } : cat
      ),
    }));
  };

  const addItem = () => {
    const newItem: QuizItem = {
      id: `item-${formData.items!.length + 1}`,
      content: "",
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items!, newItem],
    }));
  };

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items!.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (id: string, content: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items!.map((item) =>
        item.id === id ? { ...item, content } : item
      ),
    }));
  };

  const updateItemCategory = (id: string, categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items!.map((item) =>
        item.id === id ? { ...item, categoryId } : item
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-end gap-4">
        <PreviewToggler isPreview={isPreview} setIsPreview={setIsPreview} />
      </div>

      {isPreview ? (
        <>
          <CategorizationQuiz categorizationQuizData={formData} />
        </>
      ) : (
        <>
          <FormInput
            label="Title"
            value={formData.title}
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Media</h2>
              <Select
                value={formData.media}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, media: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Categories</h2>
              <Button type="button" variant="outline" onClick={addCategory}>
                Add Category
              </Button>
            </div>
            <DndContext onDragEnd={handleCategoryDragEnd}>
              <SortableContext
                items={formData.categories!.map((cat) => cat.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {formData.categories!.map((category) => (
                    <CategoryInput
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      onRemove={removeCategory}
                      onChange={updateCategory}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Items</h2>
              <Button type="button" variant="outline" onClick={addItem}>
                Add Item
              </Button>
            </div>
            <DndContext onDragEnd={handleItemDragEnd}>
              <SortableContext
                items={formData.items!.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {formData.items!.map((item) => (
                    <QuizItemInput
                      key={item.id}
                      id={item.id}
                      content={item.content}
                      categoryId={item.categoryId}
                      categories={formData.categories!}
                      onRemove={removeItem}
                      onChange={updateItem}
                      onCategoryChange={updateItemCategory}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <Button type="submit" className="w-full">
            Save
          </Button>
        </>
      )}
    </form>
  );
}
