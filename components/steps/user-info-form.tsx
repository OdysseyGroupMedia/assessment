"use client"

import type React from "react"

import { useAssessment } from "@/context/assessment-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { categories } from "@/data/categories"

export function UserInfoForm() {
  const { setCurrentStep, setUserInfo, setIsComplete } = useAssessment()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string }>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    const newErrors: { name?: string; email?: string } = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setUserInfo({ name, email, phone })
    setIsComplete(true)
    setCurrentStep(categories.length + 2) // Move to results
  }

  const handleSkip = () => {
    setIsComplete(true)
    setCurrentStep(categories.length + 2) // Move to results
  }

  return (
    <Card className="w-full shadow-lg border-primary/20 bg-card">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Almost Done!</CardTitle>
        <CardDescription className="text-base sm:text-lg">
          Enter your information to receive your personalized assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-muted placeholder:text-muted-foreground/50"
            />
            {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-muted placeholder:text-muted-foreground/50"
            />
            {errors?.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(123) 456-7890"
              className="bg-muted placeholder:text-muted-foreground/50"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          type="submit"
          className="w-full py-2 sm:py-3 bg-accent hover:bg-accent/90 text-accent-foreground btn-primary-hover"
          onClick={handleSubmit}
        >
          Get My Results
        </Button>
        <Button
          variant="ghost"
          className="w-full hover:bg-muted hover:text-foreground text-sm sm:text-base"
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      </CardFooter>
    </Card>
  )
}
