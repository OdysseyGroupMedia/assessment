import jsPDF from "jspdf"
import type { AssessmentResult } from "@/types/assessment"
import { categories } from "@/data/categories"

export async function generatePDF(
  results: AssessmentResult,
  userInfo: { name: string; email: string; phone: string } | null,
) {
  try {
    // Calculate overall score
    const totalScore = Object.values(results).reduce((sum, result) => sum + result.score, 0)
    const averageScore = totalScore / categories.length
    const scoreOutOfTen = (averageScore * 2).toFixed(1)

    // Get weak areas (score <= 3)
    const weakAreas = categories
      .filter((category) => results[category.id].score <= 3)
      .sort((a, b) => results[a.id].score - results[b.id].score)

    // Get strong areas (score >= 4)
    const strongAreas = categories
      .filter((category) => results[category.id].score >= 4)
      .sort((a, b) => results[b.id].score - results[a.id].score)

    // Create PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // A4 dimensions: 210mm x 297mm
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15 // margin in mm
    const contentWidth = pageWidth - 2 * margin

    // Fresh color palette
    const colors = {
      primary: "#00ACC1", // Teal/turquoise - primary brand color
      secondary: "#F9A825", // Amber - secondary color
      success: "#26A69A", // Teal green - for good scores
      warning: "#FF7043", // Deep orange - for average scores
      danger: "#EF5350", // Red - for poor scores
      text: "#37474F", // Blue grey - main text
      lightText: "#78909C", // Lighter blue grey - secondary text
      border: "#E0E0E0", // Light grey - borders
      background: "#FFFFFF", // White - backgrounds
      lightBackground: "#FAFAFA", // Off-white - secondary backgrounds
    }

    // Helper function to add text with automatic wrapping
    const addWrappedText = (text, x, y, maxWidth, lineHeight, align = "left") => {
      const lines = pdf.splitTextToSize(text, maxWidth)
      for (let i = 0; i < lines.length; i++) {
        if (align === "center") {
          pdf.text(lines[i], x + maxWidth / 2, y + i * lineHeight, { align: "center" })
        } else if (align === "right") {
          pdf.text(lines[i], x + maxWidth, y + i * lineHeight, { align: "right" })
        } else {
          pdf.text(lines[i], x, y + i * lineHeight)
        }
      }
      return y + lines.length * lineHeight
    }

    // Helper function to add a status text
    const addStatusText = (text, x, y, type) => {
      let color
      switch (type) {
        case "success":
          color = colors.success
          break
        case "warning":
          color = colors.warning
          break
        case "danger":
          color = colors.danger
          break
        default:
          color = colors.primary
      }

      pdf.setTextColor(color)
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      pdf.text(text, x, y, { align: "center" })

      // Reset text color
      pdf.setTextColor(colors.text)
      pdf.setFont("helvetica", "normal")
    }

    // Helper function to check if we need a new page
    const checkForNewPage = (currentY, neededSpace) => {
      if (currentY + neededSpace > pageHeight - margin) {
        pdf.addPage()
        return margin + 10 // Reset Y position with a small top margin
      }
      return currentY
    }

    // Start building the PDF
    let currentY = margin

    // Set default text color
    pdf.setTextColor(colors.text)

    // Header
    pdf.setDrawColor(colors.primary)
    pdf.setLineWidth(0.5)
    pdf.line(margin, currentY + 15, pageWidth - margin, currentY + 15)

    pdf.setFontSize(20)
    pdf.setTextColor(colors.primary)
    pdf.setFont("helvetica", "bold")
    pdf.text("Martial Arts Business Assessment", margin, currentY + 10)

    pdf.setFontSize(12)
    pdf.setTextColor(colors.lightText)
    pdf.setFont("helvetica", "normal")
    pdf.text("Comprehensive Business Evaluation", margin, currentY + 20)

    pdf.setFontSize(10)
    pdf.setTextColor(colors.text)
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, currentY + 10, { align: "right" })
    if (userInfo) {
      pdf.text(`Prepared for: ${userInfo.name}`, pageWidth - margin, currentY + 20, { align: "right" })
    }

    currentY += 30

    // Overall Score Section
    const scoreCardWidth = contentWidth * 0.48
    const scoreCardHeight = 60

    // Score Card - Clean white background with subtle border
    pdf.setFillColor(colors.background)
    pdf.setDrawColor(colors.border)
    pdf.roundedRect(margin, currentY, scoreCardWidth, scoreCardHeight, 3, 3, "FD")

    pdf.setFontSize(14)
    pdf.setTextColor(colors.primary)
    pdf.setFont("helvetica", "bold")
    pdf.text("Overall Business Score", margin + scoreCardWidth / 2, currentY + 10, { align: "center" })

    // Score value - positioned independently
    pdf.setFontSize(36)
    // Set color based on score
    if (averageScore >= 4) {
      pdf.setTextColor(colors.success)
    } else if (averageScore >= 2) {
      pdf.setTextColor(colors.warning)
    } else {
      pdf.setTextColor(colors.danger)
    }

    // Calculate center position for the score
    const scoreCenter = margin + scoreCardWidth / 2
    const scoreWidth = pdf.getTextWidth(scoreOutOfTen)
    const denomWidth = pdf.getTextWidth("/10")

    // Position score and denominator with proper spacing
    pdf.text(scoreOutOfTen, scoreCenter - denomWidth / 2, currentY + 35, { align: "right" })

    pdf.setFontSize(16)
    pdf.setTextColor(colors.lightText)
    pdf.text("/10", scoreCenter + scoreWidth / 2 - denomWidth / 2 + 2, currentY + 35, { align: "left" })

    pdf.setFontSize(9)
    pdf.setTextColor(colors.lightText)
    pdf.setFont("helvetica", "normal")
    pdf.text(
      `Based on assessment across ${categories.length} business categories`,
      margin + scoreCardWidth / 2,
      currentY + 45,
      { align: "center" },
    )

    // Status text
    pdf.setFontSize(10)
    pdf.setTextColor(weakAreas.length > 0 ? colors.warning : colors.success)
    pdf.setFont("helvetica", "bold")
    pdf.text(
      weakAreas.length > 0 ? `${weakAreas.length} Areas Need Work` : "All Areas Strong",
      margin + scoreCardWidth / 2,
      currentY + 55,
      { align: "center" },
    )
    pdf.setTextColor(colors.text)
    pdf.setFont("helvetica", "normal")

    // Summary Stats - Clean design
    const summaryX = margin + scoreCardWidth + 10
    const summaryWidth = contentWidth * 0.48

    pdf.setFillColor(colors.background)
    pdf.setDrawColor(colors.border)
    pdf.roundedRect(summaryX, currentY, summaryWidth, scoreCardHeight, 3, 3, "FD")

    pdf.setFontSize(14)
    pdf.setTextColor(colors.primary)
    pdf.setFont("helvetica", "bold")
    pdf.text("Assessment Summary", summaryX + summaryWidth / 2, currentY + 10, { align: "center" })

    // Simplified layout with better spacing
    // Calculate positions for the 4 stat boxes
    const boxWidth = summaryWidth * 0.42
    const boxHeight = 18
    const boxSpacingX = (summaryWidth - boxWidth * 2) / 3
    const boxSpacingY = 6

    // Top left - Categories Assessed
    const box1X = summaryX + boxSpacingX
    const box1Y = currentY + 18

    // Top right - Areas Needing Improvement
    const box2X = box1X + boxWidth + boxSpacingX
    const box2Y = box1Y

    // Bottom left - Strong Areas
    const box3X = box1X
    const box3Y = box1Y + boxHeight + boxSpacingY

    // Bottom right - Average Areas
    const box4X = box2X
    const box4Y = box3Y

    // Categories Assessed - Clean white with subtle border
    pdf.setDrawColor(colors.border)
    pdf.roundedRect(box1X, box1Y, boxWidth, boxHeight, 2, 2, "D")

    pdf.setFontSize(14)
    pdf.setTextColor(colors.primary)
    pdf.setFont("helvetica", "bold")
    pdf.text(categories.length.toString(), box1X + boxWidth / 2, box1Y + 10, { align: "center" })

    pdf.setFontSize(8)
    pdf.setTextColor(colors.lightText)
    pdf.setFont("helvetica", "normal")
    pdf.text("Categories Assessed", box1X + boxWidth / 2, box1Y + 16, { align: "center" })

    // Areas Needing Improvement - Clean white with subtle border
    pdf.setDrawColor(colors.border)
    pdf.roundedRect(box2X, box2Y, boxWidth, boxHeight, 2, 2, "D")

    pdf.setFontSize(14)
    pdf.setTextColor(colors.danger)
    pdf.setFont("helvetica", "bold")
    pdf.text(weakAreas.length.toString(), box2X + boxWidth / 2, box2Y + 10, { align: "center" })

    pdf.setFontSize(8)
    pdf.setTextColor(colors.lightText)
    pdf.setFont("helvetica", "normal")
    pdf.text("Areas Needing Improvement", box2X + boxWidth / 2, box2Y + 16, { align: "center" })

    // Strong Areas - Clean white with subtle border
    pdf.setDrawColor(colors.border)
    pdf.roundedRect(box3X, box3Y, boxWidth, boxHeight, 2, 2, "D")

    pdf.setFontSize(14)
    pdf.setTextColor(colors.success)
    pdf.setFont("helvetica", "bold")
    pdf.text(strongAreas.length.toString(), box3X + boxWidth / 2, box3Y + 10, { align: "center" })

    pdf.setFontSize(8)
    pdf.setTextColor(colors.lightText)
    pdf.setFont("helvetica", "normal")
    pdf.text("Strong Areas", box3X + boxWidth / 2, box3Y + 16, { align: "center" })

    // Average Areas - Clean white with subtle border
    const averageAreas = categories.length - weakAreas.length - strongAreas.length

    pdf.setDrawColor(colors.border)
    pdf.roundedRect(box4X, box4Y, boxWidth, boxHeight, 2, 2, "D")

    pdf.setFontSize(14)
    pdf.setTextColor(colors.warning)
    pdf.setFont("helvetica", "bold")
    pdf.text(averageAreas.toString(), box4X + boxWidth / 2, box4Y + 10, { align: "center" })

    pdf.setFontSize(8)
    pdf.setTextColor(colors.lightText)
    pdf.setFont("helvetica", "normal")
    pdf.text("Average Areas", box4X + boxWidth / 2, box4Y + 16, { align: "center" })

    currentY += scoreCardHeight + 20

    // Areas Needing Improvement Section
    currentY = checkForNewPage(currentY, 20) // Check if we need a new page

    pdf.setFontSize(16)
    pdf.setTextColor(colors.primary)
    pdf.setFont("helvetica", "bold")
    pdf.text("Areas Needing Improvement", margin, currentY)

    pdf.setDrawColor(colors.primary)
    pdf.setLineWidth(0.5)
    pdf.line(margin, currentY + 5, pageWidth - margin, currentY + 5)

    currentY += 15

    if (weakAreas.length > 0) {
      // Calculate how many areas to show per row and how many rows
      const areasPerRow = 2
      const cardWidth = contentWidth / areasPerRow - 5
      const cardHeight = 50
      const rows = Math.ceil(Math.min(weakAreas.length, 6) / areasPerRow)

      for (let row = 0; row < rows; row++) {
        currentY = checkForNewPage(currentY, cardHeight + 10)

        for (let col = 0; col < areasPerRow; col++) {
          const index = row * areasPerRow + col
          if (index < weakAreas.length && index < 6) {
            // Limit to 6 areas
            const category = weakAreas[index]
            const x = margin + col * (cardWidth + 10)

            // Card background - clean white
            pdf.setFillColor(colors.background)
            pdf.setDrawColor(colors.border)
            pdf.roundedRect(x, currentY, cardWidth, cardHeight, 3, 3, "FD")

            // Category title and score
            pdf.setFontSize(12)
            pdf.setTextColor(colors.text)
            pdf.setFont("helvetica", "bold")
            pdf.text(category.title, x + 5, currentY + 10)

            // Score text
            const score = results[category.id].score
            pdf.setTextColor(score >= 3 ? colors.warning : score >= 2 ? colors.warning : colors.danger)
            pdf.setFontSize(10)
            pdf.text(`${score}/5`, x + cardWidth - 15, currentY + 10, { align: "center" })
            pdf.setTextColor(colors.text)

            // Description
            pdf.setFontSize(9)
            pdf.setTextColor(colors.lightText)
            pdf.setFont("helvetica", "normal")
            const descY = addWrappedText(category.description, x + 5, currentY + 20, cardWidth - 10, 4)

            // Missing elements
            const missingCount = category.checklistItems.filter(
              (item) => !results[category.id].checkedItems.includes(item.id),
            ).length

            pdf.setFillColor(colors.lightBackground)
            pdf.roundedRect(x + 5, descY + 2, cardWidth - 10, 12, 2, 2, "F")

            pdf.setFontSize(8)
            pdf.setFont("helvetica", "bold")
            pdf.setTextColor(colors.text)
            pdf.text("Missing elements:", x + 8, descY + 8)

            pdf.setFont("helvetica", "normal")
            pdf.text(`${missingCount} of ${category.checklistItems.length}`, x + 45, descY + 8)
          }
        }

        currentY += cardHeight + 10
      }
    } else {
      pdf.setFillColor(colors.lightBackground)
      pdf.roundedRect(margin, currentY, contentWidth, 20, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setTextColor(colors.success)
      pdf.setFont("helvetica", "bold")
      pdf.text("Great job! You've rated yourself highly in all areas.", margin + contentWidth / 2, currentY + 12, {
        align: "center",
      })

      currentY += 30
    }

    // Strengths Section
    currentY = checkForNewPage(currentY, 20)

    pdf.setFontSize(16)
    pdf.setTextColor(colors.success)
    pdf.setFont("helvetica", "bold")
    pdf.text("Your Strengths", margin, currentY)

    pdf.setDrawColor(colors.success)
    pdf.setLineWidth(0.5)
    pdf.line(margin, currentY + 5, pageWidth - margin, currentY + 5)

    currentY += 15

    if (strongAreas.length > 0) {
      // Calculate how many areas to show per row and how many rows
      const areasPerRow = 2
      const cardWidth = contentWidth / areasPerRow - 5
      const cardHeight = 40
      const rows = Math.ceil(Math.min(strongAreas.length, 6) / areasPerRow)

      for (let row = 0; row < rows; row++) {
        currentY = checkForNewPage(currentY, cardHeight + 10)

        for (let col = 0; col < areasPerRow; col++) {
          const index = row * areasPerRow + col
          if (index < strongAreas.length && index < 6) {
            // Limit to 6 areas
            const category = strongAreas[index]
            const x = margin + col * (cardWidth + 10)

            // Card background - clean white
            pdf.setFillColor(colors.background)
            pdf.setDrawColor(colors.border)
            pdf.roundedRect(x, currentY, cardWidth, cardHeight, 3, 3, "FD")

            // Category title and score
            pdf.setFontSize(12)
            pdf.setTextColor(colors.text)
            pdf.setFont("helvetica", "bold")
            pdf.text(category.title, x + 5, currentY + 10)

            // Score text
            pdf.setTextColor(colors.success)
            pdf.setFontSize(10)
            pdf.text(`${results[category.id].score}/5`, x + cardWidth - 15, currentY + 10, { align: "center" })
            pdf.setTextColor(colors.text)

            // Description
            pdf.setFontSize(9)
            pdf.setTextColor(colors.lightText)
            pdf.setFont("helvetica", "normal")
            addWrappedText(category.description, x + 5, currentY + 20, cardWidth - 10, 4)
          }
        }

        currentY += cardHeight + 10
      }
    } else {
      pdf.setFillColor(colors.lightBackground)
      pdf.roundedRect(margin, currentY, contentWidth, 20, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setTextColor(colors.danger)
      pdf.setFont("helvetica", "bold")
      pdf.text(
        "You have opportunities to improve in all areas of your business.",
        margin + contentWidth / 2,
        currentY + 12,
        { align: "center" },
      )

      currentY += 30
    }

    // Complete Category Breakdown
    currentY = checkForNewPage(currentY, 20)

    pdf.setFontSize(16)
    pdf.setTextColor(colors.text)
    pdf.setFont("helvetica", "bold")
    pdf.text("Complete Category Breakdown", margin, currentY)

    pdf.setDrawColor(colors.text)
    pdf.setLineWidth(0.5)
    pdf.line(margin, currentY + 5, pageWidth - margin, currentY + 5)

    currentY += 15

    // Table header
    currentY = checkForNewPage(currentY, 10)

    const colWidths = [contentWidth * 0.5, contentWidth * 0.15, contentWidth * 0.15, contentWidth * 0.2]
    const colStarts = [
      margin,
      margin + colWidths[0],
      margin + colWidths[0] + colWidths[1],
      margin + colWidths[0] + colWidths[1] + colWidths[2],
    ]

    pdf.setFillColor(colors.lightBackground)
    pdf.rect(margin, currentY, contentWidth, 10, "F")

    pdf.setFontSize(10)
    pdf.setTextColor(colors.text)
    pdf.setFont("helvetica", "bold")

    pdf.text("Category", colStarts[0] + 2, currentY + 7)
    pdf.text("Score", colStarts[1] + colWidths[1] / 2, currentY + 7, { align: "center" })
    pdf.text("Checklist", colStarts[2] + colWidths[2] / 2, currentY + 7, { align: "center" })
    pdf.text("Status", colStarts[3] + colWidths[3] / 2, currentY + 7, { align: "center" })

    currentY += 10

    // Table rows
    for (let i = 0; i < categories.length; i++) {
      currentY = checkForNewPage(currentY, 10)

      const category = categories[i]
      const score = results[category.id].score
      const checkedCount = results[category.id].checkedItems.length
      const totalItems = category.checklistItems.length

      // Alternating row background
      if (i % 2 === 0) {
        pdf.setFillColor(colors.background)
      } else {
        pdf.setFillColor(colors.lightBackground)
      }
      pdf.rect(margin, currentY, contentWidth, 10, "F")

      // Category name
      pdf.setFontSize(9)
      pdf.setTextColor(colors.text)
      pdf.setFont("helvetica", "normal")

      // Truncate long category names if needed
      let categoryTitle = category.title
      if (pdf.getTextWidth(categoryTitle) > colWidths[0] - 4) {
        while (pdf.getTextWidth(categoryTitle + "...") > colWidths[0] - 4 && categoryTitle.length > 0) {
          categoryTitle = categoryTitle.slice(0, -1)
        }
        categoryTitle += "..."
      }

      pdf.text(categoryTitle, colStarts[0] + 2, currentY + 7)

      // Score
      if (score >= 4) {
        pdf.setTextColor(colors.success)
      } else if (score >= 2) {
        pdf.setTextColor(colors.warning)
      } else {
        pdf.setTextColor(colors.danger)
      }
      pdf.setFont("helvetica", "bold")
      pdf.text(`${score}/5`, colStarts[1] + colWidths[1] / 2, currentY + 7, { align: "center" })

      // Checklist items
      pdf.setTextColor(colors.text)
      pdf.setFont("helvetica", "normal")
      pdf.text(`${checkedCount}/${totalItems}`, colStarts[2] + colWidths[2] / 2, currentY + 7, { align: "center" })

      // Status text
      const status = score >= 4 ? "Strong" : score >= 2 ? "Average" : "Needs Work"
      if (score >= 4) {
        pdf.setTextColor(colors.success)
      } else if (score >= 2) {
        pdf.setTextColor(colors.warning)
      } else {
        pdf.setTextColor(colors.danger)
      }
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      pdf.text(status, colStarts[3] + colWidths[3] / 2, currentY + 7, { align: "center" })
      pdf.setTextColor(colors.text)
      pdf.setFont("helvetica", "normal")

      currentY += 10
    }

    // Next Steps Section
    currentY = checkForNewPage(currentY, 80)

    pdf.setFillColor(colors.lightBackground)
    pdf.setDrawColor(colors.border)
    pdf.roundedRect(margin, currentY, contentWidth, 70, 3, 3, "FD")

    pdf.setFontSize(14)
    pdf.setTextColor(colors.primary)
    pdf.setFont("helvetica", "bold")
    pdf.text("Recommended Next Steps", margin + 10, currentY + 10)

    pdf.setFontSize(10)
    pdf.setTextColor(colors.text)
    pdf.setFont("helvetica", "normal")

    const steps = [
      "Focus on improving your lowest-scoring areas first",
      "Implement the missing checklist items in each category",
      "Schedule a follow-up assessment in 90 days to track progress",
      "Consider booking a consultation to get personalized advice",
      "Explore our resources designed specifically for martial arts school owners",
    ]

    for (let i = 0; i < steps.length; i++) {
      pdf.text(`${i + 1}. ${steps[i]}`, margin + 10, currentY + 25 + i * 8)
    }

    currentY += 80

    // Footer
    // Always add the footer on the last page
    pdf.setFontSize(9)
    pdf.setTextColor(colors.lightText)
    pdf.setFont("helvetica", "normal")

    pdf.text(
      "This assessment was created to help martial arts school owners identify and close gaps in their business operations.",
      pageWidth / 2,
      pageHeight - 25,
      { align: "center" },
    )
    pdf.text("For more information and resources, contact The Odyssey Group.", pageWidth / 2, pageHeight - 20, {
      align: "center",
    })
    pdf.text("© 2025 The Odyssey Group. All rights reserved.", pageWidth / 2, pageHeight - 15, { align: "center" })

    // Download the PDF
    const userName = userInfo?.name ? userInfo.name.replace(/\s+/g, "_") : "user"
    pdf.save(`Martial_Arts_Business_Assessment_${userName}_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`)

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    return false
  }
}
