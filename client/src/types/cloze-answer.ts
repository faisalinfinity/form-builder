export interface ClozeGap {
    id: string
    answer?: string
  }
  
  export interface ClozeOption {
    id: string
    text: string
    isUsed?: boolean
  }
  
  export interface ClozeQuestion {
    id?: string
    title?: string
    content?: string
    gaps?: ClozeGap[]
    options?: ClozeOption[]
    points?: number
  }
  
  