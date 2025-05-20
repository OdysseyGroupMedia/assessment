"use client"

import { useAssessment } from "@/context/assessment-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"
import { PreviewDialog } from "../preview-dialog"

export function Introduction() {
  const { setCurrentStep } = useAssessment()

  return (
    <Card className="w-full shadow-lg border-primary/20 bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/20">
          <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl">Martial Arts Business Assessment</CardTitle>
        <CardDescription className="text-base sm:text-lg">
          Evaluate your school's business operations and discover areas for improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p>
          Most martial arts schools are not run like real businesses. This comprehensive assessment will help you
          identify gaps in your business operations across 23 critical departments and provide resources to help you
          improve.
        </p>
        <div className="my-4 sm:my-6 grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-muted p-4 card-hover">
            <h3 className="font-medium text-secondary">What You'll Get</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-left">
              <li>Comprehensive 23-point business evaluation</li>
              <li>Visual breakdown of strengths and weaknesses</li>
              <li>Personalized improvement recommendations</li>
              <li>Access to educational resources</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-muted p-4 card-hover">
            <h3 className="font-medium text-secondary">How It Works</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-left">
              <li>Rate yourself in 23 key business areas</li>
              <li>Complete checklists for each category</li>
              <li>Review your personalized results</li>
              <li>Get targeted recommendations</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center">
          <PreviewDialog />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground btn-primary-hover"
          size="lg"
          onClick={() => setCurrentStep(1)}
        >
          Start Your Assessment
        </Button>
      </CardFooter>
    </Card>
  )
}
