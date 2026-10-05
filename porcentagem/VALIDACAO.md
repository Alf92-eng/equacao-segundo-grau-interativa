# Validação de produto — aula de Porcentagem

## 1. Identificação e cobertura

- **Produto:** Matemática em Ação — aula interativa de Porcentagem.
- **URL/ambiente:** arquivo local `porcentagem/index.html` (`file:///C:/Users/Alf/Pictures/web%20site%20HTML/porcentagem/index.html`), ambiente de desenvolvimento.
- **Data:** 04/10/2026.
- **Objetivo:** ajudar estudantes do ensino fundamental ou médio a interpretar porcentagens, calcular partes, proporções e variações e praticar com feedback. Público-alvo é uma premissa, pois não foi especificado.
- **Fontes:** `index.html`, `style.css`, `script.js`, `README.md` da aula; página inicial e arquivos de navegação; `MODELO_PAGINA_MATEMATICA.md`; `prompt-validacao-universal-de-sites.md`.
- **Ferramentas usadas:** navegador integrado ao VS Code para observação e execução de interações; automação do navegador para preencher campos, selecionar opções, acionar eventos de formulário e medir dimensões CSS. A identificação e a versão do navegador não foram expostas pela ferramenta.
- **Páginas e fluxos avaliados:** página de Porcentagem; abertura do caderno inicial e navegação pelo link do capítulo 05; cálculo nos três modos; exemplos rápidos; validação de entradas; exercícios; teclado e foco.
- **Viewports emulados:** 375, 390, 768 e 1440 px de largura, altura de 844–900 px. Não são dispositivos físicos. O `clientWidth` foi 15 px menor que `innerWidth` nos testes, e `scrollWidth` coincidiu com `clientWidth` em todas as larguras.
- **Limitações:** não houve teste em dispositivo real, leitor de tela, navegador adicional, zoom de texto a 200%, ferramenta de contraste, Lighthouse/perfil de desempenho, rede ou endpoints de servidor. O console/rede não foi monitorado sistematicamente.

## 2. Veredito geral do produto

A aula apresenta uma progressão coerente do conceito “por cento” para três usos frequentes, com cálculo atualizado, explicações, representação textual/visual e prática com pistas. Os exemplos principais, a validação de zero e números inválidos, a navegação pelo caderno e a adaptação às larguras testadas funcionaram conforme esperado. Não foi confirmado defeito na página nova durante os fluxos exercitados. A principal limitação da avaliação é a falta de cobertura com leitor de tela, dispositivo físico e ferramentas de medição técnica.

## 3. Sumário de avaliação por pilar

| Pilar | Nota 1–5 / N/A / sem nota | Estado resumido | Evidência principal | Confiança |
|---|---:|---|---|---|
| Conteúdo e didática | 4 | Conceito, fórmulas e exemplos consistentes nos casos conferidos | Código da aula e cálculos executados no navegador | Média |
| UX/UI | 4 | Navegação e tarefas principais compreensíveis no escopo observado | Link do capítulo 05 e controles da calculadora/exercício | Média |
| Interatividade | 4 | Três modos, presets, atualização do passo a passo e prática funcionaram | Resultados observados na matriz de testes | Média |
| Acessibilidade | Sem nota — evidência insuficiente | Semântica e foco visível confirmados parcialmente; leitor de tela não testado | Labels/ARIA no código e avanço por Tab com outline visível | Baixa |
| Responsividade/mobile | 4 | Sem rolagem horizontal nas larguras emuladas | `scrollWidth` igual a `clientWidth` em 375, 390, 768 e 1440 px | Média |
| Formulários e entradas | 4 | Decimal com vírgula aceito; todo zero, campo vazio e taxa negativa tratados | Interações e mensagens observadas no navegador | Média |
| Qualidade técnica | 4 | Página executada e atualizações coerentes nos fluxos avaliados | Carregamento da aula, cálculos, exercício e persistência | Média |
| Desempenho | Sem nota — evidência insuficiente | Métricas e desempenho em dispositivo modesto não medidos | Nenhum perfil ou medição de desempenho executado | Baixa |
| Segurança básica do front-end | Sem nota — escopo insuficiente | Inspeção limitada à página estática; não houve teste de segurança | Código front-end local; nenhum teste de servidor/API | Baixa |
| SEO básico | 4 | Idioma, título e descrição presentes | Metadados do HTML da nova página | Média |

