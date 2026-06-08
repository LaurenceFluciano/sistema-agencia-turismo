# Sistema de Agência de Turismo

Trabalho acadêmico de Banco de Dados II envolvendo:

- Modelagem de Entidade Relacional do domínio;
- Implementação da Modelagem no SGDB postgresql;
- Utilizaçaõ prática de procedures, triggers, views e functions;
- Implementação de uma interface do sistema para manipulação CRUD.


# Contexto

O dominio e os problemas que uma agência de turismo tem são extremamente complexos. Normalmente o negócio envolve:

- Gestão de reservas de viagens de cada cliente
- Pesquisar serviços e fornecedores para incluir na viagem
- Negocionar o orçamento com o cliente
- Planjear o itinerário do cliente

O atendimento não se limita apenas a um pacote pronto. O principal desafio da modelagem é garantir consistência e a aplicação de cada serviço.
Inicialmente consideramos um modelo simples, no entanto alguns desafios aparecem:

### 1. O que é de fato uma Viagem?

A viagem era um conceito extremamente abstrato e complexo. Não sabia-se dizer se é uma reserva, pacote, serviço ou histórico.
Logo a modelagem quebrou em tabelas com dados que realmente podem ser gerenciados pela agência.

### 2. Como efetuar Pagamento parcelado?

Nesse cenário precisariamos de um mini sistema financeiro, logo para esse contexto preferimos utilizar apenas uma entidade: `Pagamento`

### 3. Planejamento da viagem ou Roteiro não esta incluso no domínio.

Esse foi um ponto extremamente importante para não gerar confusão. O dominio que se preocupa responsável por se preocupar com o roteiro completo, chamado itinerário da viagem, deve estar separado da parte de gestão dos serviços contratados e reserva efetuada.

### 4. Serviço contratado ≠ Recomendação

Esse é um detalhe sutil, cada serviço que a agencia adiciona como um item da reserva gera algum tipo de lucro para empresa. No entanto, recomendações são importantes para analisar quais serviços os clientes estão mais interessados, mas não podem ser confundidos com serviços que os fornecedores oferecem para a agência e que existe.

### 5. Deve ser considerado cada passageiro ou pessoa que ira fazer a viagem.

É essencial considerar a quantidade de pessoas que devem fazer as viagens ou então algumas partes do sistema podem quebrar.
