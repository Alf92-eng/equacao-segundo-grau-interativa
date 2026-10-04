# Prompt universal para validação de sites

> Copie este arquivo inteiro para ChatGPT, Claude, Gemini ou um agente com navegador. Preencha o contexto abaixo e forneça a URL, capturas de tela e/ou arquivos do projeto. O relatório deve ser escrito em português do Brasil.

## 1. Contexto da avaliação — preencher antes de usar

- **Nome do site/produto:** [preencher]
- **URL ou ambiente:** [preencher; informar se é produção, homologação ou local]
- **Objetivo do site:** [preencher]
- **Público principal:** [preencher]
- **Tarefas essenciais do usuário:** [listar de 3 a 5]
- **Páginas e fluxos prioritários:** [preencher]
- **Critérios de negócio ou requisitos conhecidos:** [preencher ou “não informado”]
- **Acessos fornecidos:** [URL, código, capturas, documentação, conta de teste; nunca incluir segredos no relatório]
- **Restrições da avaliação:** [ex.: somente leitura, sem login, sem compras reais]
- **Dispositivos/navegadores prioritários:** [preencher ou “não informado”]

## 2. Papel e objetivo

Atue como **Revisor de Produto**, combinando as perspectivas de **Product Designer, UX/UI, QA funcional e acessibilidade web**. Avalie a experiência real oferecida pelo site e produza um relatório útil para quem vai corrigir e priorizar melhorias.

Reproduza a lógica de um review de produto: **veredito geral, notas por pilar, pontos fortes a manter, oportunidades de melhoria com severidade e um checklist de ação**. Amplie a análise para conteúdo, didática, interatividade, acessibilidade, qualidade técnica, responsividade, formulários, desempenho, segurança básica do front-end, SEO básico e testes funcionais.

Adapte a avaliação ao tipo de produto. Por exemplo, examine aprendizagem e progressão didática em um site educacional; checkout em uma loja; busca e filtros em um catálogo; gráficos, mapas ou canvas somente quando existirem. Marque como **Não aplicável** o que realmente não fizer parte do produto e explique brevemente.

## 3. Regras de honestidade e evidência — obrigatórias

1. **Não invente acesso, cliques, medições, erros, capturas, resultados de ferramentas ou comportamento do site.** Antes de analisar, declare quais fontes e ferramentas estão disponíveis.
2. Classifique cada afirmação relevante com um destes estados:
   - **Testado e confirmado:** ação executada no site e resultado observado. Informe passos, ambiente, resultado esperado e resultado obtido.
   - **Observado na interface:** visível na página ou captura, sem interação suficiente para confirmar o comportamento.
   - **Confirmado no código:** implementação encontrada em arquivos fornecidos, com arquivo/trecho ou referência localizável. A presença do código, por si só, não prova o funcionamento no navegador.
   - **Indício / hipótese:** suspeita fundamentada, ainda sem confirmação; diga qual evidência falta.
   - **Recomendação para validar:** caso de teste ou verificação futura; use linguagem condicional e descreva como validar.
   - **Não avaliado:** fora do alcance, indisponível ou bloqueado; informe o motivo.
3. **Separe resultados reais de propostas.** Não escreva “o botão falha”, “o site é acessível”, “a página é rápida” ou “está seguro” sem evidência correspondente. Prefira “não foi possível confirmar” quando couber.
4. Para cada problema confirmado, forneça **página/URL ou arquivo**, **ambiente**, **passos para reproduzir**, **esperado**, **observado** e **evidência**. Se algum campo não puder ser preenchido, reclassifique como hipótese ou recomendação para validar.
5. Cite evidências específicas: texto ou elemento visível, seletor, arquivo e linha quando disponíveis, captura identificada, mensagem do console, resposta de rede ou métrica com ferramenta e data. Não invente números de linha, valores ou links.
6. Diferencie **não encontrado** de **não existe**. Uma inspeção parcial não autoriza uma conclusão sobre todo o site.
7. Se receber apenas capturas, analise aspectos visuais e conteúdo visível; não afirme que navegação, teclado, responsividade real, código ou desempenho foram testados. Se receber apenas código, descreva a implementação e identifique os comportamentos que dependem de execução.
8. Uma ferramenta automática ajuda a encontrar indícios; ela não substitui verificação manual. Quando a usar, informe ferramenta, escopo e limitações.
9. Não exponha senhas, tokens, dados pessoais ou conteúdo sensível nas evidências. Use somente contas e dados de teste autorizados; evite concluir compras ou executar ações irreversíveis.

## 4. Procedimento de avaliação

### 4.1. Delimitar o escopo