Não foi calculada nota geral: a avaliação não cobriu todos os pilares com evidência suficiente.

## 4. Pontos fortes da entrega — o que manter

- **Três perguntas diferentes para a mesma relação parte/todo.** Ajuda a transferir o conceito para cálculo de parte, descoberta da taxa e variação. **Evidência:** exemplos e exercícios no HTML; as três operações foram executadas no navegador. **Estado:** confirmado no código e testado.
- **Resolução que acompanha os valores da calculadora.** Cada operação atualiza expressão, etapas, resultado e descrição visual a partir dos campos. **Evidência:** alteração de presets e campos mudou resultado, etapas e descrição. **Estado:** testado e confirmado.
- **Feedback orientador na prática.** A resposta errada mostra uma pista específica; a correta confirma o acerto. **Evidência:** respostas `20` e `30` na questão inicial de 20% de 150. **Estado:** testado e confirmado.
- **Tratamento explícito de valores fora do domínio usado.** O todo zero é rejeitado ao calcular uma taxa e a porcentagem negativa recebe uma mensagem, sem mostrar `NaN` ou resposta fictícia. **Evidência:** mensagens e saída “—” observadas no navegador. **Estado:** testado e confirmado.
- **Foco de teclado identificável.** O primeiro Tab alcançou “Pular para o conteúdo” e o segundo alcançou a marca, ambos com outline de 3 px. **Evidência:** elemento ativo e estilo computado no navegador. **Estado:** testado; não equivale a uma avaliação completa de acessibilidade.
- **Integração com o caderno existente.** O índice mostra o quinto capítulo e seu link abriu a nova página. **Evidência:** navegação da home para `porcentagem/index.html`. **Estado:** testado e confirmado.

## 5. Problemas confirmados e oportunidades de melhoria

**Nenhum problema confirmado na página de Porcentagem após as correções e nos fluxos exercitados.**

**[H-01] Erro transitório reportado em uma aba antiga da página inicial**  
**Pilar:** Qualidade técnica da home · **Severidade:** não atribuída (indício não reproduzido) · **Estado:** indício / hipótese · **Prioridade sugerida:** validar se voltar a ocorrer

- **Onde:** uma aba da página inicial já aberta durante a sessão; a mensagem apontava para `home.js`.
- **Evidência:** ao navegar dessa aba para a nova página, o navegador reportou uma vez `TypeError: Cannot read properties of null (reading 'replaceChildren')` em `home.js:79`. O número indicado não corresponde às operações `replaceChildren` do arquivo atual (`home.js:121` e `home.js:126`).
- **Como confirmar:** atualizar a página inicial em uma aba limpa, abrir o caderno e seguir até o capítulo Porcentagem; observar erros não tratados e repetir caso apareçam.
- **Esperado x observado:** na primeira navegação foi observado o erro uma vez; no fluxo iniciado em outra aba limpa, o caderno abriu e o link do capítulo levou à aula sem repetição observada.
- **Impacto potencial:** se reproduzível na versão atual, poderia interromper a atualização de páginas do caderno; não foi possível associá-lo à página nova nem reproduzi-lo.
- **Recomendação:** manter como validação pendente, sem tratar como defeito confirmado ou atribuir severidade antes de reproduzir.
- **Como verificar:** repetir o fluxo em uma sessão limpa e confirmar ausência do erro no console; se ocorrer, registrar DOM, versão do script e passos exatos.

## 6. Testes funcionais executados

