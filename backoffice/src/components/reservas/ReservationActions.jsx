'use client'

import { useState } from "react"
import ReservationDialog from "@/components/reservas/ReservationDialog"
import { Button } from "@/components/ui/button"

export default function ReservationActions() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="ml-auto">
        Criar Reserva
      </Button>

      <ReservationDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}