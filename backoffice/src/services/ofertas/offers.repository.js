async function listOffers() {
    const response = await fetch('/api/ofertas', { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`Erro ao carregar ofertas: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.data ?? json.ofertas ?? json.items ?? [];
}



export { listOffers }