import { AssessmentProvider } from "@/context/assessment-context"
import { AssessmentWizard } from "@/components/assessment-wizard"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <AssessmentProvider>
        <AssessmentWizard />
      </AssessmentProvider>
    </main>
  )
}
