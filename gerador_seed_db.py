import os

def gerar_seed_completa(pasta_origem, arquivo_saida):
    if not os.path.exists(pasta_origem):
        print(f"Erro: A pasta '{pasta_origem}' não existe.")
        return

    nome_arquivo_saida = os.path.basename(arquivo_saida)

    arquivos = sorted([f for f in os.listdir(pasta_origem) 
                       if f.endswith('.sql') and f != nome_arquivo_saida])
    
    with open(arquivo_saida, 'w', encoding='utf-8') as outfile:
        for nome_arquivo in arquivos:
            caminho_completo = os.path.join(pasta_origem, nome_arquivo)
            print(f"Adicionando seed: {nome_arquivo}...")
            
            with open(caminho_completo, 'r', encoding='utf-8') as infile:
                outfile.write(f"\n-- Início da Seed: {nome_arquivo}\n")
                outfile.write(infile.read())
                outfile.write("\n")
    
    print(f"\nSucesso! Seed completa gerada em: {arquivo_saida}")

if __name__ == "__main__":
    pasta = 'seed'
    saida = 'seed_completa.sql' 
    gerar_seed_completa(pasta, saida)