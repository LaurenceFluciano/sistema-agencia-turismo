'use client'
import { registerPerson, updatePerson } from "@/services/pessoas/person.repository";
import { Dialog, DialogContent } from "../ui/dialog";
import PersonForm from "./PersonForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PersonDialog({ 
    pessoa = null, 
    open,
    onOpenChange 
}) {
    const isEditing = !!pessoa;
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

    const [tipoPessoa, setTipoPessoa] = useState(pessoa?.tipo || "F");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        data.pessoa = tipoPessoa;
        
        const result = isEditing 
            ? await updatePerson(data, pessoa.id) 
            : await registerPerson(data);

        if(result.success) {
            setSuccess(result.message);
            router.refresh();
        } else {
            setError(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-180 max-w-sm">
               <PersonForm 
                    initialData={pessoa}
                    isEditing={isEditing}
                    onSubmit={handleSubmit}
                    tipoPessoa={tipoPessoa}
                    setTipoPessoa={setTipoPessoa}
                    error={error}
                    success={success}
                />
            </DialogContent>
        </Dialog>
    )
}