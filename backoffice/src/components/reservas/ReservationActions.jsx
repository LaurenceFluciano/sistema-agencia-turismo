'use client'

import { useState } from "react"
import ReservationDialog from "@/components/reservas/ReservationDialog"
import { Button } from "@/components/ui/button"
import ReservationFiltersAction from "./ReservationFiltersAction"

export default function ReservationActions() {
  const [open, setOpen] = useState(false)

  return (
    <>

      <ReservationFiltersAction />
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