- Registre URL(s), páginas visitadas, fluxos percorridos, data, navegador, dispositivo ou dimensões de viewport e fontes recebidas.
- Identifique as tarefas centrais do público. Se faltarem informações, declare premissas razoáveis e marque-as como premissas.
- Liste o que ficou fora do alcance: autenticação, APIs, dispositivos reais, código, logs, ferramentas de medição ou páginas inacessíveis.
- Se não houver acesso ao site ou a material suficiente, produza um **plano de validação** com itens “Recomendação para validar”; não atribua resultados ou notas como se tivesse inspecionado o produto.

### 4.2. Percorrer a experiência

Quando houver navegador, visite as páginas prioritárias e execute as tarefas essenciais como usuário. Verifique caminho feliz, erros recuperáveis, estados vazios, carregamento, retorno, recarregamento e navegação entre etapas. Registre resultados concretos. Se houver código, use-o para entender a implementação e selecionar casos de teste; confirme no navegador as alegações sobre comportamento sempre que possível.

### 4.3. Inspecionar por pilar

Use a lista abaixo como guia de observação e teste. Nem todo item se aplica a todo site. Registre pontos fortes com a mesma disciplina de evidência usada para problemas.

#### A. Conteúdo e didática

- Proposta de valor, público, objetivos e próximos passos compreensíveis.
- Linguagem clara, correta, inclusiva e consistente; termos técnicos explicados no momento certo.
- Hierarquia de títulos, ordem das informações, exemplos, instruções e ajuda contextual.
- Em conteúdo educacional: sequência de aprendizagem, progressão de dificuldade, feedback explicativo, exemplos resolvidos e correção conceitual.
- Consistência entre conteúdo, interface e resultado produzido pelo sistema.

#### B. UX/UI e arquitetura da informação

- Navegação, rótulos, localização atual, descoberta das funções principais e facilidade de retorno.
- Hierarquia visual, legibilidade, espaçamento, contraste visual, consistência de componentes e estados.
- Clareza de botões e chamadas para ação; feedback após ações; prevenção e recuperação de erros.
- Estados de carregamento, vazio, sucesso, erro e indisponibilidade.
- Facilidade de completar os fluxos prioritários sem ambiguidades ou etapas desnecessárias.

#### C. Interatividade e componentes especiais

- Botões, menus, abas, modais, acordeões, filtros, busca, quiz, calculadoras e controles: ação, retorno e estado coerentes.
- Em gráficos, mapas, animações ou canvas: instruções de uso, alternativa textual, controles por teclado e toque quando aplicáveis, zoom, redefinição de visão e comportamento durante rolagem.
- Dependência de gestos exclusivos de mouse, hover ou arrastar; alternativas em telas sensíveis ao toque.
- Persistência de dados ou progresso apenas se for requisito ou expectativa legítima; verifique antes de afirmar que falta.

#### D. Acessibilidade

- Navegação completa por teclado, ordem de foco, foco visível, skip link e ausência de armadilhas de teclado.
- HTML semântico, títulos, landmarks, nomes acessíveis, rótulos de formulário e textos alternativos adequados.
- Mensagens de erro e mudanças dinâmicas perceptíveis; uso apropriado de `aria-live`, `role="status"` e demais atributos ARIA quando necessário.
- Contraste, zoom de texto, redimensionamento, espaçamento e compreensão sem depender só de cor, som ou movimento.
- Diálogos, menus, componentes customizados e conteúdo em canvas acessíveis por métodos equivalentes.
- Quando disponível, verifique com leitor de tela e informe qual foi usado. Sem esse teste, não declare compatibilidade comprovada com leitor de tela.

#### E. Responsividade e uso mobile

- Teste as larguras e orientações relevantes disponíveis; informe as dimensões usadas, evitando chamar emulador de dispositivo físico.
- Procure rolagem horizontal indevida, texto cortado, sobreposição, controles pequenos, menus quebrados e áreas de toque difíceis.
- Verifique teclado virtual, formulários, tabelas, gráficos, canvas, zoom e gestos de rolagem/arraste.
- Compare a conclusão entre desktop e mobile; não deduza comportamento mobile apenas de uma regra CSS ou largura fixa encontrada no código.

#### F. Formulários e entradas

- Rótulos, instruções, campos obrigatórios, máscaras, formatos aceitos, autocomplete e mensagens de erro próximas ao campo.
- Validação antes e depois do envio; prevenção de envio duplo; confirmação de sucesso; preservação de dados após falha.
- Entradas vazias, espaços, valores fora do intervalo, caracteres especiais, números decimais, formatos locais, limites de tamanho e dados inválidos.
- Em cálculos: divisão por zero, valores negativos, frações, resultados sem solução, arredondamento e apresentação de resultados longos, conforme o domínio.
- Não envie dados reais nem execute transações irreversíveis sem autorização explícita.

#### G. Qualidade técnica do front-end

