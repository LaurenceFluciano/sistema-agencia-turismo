'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { registerClient } from "@/services/clientes/client.repository"
import { CheckCircle2, AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function RegisterClientDialog({ className }) {
    const [alignItemWithTrigger, setAlignItemWithTrigger] = useState(true)
    const [error, setError] = useState(null)
    const [sucess, setSucess] = useState(null)
    
    const [tipoPessoa, setTipoPessoa] = useState("F")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSucess(null)

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        data.pessoa = tipoPessoa;

        const result = await registerClient(data)

        if(result.success) {
            setSucess(result.message)
        } else {
            setError(result.error)
        }
    } 

    return (
        <Dialog>
            <DialogTrigger className={className} asChild>
                <Button variant="outline">Cadastrar Cliente</Button>
            </DialogTrigger>

            <DialogContent className="md:max-w-180 max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="px-8 py-4">
                        <DialogTitle className="text-2xl font-bold">Cadastrar Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="px-8 pt-4 space-y-2">
                        {error && (
                            <Alert variant="destructive" className="w-full">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erro ao cadastrar</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {sucess && (
                            <Alert className="w-full border-green-500 text-green-600 [&>svg]:text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertTitle>Sucesso</AlertTitle>
                                <AlertDescription>{sucess}</AlertDescription>
                            </Alert>
                        )}
                    </div>
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
                            <Label htmlFor="cpf">CPF:</Label>
                            <Input 
                                id="cpf" 
                                name="cpf" 
                                placeholder="CPF"
                                required
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email:</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                placeholder="Email" 
                                type="email"
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
                            <Label htmlFor="pessoa">Pessoa:</Label>
                            <Select value={tipoPessoa} onValueChange={setTipoPessoa}>
                                <SelectTrigger id="pessoa">
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
                            <Button variant="outline" type="button">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Cadastrar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
