# Sistema de Agência de Turismo

Trabalho acadêmico de Banco de Dados II envolvendo:

- Modelagem de Entidade Relacional do domínio;
- Implementação da Modelagem no SGDB postgresql;
- Utilizaçaõ prática de procedures, triggers, views e functions;
- Implementação de uma interface do sistema para manipulação CRUD.


> **Atenção:** O sistema que será apresentado é de nível acadêmico com objetivo de fixar os conhecimentos de banco de dados.

# Contexto

Uma agência de turismo é responsável pela assistência ao turista e prestação de serviço para a organização dos itinerários. Esse tipo de negócio exige atendimento personalizado e alta complexidade se for feito de forma manual, uma vez que que apresenta os seguintes desafios:

- **Falta de atualização em tempo real:** Leva à venda duplicada do mesmo quarto ou assento.
- **Perda de margem de lucro:** Por não acompanhar as flutuações rápidas de preços de hotéis e companhias aéreas.
- **Descontrole Financeiro:** Esquecimento de cobranças de clientes, atrasos em pagamentos de fornecedores e falhas críticas no fluxo de caixa.
- **Redundância Operacional:** Redigitação manual de dados de clientes, fornecedores e voos em planilhas isoladas ou papéis.
- **Descentralização de Catálogo:** Serviços de fornecedores espalhados, sem centralizar um catálogo disponível. Além disso, a procura de serviços em determinados locais fica extremamente complexa e lenta.
- **Iniciativa Logística Manual:** Demanda de horas para formatar e enviar roteiros que um sistema automatizado geraria em segundos.
- **Riscos Jurídicos:** Maior chance de esquecer de informar o cliente sobre vistos, vacinas ou regras de bagagem, gerando processos judiciais.
- **Inexistência de CRM:** Impossibilidade de fazer um pós-venda eficiente ou lembrar do histórico de preferências do viajante.
- **Gargalo de Escalar o Negócio:** O volume de vendas fica severamente limitado pela quantidade de braços e horas disponíveis na equipe.

# Escopo

O sistema proposto tem como objetivo reduzir processos manuais, aumentar a produtividade e garantir rastrabilidade para cada venda ofertada. Diante desse cenário, o escopo delimita:

- Cadastros de clientes potenciais e fornecedores.
- Registro do catálogo de serviços que agência conhece.
- Permitirá a criação de pacotes.
- Permitir a negociação de uma reserva de viagem, adicionando os serviços, pacotes e ofertando diferentes fornecedores para o cliente.
- Possibilitar a montagem de um cronograma chamado itinerário de viagem para o cliente saber o que fazer e agência ter o registro formal do ocorrido.

### O que é:

- **Gestão de identidade - CRM:**
    - Cadastros estruturados de clientes potenciais, preferências de consumo e gerenciamento de fornecedores parceiros através de relacionamento estruturado entre entidades.

- **Catálogo Dinâmico de Serviços:**
    - Registro unificado do catálogo de serviços que a agência conhece, mapeados geograficamente por pontos de interesse locais.

- **Motor de Vendas e Reservas**: negociação, disponibilidade e preço
    - Permitir a negociação de uma reserva de viagem, adicionando itens vendidos, calculando margens de lucro imediatas e vinculando múltiplos fornecedores para o cliente sob o mesmo contrato de reserva.

- **Geração de Itinerário**:
    - Possibilitar a montagem de um cronograma passo a passo detalhado para o cliente saber exatamente o que fazer, garantindo que o itinerário fique amarrado diretamente à venda executada

### O que não é:

- Não disponibiliza templates de itinerários para ser reutilizado em outras viagens
- **O serviço não representa o gerenciamento de inventário interno de terceiros:** A tabela de serviços não controla a disponibilidade de assentos de aeronaves, status de limpeza de quartos de hotel ou frotas de veículos. O serviço funciona puramente como uma âncora conceitual geográfica no catálogo da agência. Toda a especificidade do produto e a origem dos dados ficam isoladas nas ofertas dos fornecedores, evitando o `*scope creep*` e mantendo o foco estrito na gestão do fluxo de vendas e organização de itinerários da agência.

### Conclusão

Em suma o objetivo é o controle estruturado sobre o ciclo completo de uma viagem vendida ou planejada por uma agência, reduzindo erro humano e centralizando informações dispersas.

# Modelagem

A seguir a modelagem lógica do sistema:

[modelagem_agencia_de_turismo.pdf](https://github.com/user-attachments/files/28725455/document.pdf)