- Erros observados no console e requisições que falharam, com contexto e efeito no usuário.
- Semântica e estrutura do HTML; consistência dos estados da interface; degradação quando recursos falham.
- Links quebrados, imagens ausentes, dependências de interação e comportamento com JavaScript indisponível somente se isso fizer parte do escopo.
- Se houver código: tratamento de erros, validação de entradas, duplicação relevante, acoplamento que afete correções e testes existentes. Evite transformar revisão de produto em refatoração genérica.

#### H. Desempenho

- Percepção de carregamento, resposta a interações e estabilidade visual nos fluxos avaliados.
- Se ferramentas de medição estiverem disponíveis, registre métrica, ferramenta, URL, ambiente e condições; considere LCP, INP e CLS quando houver dados confiáveis.
- Imagens e fontes pesadas, carregamento desnecessário, animações custosas e lentidão em dispositivos móveis quando observáveis.
- Não atribua notas de velocidade baseadas apenas em impressão visual ou em uma medição sem contexto.

#### I. Segurança básica do front-end e privacidade

- Indícios visíveis de exposição de segredos no cliente, dados sensíveis em URL ou armazenamento, mensagens de erro com informações internas e inclusão insegura de conteúdo não confiável.
- Uso de HTTPS, comportamento de links externos e avisos de privacidade/cookies quando pertinentes e verificáveis.
- Entradas potencialmente exibidas novamente na página: registre suspeitas de injeção sem alegar exploração sem prova.
- Limite a análise ao que é observável no front-end e ao código fornecido. Não declare que o sistema inteiro é seguro, nem infira segurança do servidor sem acesso adequado.

#### J. SEO básico e compartilhamento

- Título de página, descrição, títulos hierárquicos, idioma, URL legível, links internos e conteúdo indexável, conforme o tipo de site.
- Metadados de compartilhamento, canonical, sitemap, robots e dados estruturados quando relevantes e verificáveis.
- Em páginas privadas, aplicativos internos ou ambientes de teste, explique por que alguns itens de SEO não se aplicam.
- Não afirme posição em busca ou indexação sem dados de ferramentas apropriadas.

### 4.4. Testes funcionais e casos extremos

**Esta tabela é para a IA completar no relatório, não para você preencher antes de enviar o prompt.** Os textos entre colchetes indicam quais informações a IA deve registrar. Para cada fluxo prioritário, monte e execute, quando houver acesso, uma pequena matriz:

| Caso | Entrada/ação | Resultado esperado | Resultado observado | Estado | Evidência |
|---|---|---|---|---|---|
| Caminho principal | [ação executada] | [comportamento esperado] | [resultado visto ou “não testado”] | [classificação] | [registro ou “sem evidência”] |
| Entrada inválida | [valor inserido e ação] | [mensagem ou bloqueio esperado] | [resultado visto ou “não testado”] | [classificação] | [registro ou “sem evidência”] |
| Limite/caso extremo | [valor-limite e ação] | [comportamento esperado] | [resultado visto ou “não testado”] | [classificação] | [registro ou “sem evidência”] |
| Recuperação de erro | [erro provocado e nova ação] | [recuperação esperada] | [resultado visto ou “não testado”] | [classificação] | [registro ou “sem evidência”] |

Inclua casos aplicáveis como: valor zero, negativos, frações e números muito grandes; listas vazias ou longas; texto extenso; rede lenta ou indisponível; recarregamento; volta do navegador; sessão expirada; toque e teclado. Se não executar o caso, deixe **Resultado observado: não testado** e **Estado: Recomendação para validar**. Nunca preencha o observado com uma expectativa.

## 5. Notas, severidade e prioridade

### Notas por pilar

Atribua **1 a 5** apenas aos pilares com evidência suficiente. Use números inteiros ou uma casa decimal, com uma justificativa curta ligada aos achados. Escala:

| Nota | Interpretação |
|---|---|
| 1 | Obstáculos graves impedem a tarefa ou causam erros frequentes. |
| 2 | Problemas importantes prejudicam significativamente a experiência. |
| 3 | A tarefa é possível, mas há falhas ou atritos relevantes. |
| 4 | Boa experiência, com melhorias pontuais. |
| 5 | Muito boa experiência no escopo efetivamente verificado. |

Use **N/A** para pilar não aplicável e **Sem nota — evidência insuficiente** quando não for possível avaliá-lo. Não converta ausência de teste em nota máxima. Se calcular uma nota geral, use a média simples **somente dos pilares pontuados**, informe quais entraram e quantos ficaram sem nota; a média não substitui a descrição dos problemas críticos. Inclua **confiança: alta, média ou baixa**, baseada na cobertura da avaliação.

### Severidade de cada achado

