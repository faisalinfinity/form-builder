import { EyeIcon, HammerIcon } from 'lucide-react'
import * as React from 'react'
import { Switch } from './switch'

const PreviewToggler = ({isPreview,setIsPreview}:{isPreview:boolean,setIsPreview:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className="flex items-center gap-4 text-sm font-medium">
    <div
      className={`flex items-center gap-2 transition-colors ${
        isPreview ? '' : 'text-primary'
      }`}
    >
      <HammerIcon className="h-5 w-5" />
      <span>Builder</span>
    </div>
    <Switch
      className="data-[state=unchecked]:bg-primary"
      checked={isPreview}
      onCheckedChange={setIsPreview}
    />
    <div
      className={`flex items-center gap-2 transition-colors ${
        isPreview ? 'text-primary' : ''
      }`}
    >
      <EyeIcon className="h-5 w-5" />
      <span>Preview</span>
    </div>
  </div>
    
  )
}

export default PreviewToggler