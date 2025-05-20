"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { PreviewResults } from "./preview-results"
import { Eye } from "lucide-react"

export function PreviewDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outline" className="hover:bg-muted hover:text-foreground" onClick={() => setIsOpen(true)}>
        <Eye className="mr-2 h-4 w-4" />
        Assessment Preview
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Assessment Preview"
        description="This is what your assessment results will look like after completion."
      >
        <PreviewResults />
      </Modal>
    </>
  )
}
