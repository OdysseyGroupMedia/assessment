"use client"

import { useAssessment } from "@/context/assessment-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { categories } from "@/data/categories"
import { recommendations } from "@/data/recommendations"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Download, Mail, Calendar, Home } from "lucide-react"
import { generatePDF } from "@/utils/generate-pdf"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function Results() {
  const { results, userInfo, resetAssessment } = useAssessment()
  const { toast } = useToast()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Prepare data for radar chart
  const chartData = categories.slice(0, 10).map((category) => ({
    category: category.title.split(" ")[0], // Just use the first word to keep it concise
    value: results[category.id].score,
    fullMark: 5,
  }))

  // Calculate overall score
  const totalScore = Object.values(results).reduce((sum, result) => sum + result.score, 0)
  const averageScore = totalScore / categories.length
  // Convert to score out of 10
  const scoreOutOfTen = (averageScore * 2).toFixed(1)

  // Get weak areas (score <= 3)
  const weakAreas = categories
    .filter((category) => results[category.id].score <= 3)
    .sort((a, b) => results[a.id].score - results[b.id].score)

  // Get relevant recommendations
  const relevantRecommendations = weakAreas
    .map((category) => recommendations.find((rec) => rec.category === category.id))
    .filter(Boolean)

  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-secondary"
    if (score >= 2) return "text-accent"
    return "text-red-500"
  }

  // Get background color for category card
  const getCategoryCardClass = (score: number) => {
    if (score >= 4) return "bg-secondary/10 border-secondary/30"
    if (score >= 2) return "bg-amber-950/30 border-amber-800"
    return "bg-red-950/30 border-red-800"
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const success = await generatePDF(results, userInfo)
      if (success) {
        toast({
          title: "PDF Generated Successfully",
          description: "Your assessment results have been downloaded as a PDF.",
        })
      } else {
        toast({
          title: "Error Generating PDF",
          description: "There was a problem creating your PDF. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error Generating PDF",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Home button at the top */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold sm:text-2xl">Assessment Results</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAssessment}
          className="flex items-center gap-1 border-primary/30 hover:bg-primary/10"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Start Over</span>
        </Button>
      </div>

      <Card className="w-full shadow-lg border-primary/20 bg-card">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Business Assessment Results</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              {userInfo ? `Personalized for ${userInfo.name}` : "Your martial arts school business evaluation"}
            </CardDescription>
            <div className="mt-2 inline-block bg-primary/20 text-primary text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
              {weakAreas.length > 0 ? `${weakAreas.length} Areas Need Work` : "All Areas Strong"}
            </div>
          </div>
          <Button
            className="mt-4 sm:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground btn-primary-hover flex items-center text-xs sm:text-sm w-full sm:w-auto"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            {isGeneratingPDF ? "Generating..." : "Download PDF Report"}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Top section with score and chart */}
          <div className="flex flex-col md:flex-row">
            {/* Left side - Big score */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 border rounded-lg bg-muted mb-4 md:mb-0 md:mr-4 card-hover">
              <h3 className="text-lg sm:text-xl font-medium mb-2">Overall Business Score</h3>
              <div className="relative">
                <div className="text-5xl sm:text-7xl font-bold text-center mb-2">
                  <span className={getScoreColor(averageScore)}>{scoreOutOfTen}</span>
                  <span className="text-muted-foreground text-2xl sm:text-3xl">/10</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                Based on your assessment across {categories.length} categories
              </p>
            </div>

            {/* Right side - Radar chart */}
            <div className="flex-1 border rounded-lg bg-muted p-3 sm:p-4 card-hover">
              <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-center">Top 10 Categories</h3>
              <div className="h-[200px] sm:h-[250px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Score",
                      color: "hsl(var(--primary))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fill: "rgba(255, 255, 255, 0.8)" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "rgba(255, 255, 255, 0.8)" }} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="var(--color-value)"
                        fill="var(--color-value)"
                        fillOpacity={0.6}
                      />
                      <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#333" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>

          {/* Bottom section with areas needing improvement */}
          <div className="border rounded-lg bg-muted p-4 mt-4 card-hover">
            <h3 className="text-lg font-medium mb-3">Areas Needing Improvement</h3>
            {weakAreas.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {weakAreas.slice(0, 6).map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg border ${getCategoryCardClass(results[category.id].score)}`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{category.title}</h4>
                      <span className={`font-bold ${getScoreColor(results[category.id].score)}`}>
                        {results[category.id].score}/5
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Missing elements:</span>{" "}
                      {
                        category.checklistItems.filter((item) => !results[category.id].checkedItems.includes(item.id))
                          .length
                      }{" "}
                      of {category.checklistItems.length}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Great job! You've rated yourself highly in all areas.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger
            value="recommendations"
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="hidden sm:inline">Recommendations</span>
            <span className="sm:hidden">Recs</span>
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="hidden sm:inline">Detailed Results</span>
            <span className="sm:hidden">Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="next-steps"
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="hidden sm:inline">Next Steps</span>
            <span className="sm:hidden">Steps</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="mt-4">
          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Resources to help improve your weak areas</CardDescription>
            </CardHeader>
            <CardContent>
              {relevantRecommendations.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {relevantRecommendations.map(
                    (rec, index) =>
                      rec && (
                        <Card key={index} className="overflow-hidden border resource-card">
                          <div className="resource-card-header">
                            <h3 className="font-bold text-lg">{rec.title}</h3>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                          <div className="p-4 flex justify-between items-center">
                            <div className="text-sm">
                              <span className="resource-type-badge">
                                {rec.resourceType.charAt(0).toUpperCase() + rec.resourceType.slice(1)}
                              </span>
                            </div>
                            <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                              <a href={rec.resourceUrl}>Access Resource</a>
                            </Button>
                          </div>
                        </Card>
                      ),
                  )}
                </div>
              ) : (
                <p>No specific recommendations needed. You're doing great!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>Detailed Category Results</CardTitle>
              <CardDescription>Complete breakdown of your assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 bg-muted">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{category.title}</h3>
                      <span className={`font-bold ${getScoreColor(results[category.id].score)}`}>
                        {results[category.id].score}/5
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>

                    <h4 className="text-sm font-medium mb-2">Checklist Items:</h4>
                    <ul className="space-y-1">
                      {category.checklistItems.map((item) => (
                        <li key={item.id} className="text-sm flex items-start">
                          <span
                            className={`mr-2 ${results[category.id].checkedItems.includes(item.id) ? "text-green-500" : "text-red-500"}`}
                          >
                            {results[category.id].checkedItems.includes(item.id) ? "✓" : "✗"}
                          </span>
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="next-steps" className="mt-4">
          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>Take Action</CardTitle>
              <CardDescription>Next steps to improve your martial arts business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="flex flex-col border card-hover bg-muted">
                    <CardHeader>
                      <CardTitle className="text-center">Download Report</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                      <Download className="h-12 w-12 text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Save your assessment results as a PDF to reference later
                      </p>
                    </CardContent>
                    <div className="p-4 mt-auto">
                      <Button
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-primary-hover"
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                      >
                        {isGeneratingPDF ? "Generating..." : "Download PDF"}
                      </Button>
                    </div>
                  </Card>

                  <Card className="flex flex-col border card-hover bg-muted">
                    <CardHeader>
                      <CardTitle className="text-center">Email Results</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                      <Mail className="h-12 w-12 text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Have your results and recommendations sent to your inbox
                      </p>
                    </CardContent>
                    <div className="p-4 mt-auto">
                      <Button className="w-full border hover:bg-muted hover:text-foreground" variant="outline">
                        Send Email
                      </Button>
                    </div>
                  </Card>

                  <Card className="flex flex-col border card-hover bg-muted">
                    <CardHeader>
                      <CardTitle className="text-center">Book a Consultation</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                      <Calendar className="h-12 w-12 text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Schedule a 30-minute call to discuss your results and get personalized advice
                      </p>
                    </CardContent>
                    <div className="p-4 mt-auto">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-primary-hover">
                        Book Call
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Ready for a Complete Business Transformation?</h3>
                  <p className="text-muted-foreground mb-4">
                    Join our comprehensive program designed specifically for martial arts school owners
                  </p>
                  <Button
                    size="lg"
                    className="px-8 bg-accent hover:bg-accent/90 text-accent-foreground btn-primary-hover"
                  >
                    Learn About Our Program
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