| Caso | Entrada/ação | Resultado esperado | Resultado observado | Estado | Evidência |
|---|---|---|---|---|---|
| Cálculo inicial | 20% de 150 | 30 | 30 | Testado e confirmado | Resultado da calculadora no navegador |
| Percentual de um valor | Exemplo rápido 25% de 80 | 20 | 20 | Testado e confirmado | Resultado atualizado para 20 |
| Parte como proporção | Exemplo rápido: 30 de 120 | 25% | 25% | Testado e confirmado | Modo “descobrir quantos por cento” |
| Aumento | Aumentar 10% de 80 | 88 | 88 | Testado e confirmado | Exemplo rápido |
| Redução | Reduzir 15% de 200 | 170 | 170 | Testado e confirmado | Exemplo rápido |
| Decimal local | 25,5% de 200 | 51 | 51 | Testado e confirmado | Campos preenchidos com vírgula decimal |
| Parte maior que o todo | Reduzir 150% de 200 | −100 | −100; a descrição visual registra 1 todo completo e 50% adicional | Testado e confirmado | Modo de variação; caso extremo acima de 100% |
| Divisão por zero | Descobrir a porcentagem com todo igual a 0 | Mensagem próxima ao campo; sem resultado calculado | “O todo precisa ser maior que zero.” e resposta “—” | Testado e confirmado | Entrada no modo de proporção |
| Campo vazio | Apagar o valor do todo | Erro no campo e resultado indisponível | “Preencha este campo.”, `aria-invalid=true` e resposta “—” | Testado e confirmado | Entrada vazia no modo de proporção |
| Entrada negativa | Taxa −2% | Rejeição clara | Mensagem de entrada inválida e cálculo indisponível | Testado e confirmado | Campo de porcentagem |
| Proporção que transborda o limite numérico | Parte 1.000.000.000 e todo `0.` seguido por 308 zeros e `1` | Mensagem de limite; sem infinito ou resultado enganoso | Mensagem para usar um valor de referência menos extremo e resposta “—” | Testado e confirmado | Modo de proporção |
| Resposta incorreta | Responder 20 à questão “Quanto é 20% de 150?” | Pista sem revelar confirmação de acerto | Pista específica sobre dividir por 100 e multiplicar pelo todo | Testado e confirmado | Formulário de prática |
| Resposta correta | Responder 30 à mesma questão | Mensagem de acerto e atualização do progresso | “Correto!”; contadores atualizados | Testado e confirmado | Formulário de prática |
| Nova questão | Solicitar nova questão | Avançar para a seguinte | “QUESTÃO 2 DE 3” | Testado e confirmado | Botão “Nova questão” |
| Persistência do progresso | Atualizar a página após um acerto | Contadores preservados no mesmo navegador | `3` acertos e `5` tentativas antes e depois da atualização | Testado e confirmado | Valores exibidos após reload |
| Persistência de resposta errada e correta | Enviar resposta incorreta, atualizar; acertar e atualizar outra vez | Preservar tentativas e acertos | Após erro: 0/1 antes e depois; após acerto: 1/2 antes e depois | Testado e confirmado | Navegador local; `localStorage` |
| Grade conceitual | Conferir a grade de porcentagem | 100 células | 100 elementos na grade; 50 preenchidos | Testado e confirmado | DOM da representação visual |
| Navegação da home | Abrir caderno e selecionar capítulo 05 | Abrir a aula de Porcentagem | URL final `porcentagem/index.html`, título correto | Testado e confirmado | Fluxo de navegação no navegador |
| Teclado e foco | Pressionar Tab duas vezes no início da aula | Foco no skip link e depois na marca; foco visível | Ambos os elementos receberam foco e outline de 3 px | Testado e confirmado | Elemento ativo e estilo computado |
| Larguras responsivas | Viewports CSS 375, 390, 768 e 1440 px | Sem overflow horizontal | `scrollWidth` igual a `clientWidth` em todas | Testado e confirmado | Medição do DOM; viewports emulados |

## 7. Recomendações para validar

