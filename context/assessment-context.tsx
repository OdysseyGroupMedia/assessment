"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { AssessmentResult } from "@/types/assessment"
import { categories } from "@/data/categories"

type AssessmentContextType = {
  currentStep: number
  setCurrentStep: (step: number) => void
  results: AssessmentResult
  updateCategoryScore: (categoryId: string, score: number) => void
  toggleChecklistItem: (categoryId: string, itemId: string) => void
  userInfo: {
    name: string
    email: string
    phone: string
  } | null
  setUserInfo: (info: { name: string; email: string; phone: string }) => void
  isComplete: boolean
  setIsComplete: (complete: boolean) => void
  resetAssessment: () => void
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined)

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [results, setResults] = useState<AssessmentResult>(() => {
    // Initialize with all categories at score 1 and empty checklist
    return categories.reduce((acc, category) => {
      acc[category.id] = { score: 1, checkedItems: [] }
      return acc
    }, {} as AssessmentResult)
  })
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; phone: string } | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const updateCategoryScore = (categoryId: string, score: number) => {
    setResults((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        score,
      },
    }))
  }

  const toggleChecklistItem = (categoryId: string, itemId: string) => {
    setResults((prev) => {
      const currentCheckedItems = prev[categoryId].checkedItems
      const newCheckedItems = currentCheckedItems.includes(itemId)
        ? currentCheckedItems.filter((id) => id !== itemId)
        : [...currentCheckedItems, itemId]

      return {
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          checkedItems: newCheckedItems,
        },
      }
    })
  }

  const resetAssessment = () => {
    // Reset to initial state
    setCurrentStep(0)
    setResults(
      categories.reduce((acc, category) => {
        acc[category.id] = { score: 1, checkedItems: [] }
        return acc
      }, {} as AssessmentResult),
    )
    setUserInfo(null)
    setIsComplete(false)
  }

  return (
    <AssessmentContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        results,
        updateCategoryScore,
        toggleChecklistItem,
        userInfo,
        setUserInfo,
        isComplete,
        setIsComplete,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const context = useContext(AssessmentContext)
  if (context === undefined) {
    throw new Error("useAssessment must be used within an AssessmentProvider")
  }
  return context
}