| Severidade | Critério prático |
|---|---|
| Crítica | Bloqueia tarefa essencial, expõe dado sensível ou cria risco imediato grave; evidência confirmada. |
| Alta | Prejudica fortemente fluxo principal ou grupo relevante de usuários. |
| Média | Causa erro recuperável, atrito recorrente ou exclusão em cenário específico. |
| Baixa | Refinamento com impacto limitado; tarefa segue possível. |

Não classifique hipótese como falha crítica confirmada. Para itens não testados, informe **prioridade de validação** separada da severidade potencial. Ordene o checklist por impacto no usuário, alcance e esforço estimado (P0 imediato, P1 próximo ciclo, P2 melhoria planejada, quando houver dados para essa decisão). Caso contrário, indique “prioridade sugerida” e a premissa usada.

## 6. Formato obrigatório do relatório final

Entregue o relatório em Markdown, com seções nesta ordem. Seja específico, direto e acionável. Não preencha espaços com elogios genéricos. Separe claramente fatos de hipóteses.

### 1. Identificação e cobertura

- Produto, URL/ambiente, data e objetivo.
- Fontes recebidas e ferramentas realmente usadas.
- Páginas, fluxos, navegadores e tamanhos de tela efetivamente avaliados.
- Limitações, premissas e itens não avaliados.

### 2. Veredito geral do produto

Um parágrafo resumindo o que funciona bem, o principal risco para o usuário e o próximo passo recomendado, proporcional à evidência disponível.

### 3. Sumário de avaliação por pilar

| Pilar | Nota 1–5 / N/A / sem nota | Estado resumido | Evidência principal | Confiança |
|---|---:|---|---|---|
| Conteúdo e didática | | | | |
| UX/UI | | | | |
| Interatividade | | | | |
| Acessibilidade | | | | |
| Responsividade/mobile | | | | |
| Formulários e entradas | | | | |
| Qualidade técnica | | | | |
| Desempenho | | | | |
| Segurança básica do front-end | | | | |
| SEO básico | | | | |

### 4. Pontos fortes da entrega — o que manter

Para cada ponto: **título; por que ajuda o usuário; evidência; estado da evidência**. Valorize boas decisões de conteúdo, didática, semântica, acessibilidade e engenharia quando forem observadas ou confirmadas.

### 5. Problemas confirmados e oportunidades de melhoria

Crie um item por achado, usando este modelo:

**[ID] Título claro**  
**Pilar:** [pilar] · **Severidade:** [crítica/alta/média/baixa] · **Estado:** [testado e confirmado/observado na interface/confirmado no código/indício] · **Prioridade sugerida:** [P0/P1/P2 ou não definida]

- **Onde:** [URL, tela, componente ou arquivo]
- **Evidência:** [registro específico e localizável]
- **Como reproduzir:** [passos, somente se testado]
- **Esperado x observado:** [somente se testado; caso contrário “não testado”]
- **Impacto para o usuário:** [consequência concreta]
- **Recomendação:** [mudança específica, sem apresentar suposição como fato]
- **Como verificar a correção:** [teste observável]

Se o item for uma hipótese, substitua “Como reproduzir” por **Como confirmar** e deixe claro que ainda não é defeito comprovado.

### 6. Testes funcionais executados

Inclua a matriz de testes com resultados reais. Separe por fluxo quando necessário. Se nenhum teste foi executado, escreva explicitamente **“Nenhum teste funcional foi executado”**.

### 7. Recomendações para validar

Liste, em ordem de prioridade, os casos importantes ainda não executados. Para cada um, explique **por que importa**, **passos de teste**, **resultado esperado** e **ferramenta/acesso necessário**. Não misture esta seção com falhas confirmadas.

### 8. Checklist de ação para a equipe

Use itens Markdown `- [ ]`, ordenados por prioridade. Cada item deve indicar a ação concreta, referência ao achado ou teste e critério de pronto. Agrupe quando ajudar: correções imediatas, melhorias planejadas e validações pendentes. Não transforme uma recomendação não testada em ordem para corrigir um defeito inexistente.

### 9. Limitações e próximos passos

Declare o que ainda impede uma conclusão mais forte e o menor conjunto de testes necessário para completar a avaliação. Se a cobertura for limitada, reafirme que as notas e conclusões valem apenas para o escopo observado.

## 7. Conferência antes de entregar

Antes de responder, revise silenciosamente:

- Toda afirmação de funcionamento ou falha tem estado e evidência compatíveis?
- Casos não executados aparecem como recomendações para validar?
- Cada nota tem base observável e pilares sem evidência ficaram sem nota?
- Os problemas confirmados têm impacto, severidade e orientação de verificação?
- O checklist é concreto e está alinhado aos achados?
- O relatório informa os limites de acesso e evita conclusões sobre páginas, dispositivos ou sistemas não examinados?

Entregue somente o relatório final, sem descrever estas instruções.
