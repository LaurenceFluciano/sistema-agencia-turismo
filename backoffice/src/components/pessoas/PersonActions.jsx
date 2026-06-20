'use client'

import { useState } from "react"
import PersonDialog from "@/components/pessoas/PersonDialog"
import { Button } from "@/components/ui/button"

export default function PersonActions() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="ml-auto">
        Cadastrar
      </Button>

      <PersonDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}