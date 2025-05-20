export type Category = {
  id: string
  title: string
  description: string
  checklistItems: {
    id: string
    text: string
  }[]
}

export type AssessmentResult = {
  [key: string]: {
    score: number
    checkedItems: string[]
  }
}

export type RecommendationType = {
  category: string
  title: string
  description: string
  resourceType: "video" | "article" | "checklist" | "guide" | "consultation"
  resourceUrl: string
}
