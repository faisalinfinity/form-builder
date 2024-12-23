
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { DraggableItem } from './draggable-item'
import type { Category, Item } from '@/types/quiz'

interface CategoryDropZoneProps {
  category: Category
  items: Item[]
}

export function CategoryDropZone({ category, items }: CategoryDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  })

  const categoryItems = items.filter(item => item.categoryId === category.id)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 rounded-lg min-h-[200px] transition-colors",
        category.color === 'pink' && "bg-pink-100",
        category.color === 'yellow' && "bg-yellow-100",
        isOver && "ring-2 ring-primary"
      )}
    >
      <h3 className="font-semibold mb-4">{category.name}</h3>
      <div className="space-y-2">
        {categoryItems.map((item) => (
          <DraggableItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  )
}

