# Validação da aula de MMC e MDC

## 1. Identificação e cobertura

- **Produto e objetivo:** aula interativa local de MMC e MDC para estudantes do ensino fundamental; explicar os conceitos, resolver exemplos por fatoração, experimentar com números e praticar.
- **Ambiente e data:** arquivos locais em `file:///C:/Users/Alf/Pictures/web%20site%20HTML/mmc-mdc/index.html`, avaliados em 04/10/2026. A ferramenta de navegador não informou a versão do navegador.
- **Fontes consultadas:** `AUDITORIA-POTENCIACAO-TRIGONOMETRIA.md`, `MODELO_PAGINA_MATEMATICA.md`, `prompt-validacao-universal-de-sites.md`, arquivos da página e do índice do caderno.
- **Ferramentas e métodos:** navegador integrado com inspeção da interface e execução de interações; testes matemáticos em `testes/matematica.html`; inspeção do código HTML, CSS e JavaScript; medidas de `innerWidth` e `document.documentElement.scrollWidth`.
- **Páginas e fluxos:** nova página, navegação do índice do caderno até a aula, calculadora, recuperação após entrada inválida, exemplos rápidos e exercício com feedback.
- **Viewports emulados:** 320 × 800, 360 × 800, 390 × 800 e 1280 × 800 pixels. A captura visual foi feita em 360 px; nenhum aparelho físico foi usado.
- **Fora do alcance:** leitor de tela, toque em aparelho físico, Firefox/Safari, zoom do navegador a 200%, ambiente publicado, métricas de desempenho e testes de segurança do servidor.
- **Premissa:** os números da calculadora são inteiros positivos, pois a aula ensina fatoração em primos. O controle aceita de 2 a 5 números, de 1 a 1.000.000.

## 2. Veredito geral do produto

No escopo executado, a navegação até a aula, os cálculos, a atualização da tabela de fatores e o feedback dos exercícios responderam como esperado. Os nove testes matemáticos passaram; entradas inválidas apresentaram mensagem e limparam resultados antigos; os viewports avaliados não mostraram rolagem horizontal. A explicação diferencia MMC de MDC e explicita que a relação entre o produto do MDC/MMC vale para dois números positivos, não sendo generalizada para três ou mais. A validação manual com leitor de tela, toque físico e navegadores adicionais continua pendente. **Confiança geral: média**, limitada ao navegador e aos fluxos locais descritos.

## 3. Sumário de avaliação por pilar

| Pilar | Nota 1–5 / N/A / sem nota | Estado resumido | Evidência principal | Confiança |
|---|---:|---|---|---|
| Conteúdo e didática | 4/5 | Conceitos contrastados, fatoração demonstrada, resolução guiada e exercícios | Exemplos 12/18; quadro de expoentes; 9 testes matemáticos aprovados | Média |
| UX/UI | 4/5 | Hierarquia consistente com o caderno; resultado e erro visíveis | Captura a 360 px e interações no navegador | Média |
| Interatividade | 4/5 | Calculadora, preset, resolução em etapas e exercícios responderam | Preset e avanço da resolução testados; quatro respostas corretas e uma resposta incorreta com pista | Média |
| Acessibilidade | Sem nota — evidência insuficiente | Rótulos, skip link, tabela semântica e regiões de status estão no código; cobertura assistiva incompleta | Primeiro Tab chegou ao skip link; verificação de labels e estrutura; sem leitor de tela | Baixa |
| Responsividade/mobile | 4/5 | Sem rolagem horizontal indevida nos quatro viewports emulados | `scrollWidth <= innerWidth` em 320, 360, 390 e 1280 px | Média |
| Formulários e entradas | 4/5 | Limites e entradas inválidas recebem feedback; resultados exatos mantidos | Zero, formatos inválidos, recuperação, limite e MMC grande testados | Média |
| Qualidade técnica | 4/5 | Arquivos locais carregaram; interações observadas sem exceções no navegador | Scripts/estilos carregados, IDs únicos, âncoras resolvidas e fluxo sem erros de console | Média |
| Desempenho | Sem nota — evidência insuficiente | Não foram coletadas métricas de carregamento ou interação | LCP, INP e CLS não medidos | Baixa |
| Segurança básica do front-end | Sem nota — evidência insuficiente | Escopo local não permite concluir segurança geral | Inspeção limitada ao código da página; sem auditoria de segurança | Baixa |
| SEO básico | 4/5 | Título, descrição e idioma `pt-BR` presentes no documento | Metadados de `mmc-mdc/index.html`; título também observado no navegador | Média |

