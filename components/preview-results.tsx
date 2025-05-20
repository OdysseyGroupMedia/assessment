"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/data/categories"
import { sampleResults } from "@/data/sample-results"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function PreviewResults() {
  // For the preview, we'll only show the first 10 categories in the radar chart
  // to keep it readable
  const topCategories = categories.slice(0, 10)

  // Prepare data for radar chart
  const chartData = topCategories.map((category) => ({
    category: category.title.split(" ")[0], // Just use the first word to keep it concise
    value: sampleResults[category.id].score,
    fullMark: 5,
  }))

  // Calculate overall score
  const totalScore = Object.values(sampleResults).reduce((sum, result) => sum + result.score, 0)
  const averageScore = totalScore / categories.length
  // Convert to score out of 10
  const scoreOutOfTen = (averageScore * 2).toFixed(1)

  // Get weak areas (score <= 2)
  const weakAreas = categories
    .filter((category) => sampleResults[category.id].score <= 2)
    .sort((a, b) => sampleResults[a.id].score - sampleResults[b.id].score)

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

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      <Card className="w-full shadow-lg border-primary/20 bg-card">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start">
          <div>
            <CardTitle className="text-xl">Sample Assessment Results</CardTitle>
            <div className="mt-2 inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium">
              {weakAreas.length} Areas Need Work
            </div>
          </div>
          <Button
            className="mt-4 sm:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground text-xs flex items-center"
            onClick={() => {}}
            disabled={true}
          >
            <Download className="mr-1 h-3 w-3" />
            Download PDF Report
          </Button>
        </CardHeader>
        <CardContent>
          {/* Top section with score and chart */}
          <div className="flex flex-col md:flex-row">
            {/* Left side - Big score */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 border rounded-lg bg-muted mb-4 md:mb-0 md:mr-4">
              <h3 className="text-lg font-medium mb-2">Overall Business Score</h3>
              <div className="relative">
                <div className="text-6xl font-bold text-center mb-2">
                  <span className={getScoreColor(averageScore)}>{scoreOutOfTen}</span>
                  <span className="text-muted-foreground text-2xl">/10</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Based on assessment across 23 categories</p>
            </div>

            {/* Right side - Radar chart */}
            <div className="flex-1 border rounded-lg bg-muted p-3">
              <h3 className="text-base font-medium mb-1 text-center">Top 10 Categories</h3>
              <div className="h-[200px]">
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
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 8, fill: "rgba(255, 255, 255, 0.8)" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "rgba(255, 255, 255, 0.8)" }} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="var(--color-value)"
                        fill="var(--color-value)"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>

          {/* Bottom section with areas needing improvement */}
          <div className="border rounded-lg bg-muted p-3 mt-4">
            <h3 className="text-base font-medium mb-2">Areas Needing Improvement</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {weakAreas.slice(0, 4).map((category) => (
                <div
                  key={category.id}
                  className={`p-2 rounded-lg border ${getCategoryCardClass(sampleResults[category.id].score)}`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">{category.title}</h4>
                    <span className={`font-bold text-sm ${getScoreColor(sampleResults[category.id].score)}`}>
                      {sampleResults[category.id].score}/5
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample recommendations */}
          <div className="mt-4 border rounded-lg bg-muted p-3">
            <h3 className="text-base font-medium mb-2">Sample Recommendations</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="border rounded-lg overflow-hidden bg-card">
                <div className="bg-primary/20 p-2">
                  <h4 className="font-medium text-sm">Merchandise & Pro Shop System</h4>
                  <p className="text-xs text-muted-foreground">Turn your pro shop into a significant profit center</p>
                </div>
                <div className="p-2 flex justify-between items-center">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                    Guide
                  </span>
                  <button className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Access</button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden bg-card">
                <div className="bg-primary/20 p-2">
                  <h4 className="font-medium text-sm">Mentorship Program Blueprint</h4>
                  <p className="text-xs text-muted-foreground">Build a system that improves retention and community</p>
                </div>
                <div className="p-2 flex justify-between items-center">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                    Video
                  </span>
                  <button className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Access</button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