1. **Leitor de tela e anúncios dinâmicos:** importa para estudantes que dependem de tecnologia assistiva e para confirmar feedback de cálculo/exercício. Percorrer título, navegação, formulário, erros, resultado, passos e exercício com NVDA ou leitor disponível. **Resultado esperado:** ordem coerente, campos nomeados e mudanças importantes anunciadas. **Acesso necessário:** leitor de tela instalado; não foi usado nesta avaliação.
2. **Contraste e ampliação:** importa para leitura com baixa visão. Medir contraste de texto, estados e controles; testar zoom de navegador a 200% e largura equivalente a 320 CSS px. **Resultado esperado:** conteúdo e controles sem corte ou sobreposição e contraste conforme WCAG aplicável. **Ferramenta necessária:** verificador de contraste e navegador; não foram medidos.
3. **Toque em dispositivo real e outros navegadores:** importa para teclado virtual, alvos de toque e diferenças de renderização. Repetir os três modos e os exercícios em celular/tablet físicos e em pelo menos um segundo navegador. **Resultado esperado:** campos utilizáveis, rolagem natural e resultados iguais aos observados nos viewports emulados. **Acesso necessário:** dispositivos e navegadores adicionais.
4. **Desempenho e rede:** importa para perceber bloqueios em dispositivos modestos. Medir carregamento e resposta da página com ferramenta apropriada e throttling documentado. **Resultado esperado:** sem tarefas ou recursos desnecessários com impacto perceptível; registrar LCP/INP/CLS somente com ferramenta e condições. **Ferramenta necessária:** Lighthouse ou DevTools; não foi executado.
5. **Limites numéricos restantes:** importa para confirmar a formatação no topo dos intervalos. Testar taxas 0 e 1.000%, quantidades no limite superior e decimais próximos do limite mínimo representável. A proporção extrema já foi testada e é rejeitada com mensagem. **Resultado esperado:** cálculo estável, limite informado e sem `NaN`/`Infinity`. **Acesso necessário:** a própria calculadora.
6. **Erro isolado na aba inicial:** importa para garantir que os capítulos permanecem navegáveis. Atualizar uma aba antiga e repetir a abertura do capítulo; inspecionar o console se o `TypeError` relatado reaparecer. **Resultado esperado:** ausência de erro não tratado; se ocorrer, registrar versão do script e estado do DOM. **Ferramenta necessária:** navegador com console.

## 8. Checklist de ação para a equipe

- [x] Criar uma aula responsiva com três perguntas, fórmula, explicação passo a passo e representação textual/visual; critério: campos, resultado e interpretação sincronizados.
- [x] Integrar Porcentagem ao índice do caderno e atualizar o total de capítulos; critério: o link abre a aula correta.
- [x] Validar casos comuns, vírgula decimal, entradas inválidas, zero no denominador e variação acima de 100%; critério: saída correta ou mensagem sem valor inválido.
- [x] Incluir exercício com feedback, nova questão e progresso salvo; critério: acerto, erro e persistência observáveis.
- [ ] Completar a validação de acessibilidade com leitor de tela, contraste e zoom; critério: registrar resultados e corrigir barreiras confirmadas.
- [ ] Repetir testes em dispositivo físico e navegador adicional; critério: os fluxos essenciais continuam sem overflow ou falhas.
- [ ] Medir desempenho e confirmar o indício H-01 na home se reaparecer; critério: registrar ferramenta, condições e evidência reproduzível.

## 9. Limitações e próximos passos

Os resultados e notas aplicam-se somente à página local, aos fluxos listados e às larguras CSS emuladas. Ainda faltam leitor de tela, medição de contraste, zoom, dispositivo físico, outro navegador, desempenho e confirmação do indício não reproduzido da página inicial. Para completar a avaliação, o conjunto mínimo é: executar a aula com leitor de tela, verificar contraste/zoom a 200%, repetir os fluxos em celular real e conferir console/performance em uma sessão limpa.
