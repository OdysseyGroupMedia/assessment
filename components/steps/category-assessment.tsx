"use client"

import { useAssessment } from "@/context/assessment-context"
import type { Category } from "@/types/assessment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { categories } from "@/data/categories"

export function CategoryAssessment({ category }: { category: Category }) {
  const { currentStep, setCurrentStep, results, updateCategoryScore, toggleChecklistItem } = useAssessment()

  const handleNext = () => {
    if (currentStep < categories.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(categories.length + 1) // Move to user info
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      setCurrentStep(0) // Back to intro
    }
  }

  const categoryResult = results[category.id]

  return (
    <Card className="w-full shadow-lg border-primary/20 bg-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Step {currentStep} of {categories.length}
          </div>
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            {Math.round((currentStep / categories.length) * 100)}% Complete
          </div>
        </div>
        <div className="w-full progress-bar mt-2">
          <div className="progress-bar-fill" style={{ width: `${(currentStep / categories.length) * 100}%` }} />
        </div>
        <CardTitle className="text-xl sm:text-2xl mt-4">{category.title}</CardTitle>
        <CardDescription className="text-base sm:text-lg">{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-3">How would you rate your school in this area?</h3>
          <RadioGroup
            value={categoryResult.score.toString()}
            onValueChange={(value) => updateCategoryScore(category.id, Number.parseInt(value))}
            className="grid grid-cols-5 gap-1 sm:gap-2"
          >
            <div className="flex flex-col items-center">
              <RadioGroupItem value="1" id={`${category.id}-1`} className="peer sr-only" />
              <Label
                htmlFor={`${category.id}-1`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-2 sm:p-4 hover:bg-secondary hover:text-secondary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-xl sm:text-2xl font-bold">1</span>
                <span className="text-[10px] sm:text-xs text-center mt-1 text-muted-foreground">Not Implemented</span>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="2" id={`${category.id}-2`} className="peer sr-only" />
              <Label
                htmlFor={`${category.id}-2`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-secondary hover:text-secondary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-2xl font-bold">2</span>
                <span className="text-xs text-center mt-1 text-muted-foreground">Basic</span>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="3" id={`${category.id}-3`} className="peer sr-only" />
              <Label
                htmlFor={`${category.id}-3`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-secondary hover:text-secondary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-2xl font-bold">3</span>
                <span className="text-xs text-center mt-1 text-muted-foreground">Adequate</span>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="4" id={`${category.id}-4`} className="peer sr-only" />
              <Label
                htmlFor={`${category.id}-4`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-secondary hover:text-secondary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-2xl font-bold">4</span>
                <span className="text-xs text-center mt-1 text-muted-foreground">Strong</span>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="5" id={`${category.id}-5`} className="peer sr-only" />
              <Label
                htmlFor={`${category.id}-5`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-secondary hover:text-secondary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-2xl font-bold">5</span>
                <span className="text-xs text-center mt-1 text-muted-foreground">Mastered</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-medium mb-3">Check all that apply to your school:</h3>
          <div className="grid gap-2 sm:gap-3">
            {category.checklistItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <Checkbox
                  id={item.id}
                  checked={categoryResult.checkedItems.includes(item.id)}
                  onCheckedChange={() => toggleChecklistItem(category.id, item.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={item.id} className="text-base leading-tight">
                  {item.text}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} className="hover:bg-muted hover:text-foreground">
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground btn-primary-hover">
          {currentStep === categories.length ? "Complete Assessment" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}