As notas se aplicam apenas à página e aos fluxos descritos; não foi calculada média geral.

## 4. Pontos fortes da entrega — o que manter

- **Diferença conceitual explícita:** o MMC é apresentado como menor múltiplo positivo comum e o MDC como maior divisor comum; exemplos de ciclos e repartição ajudam a selecionar o método. **Estado:** confirmado no conteúdo e observado na página.
- **Fatoração ligada ao cálculo:** o quadro compara os expoentes dos fatores primos, e a resolução mostra fatores comuns com expoentes mínimos para o MDC e fatores necessários com expoentes máximos para o MMC. **Estado:** testado com 12, 18 e 24; MMC 72 e MDC 6.
- **Precisão e limites tratados:** o MMC usa `BigInt`; a entrada informa limites e rejeita zero, negativos, decimais, texto e valores acima do máximo. **Estado:** confirmado nos testes e no navegador.
- **Alternativas acessíveis no código:** controles reais, rótulos, skip link, foco inicial útil e tabela com caption e cabeçalhos. **Estado:** confirmado no código; somente o primeiro Tab foi testado no navegador, sem leitor de tela.

## 5. Problemas confirmados e oportunidades de melhoria

**Não foram encontrados problemas confirmados nos fluxos executados.** As verificações pendentes e os passos para completá-las estão na seção 7; não são falhas comprovadas.

## 6. Testes funcionais executados

| Caso | Entrada/ação | Resultado esperado | Resultado observado | Estado | Evidência |
|---|---|---|---|---|---|
| Caminho principal da aula | Abrir com `12, 18, 24` | MMC 72, MDC 6 e fatorações correspondentes | 72, 6; quadro exibiu as fatorações de 12, 18 e 24 | Testado e confirmado | `index.html`; interação no navegador |
| Dois números | Digitar `4, 6` | MMC 12 e MDC 2 | MMC 12 e MDC 2 | Testado e confirmado | Interação no navegador |
| Entrada inválida | Digitar `0, 6` | Mensagem de domínio; ocultar resultado anterior | Mensagem “Cada número deve estar entre 1 e 1.000.000.”; resultados `—`; tabela removida | Testado e confirmado | Interação no navegador |
| Recuperação de erro | Após erro, digitar `12, 18, 24` | Recalcular normalmente | MMC 72 e MDC 6 restaurados | Testado e confirmado | Interação no navegador |
| Prática: entrada inválida | Responder `abc` à primeira questão | Pedir inteiro válido e marcar o campo | Mensagem mostrada e `aria-invalid="true"` | Testado e confirmado | Interação no navegador |
| Prática: resposta correta | Responder `12` ao MDC de 24 e 36 | Feedback correto e atualizar placar | “Correto!”, 1 acerto e 1 tentativa | Testado e confirmado | Interação no navegador |
| Nova questão | Acionar “Nova questão” | Avançar para o próximo exercício | Exibiu “Qual é o MMC de 8 e 12?” | Testado e confirmado | Interação no navegador |
| Prática: feedback e sequência completa | Errar a primeira resposta, depois responder 12, 24, 5 e 30 nas quatro questões | Mostrar pista para erro e reconhecer os quatro acertos | Pista específica; 4 acertos em 5 tentativas | Testado e confirmado | Interação no navegador |
| Persistência da pontuação | Enviar erro, recarregar; depois enviar acerto e recarregar | Preservar acertos e tentativas nos dois reloads | Erro: 0/1 antes e depois; acerto: 1/2 antes e depois | Testado e confirmado | Navegador local; `localStorage` |
| Tutorial de fatoração | Ler os passos para fatorar 84 | Chegar a 1 e expressar 84 como produto de primos | Divisões 84→42→21→7→1; fatoração exibida como 2² × 3 × 7 | Testado e confirmado | Conteúdo e DOM da seção “Como fatorar 84?” |
| Exemplo e resolução por etapas | Selecionar preset “Ciclos: 4 e 6” e acionar “Próximo passo” | Preencher 4 e 6 e abrir a próxima etapa | MMC 12, MDC 2; duas etapas abertas | Testado e confirmado | Interação no navegador |
| Caso-limite com 1 | Informar `1, 1` | MMC e MDC iguais a 1, sem fatores primos fictícios | Resultados 1 e 1; fatorizações `1 = 1` | Testado e confirmado | Navegador e teste matemático |
| MMC acima do inteiro seguro de JavaScript | `1.000.000` e `999.983` | Preservar MMC exato | Teste esperava e recebeu `999983000000n`; MDC 1 | Testado e confirmado | `testes/matematica.html` |
| MMC de cinco primos grandes | `999983, 999979, 999961, 999959, 999953` | Exibir produto exato sem rolagem horizontal de página | Valor formatado igual ao produto BigInt; MDC 1; tabela rolável localmente | Testado e confirmado | Interação a 360 px |
| Foco inicial | Pressionar Tab após abrir a página | Oferecer link para pular ao conteúdo | Primeiro foco: “Pular para o conteúdo” | Testado e confirmado | Navegador |
| Navegação do caderno | Abrir o caderno e selecionar “MMC e MDC” | Abrir a nova aula pelo índice | Página abriu com título e resultados padrão MMC 72 / MDC 6 | Testado e confirmado | Navegador; `../index.html` e `../home.js` |
| Testes matemáticos | Abrir `testes/matematica.html` | Casos comuns, limites e inválidos passarem | 9 passaram; 0 falharam | Testado e confirmado | Saída visível da página de testes |
| Responsividade | Avaliar 320, 360, 390 e 1280 px | Sem rolagem horizontal do documento | `scrollWidth` nunca excedeu `innerWidth` | Testado e confirmado | Medição no navegador; captura em 360 px |
| Integridade básica do documento | Examinar IDs, âncoras, labels e recursos | IDs únicos, destinos locais presentes e campos rotulados | Nenhum ID duplicado, âncora sem destino ou input sem label; stylesheet e scripts carregados | Testado e confirmado | Inspeção DOM no navegador |

