import type { AssessmentResult } from "@/types/assessment"

// Sample assessment results for the preview
export const sampleResults: AssessmentResult = {
  "lead-generation": {
    score: 3,
    checkedItems: ["lead-gen-1", "lead-gen-3", "lead-gen-5"],
  },
  "lead-nurturing": {
    score: 2,
    checkedItems: ["lead-nurture-1", "lead-nurture-4"],
  },
  sales: {
    score: 4,
    checkedItems: ["sales-1", "sales-2", "sales-3", "sales-4"],
  },
  "trial-class": {
    score: 3,
    checkedItems: ["trial-1", "trial-3", "trial-4"],
  },
  onboarding: {
    score: 4,
    checkedItems: ["onboarding-1", "onboarding-2", "onboarding-3", "onboarding-4"],
  },
  mentorship: {
    score: 2,
    checkedItems: ["mentorship-1", "mentorship-3"],
  },
  "crm-systems": {
    score: 3,
    checkedItems: ["crm-1", "crm-2", "crm-4"],
  },
  "funnels-automations": {
    score: 2,
    checkedItems: ["funnels-1", "funnels-2"],
  },
  "business-strategy": {
    score: 3,
    checkedItems: ["strategy-1", "strategy-2", "strategy-5"],
  },
  "staff-meetings": {
    score: 4,
    checkedItems: ["meetings-1", "meetings-2", "meetings-3", "meetings-4"],
  },
  "goal-setting": {
    score: 2,
    checkedItems: ["goals-1", "goals-2"],
  },
  retention: {
    score: 3,
    checkedItems: ["retention-1", "retention-3", "retention-4"],
  },
  curriculum: {
    score: 5,
    checkedItems: ["curriculum-1", "curriculum-2", "curriculum-3", "curriculum-4", "curriculum-5"],
  },
  "instructor-development": {
    score: 3,
    checkedItems: ["instructor-1", "instructor-2", "instructor-5"],
  },
  "parent-communication": {
    score: 4,
    checkedItems: ["parent-1", "parent-2", "parent-3", "parent-5"],
  },
  "community-engagement": {
    score: 2,
    checkedItems: ["community-1", "community-4"],
  },
  "event-planning": {
    score: 3,
    checkedItems: ["events-1", "events-2", "events-4"],
  },
  merchandise: {
    score: 1,
    checkedItems: ["merch-1"],
  },
  "social-media": {
    score: 3,
    checkedItems: ["social-1", "social-3", "social-4"],
  },
  "website-seo": {
    score: 2,
    checkedItems: ["website-1", "website-2"],
  },
  "financial-management": {
    score: 4,
    checkedItems: ["finance-1", "finance-2", "finance-3", "finance-4"],
  },
  "legal-compliance": {
    score: 3,
    checkedItems: ["legal-1", "legal-2", "legal-4"],
  },
  "facility-maintenance": {
    score: 5,
    checkedItems: ["facility-1", "facility-2", "facility-3", "facility-4", "facility-5"],
  },
}

// Sample user info for the preview
export const sampleUserInfo = {
  name: "John Smith",
  email: "john@dojoexample.com",
  phone: "(555) 123-4567",
}
