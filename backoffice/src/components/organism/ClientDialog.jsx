'use client'
import { updateClient } from "@/services/clientes/client.repository";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ClientForm from "./ClientForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientDialog({ cliente = null, trigger }) {
    const isEditing = !!cliente;
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

    const [tipoPessoa, setTipoPessoa] = useState(cliente?.tipo || "F");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        data.pessoa = tipoPessoa;
        
        const result = isEditing 
            ? await updateClient(data, cliente.id) 
            : await registerClient(data);

        if(result.success) {
            setSuccess(result.message);
            router.refresh();
        } else {
            setError(result.error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="md:max-w-180 max-w-sm">
               <ClientForm 
                    initialData={cliente}
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