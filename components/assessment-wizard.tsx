"use client"

import { useAssessment } from "@/context/assessment-context"
import { Introduction } from "./steps/introduction"
import { CategoryAssessment } from "./steps/category-assessment"
import { UserInfoForm } from "./steps/user-info-form"
import { Results } from "./steps/results"
import { categories } from "@/data/categories"

export function AssessmentWizard() {
  const { currentStep } = useAssessment()

  // Step 0 is introduction
  // Steps 1-10 are the 10 categories
  // Step 11 is user info
  // Step 12 is results

  const renderStep = () => {
    if (currentStep === 0) {
      return <Introduction />
    } else if (currentStep >= 1 && currentStep <= categories.length) {
      return <CategoryAssessment category={categories[currentStep - 1]} />
    } else if (currentStep === categories.length + 1) {
      return <UserInfoForm />
    } else {
      return <Results />
    }
  }

  return <div className="container mx-auto px-4 py-8 max-w-4xl">{renderStep()}</div>
}
