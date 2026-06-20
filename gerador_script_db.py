import os

def gerar_scripts(pasta, nome_up, nome_down):
    arquivos = sorted(os.listdir(pasta))
    
    arquivos_up = [f for f in arquivos if f.endswith('.up.sql')]
    arquivos_down = sorted([f for f in arquivos if f.endswith('.down.sql')], reverse=True)

    def escrever_arquivo(lista_arquivos, nome_saida, ignorar_alter=False):
        with open(nome_saida, 'w', encoding='utf-8') as outfile:
            for nome_arquivo in lista_arquivos:
                caminho = os.path.join(pasta, nome_arquivo)
                with open(caminho, 'r', encoding='utf-8') as infile:
                    outfile.write(f"-- Início: {nome_arquivo}\n")
                    for linha in infile:
                        if ignorar_alter and linha.strip().upper().startswith("ALTER TABLE"):
                            continue
                        outfile.write(linha)
                    outfile.write("\n")
        print(f"Gerado: {nome_saida}")

    escrever_arquivo(arquivos_up, nome_up, ignorar_alter=False)
    escrever_arquivo(arquivos_down, nome_down, ignorar_alter=True)

if __name__ == "__main__":
    gerar_scripts('database', 'banco_agencia.up.sql', 'banco_agencia.down.sql')



    