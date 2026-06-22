'use client'; 
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; 

export function useFilters() { 
    const router = useRouter(); 
    const pathname = usePathname(); 
    const searchParams = useSearchParams(); 
    
    const getFilter = (key) => searchParams.get(key) || ''; 
    const setFilter = (key, value) => { 
        const params = new URLSearchParams(searchParams.toString()); 
        if (value) { 
            params.set(key, value); 
        } else { 
            params.delete(key); 
        } 
        router.push(`${pathname}?${params.toString()}`); 
    }; 
    
    const clearFilters = () => router.push(pathname); 
    
    return { getFilter, setFilter, clearFilters }; 
}