'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AssessmentProvider } from "@/context/assessment-context"
import { AssessmentWizard } from "@/components/assessment-wizard"
import Auth from "@/components/Auth"

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <Auth />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <AssessmentProvider>
        <AssessmentWizard />
      </AssessmentProvider>
    </main>
  )
}