## 7. Recomendações para validar

1. **P1 — Leitor de tela e teclado completo.** Percorrer navegação, campos, mensagens, quadro de fatores, etapas expansíveis e feedback com NVDA ou VoiceOver. Esperado: ordem lógica, foco visível e atualização dos resultados anunciada sem excesso. Requer navegador interativo e leitor de tela.
2. **P1 — Toque em aparelho físico.** Abrir a aula em telefone/tablet, editar os números com teclado virtual e conferir rolagem, ampliação e alvos de toque. Esperado: entrada utilizável sem bloquear a rolagem da página. Requer aparelho físico.
3. **P2 — Zoom e navegadores adicionais.** Revisar a 200% de zoom, Firefox e Safari, com atenção à tabela de fatores e aos cards estreitos. Esperado: texto e controles sem cortes ou sobreposição. Requer navegadores e zoom reais.
4. **P2 — Publicação, SEO e desempenho.** Se a página for publicada, verificar HTTPS, metadados na URL final e Core Web Vitals (LCP, INP e CLS). Requer ambiente publicado e ferramenta de medição adequada.

## 8. Checklist de ação para a equipe

- [ ] Executar teclado completo e leitor de tela (recomendação 1); registrar foco, nomes acessíveis e anúncio dos resultados.
- [ ] Testar formulário e rolagem por toque em dispositivo físico (recomendação 2); confirmar que a página continua rolando normalmente.
- [ ] Conferir Firefox, Safari e zoom de 200% (recomendação 3); corrigir apenas problemas reproduzidos.
- [ ] Após eventual publicação, medir LCP, INP e CLS e revisar HTTPS/metadados na URL final (recomendação 4).

## 9. Limitações e próximos passos

A avaliação cobre apenas os arquivos locais, o navegador integrado e os viewports emulados. A responsividade testada não representa aparelho físico; o primeiro foco por Tab não substitui uma avaliação completa de teclado; a inspeção de código não demonstra compatibilidade com leitor de tela, segurança do servidor ou desempenho de produção. Para aumentar a confiança, os próximos testes prioritários são leitor de tela/teclado completo e toque em aparelho real. As notas e conclusões acima valem somente para o escopo executado.
