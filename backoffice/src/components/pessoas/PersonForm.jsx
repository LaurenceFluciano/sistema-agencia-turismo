'use client'
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, AlertCircle } from "lucide-react"
import {
  Alert,
} from "@/components/ui/alert"
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
import { Button } from "../ui/button"

import { useState } from "react";

export default function PersonForm({ initialData, tipoPessoa, setTipoPessoa, papel, setPapel, onSubmit, isEditing, error, success }) {
    const [alignItemWithTrigger, setAlignItemWithTrigger] = useState(true)

    return (
        <form onSubmit={onSubmit} key={initialData?.id || "new-client"}>
            <DialogHeader className="px-8 py-4">
                <DialogTitle className="text-2xl font-bold">
                    {isEditing ? "Editar Cliente" : "Cadastrar Cliente"}
                </DialogTitle>
            </DialogHeader>

            {/* Area de Alertas */}
            <div className="px-8 pt-4 space-y-2">
                {error && <Alert variant="destructive">{error}</Alert>}
                {success && <Alert className="border-green-500 text-green-600">{success}</Alert>}
            </div>

            {/* Area dos Campos */}
            <FieldGroup className="px-8 py-4 gap-8 grid md:grid-cols-2">
                <Field>
                    <Label htmlFor="nome">Nome: <span className="text-destructive">*</span></Label>
                    <Input 
                        id="nome" 
                        name="nome" 
                        placeholder="Nome"
                        defaultValue={initialData?.nome || ""}
                        required 
                    />
                </Field>

                <Field>
                    <Label htmlFor="email">Email:</Label>
                    <Input 
                        id="email" 
                        name="email" 
                        placeholder="Email"
                        defaultValue={initialData?.email || ""} 
                        type="email"
                    />
                </Field>

                <Field>
                    <Label htmlFor="telefone">Telefone:</Label>
                    <Input 
                        id="telefone" 
                        name="telefone" 
                        defaultValue={initialData?.telefone || ""}
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

                <Field>
                    <Label htmlFor="papel">Papel:</Label>
                    <Select value={papel} onValueChange={setPapel}>
                        <SelectTrigger id="papel">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            position={alignItemWithTrigger ? "item-aligned" : "popper"}
                        >
                            <SelectGroup>
                                <SelectItem value="1">Cliente</SelectItem>
                                <SelectItem value="2">Fornecedor</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <Field className={tipoPessoa === 'F' ? '' : 'hidden'}>
                    <Label htmlFor="cpf">CPF:</Label>
                    <Input id="cpf" name="cpf" placeholder="CPF" defaultValue={initialData?.cpf || ""} />
                </Field>

                <Field className={tipoPessoa === 'J' ? '' : 'hidden'}>
                    <Label htmlFor="cnpj">CNPJ:</Label>
                    <Input id="cnpj" name="cnpj" placeholder="CNPJ" defaultValue={initialData?.cnpj || ""} />
                </Field>

                <Field className={tipoPessoa === 'J' ? '' : 'hidden'}>
                    <Label htmlFor="razao_social">Razão Social:</Label>
                    <Input id="razao_social" name="razao_social" placeholder="Razão Social" defaultValue={initialData?.razao_social || ""} />
                </Field>
        
            </FieldGroup>

            <DialogFooter className="mt-8 px-8">
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <Button type="submit">{isEditing ? "Salvar Alterações" : "Cadastrar"}</Button>
            </DialogFooter>
        </form>
    );
}