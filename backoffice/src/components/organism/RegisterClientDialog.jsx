'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"


export default function RegisterClientDialog({ className }) {
    const [alignItemWithTrigger, setAlignItemWithTrigger] = useState(true)


    const [clientData, setClientData] = useState({})


    return (
        <Dialog>
            <form className={className}>
                <DialogTrigger asChild>
                    <Button variant="outline">Cadastrar Cliente</Button>
                </DialogTrigger>

                <DialogContent className="md:max-w-180 max-w-sm">
                    <DialogHeader className="px-8 py-4">
                        <DialogTitle className="text-2xl font-bold">Cadastrar Cliente</DialogTitle>
                    </DialogHeader>
                    <FieldGroup className="px-8 py-4 gap-8 grid md:grid-cols-2">
                        <Field>
                            <Label htmlFor="nome">Nome: <span className="text-destructive">*</span></Label>
                            <Input 
                                id="nome" 
                                name="nome" 
                                placeholder="Nome" 
                                required 
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email:</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                placeholder="Email" 
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="telefone">Telefone:</Label>
                            <Input 
                                id="telefone" 
                                name="telefone" 
                                placeholder="Telefone" 
                            />
                        </Field>
                        <Field>
                            <Label name="pessoa">Pessoa:</Label>
                            <Select defaultValue="F">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent
                                    position={alignItemWithTrigger ? "item-aligned" : "popper"}
                                >
                                    <SelectGroup>
                                        <SelectItem value="F">Física</SelectItem>
                                        <SelectItem value="J">Jurídica</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Cadastrar</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}