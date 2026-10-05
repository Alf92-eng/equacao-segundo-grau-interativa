# Validação da aula de Radiciação

## 1. Identificação e cobertura

- **Produto:** capítulo Radiciação do portal Matemática em Ação.
- **Ambiente e data:** arquivos locais no Windows, avaliados em 04/10/2026.
- **Objetivo:** ensinar raízes de diferentes índices, simplificação e operações com radicais.
- **Fontes e ferramentas:** `index.html`, `style.css`, `script.js`, `testes/matematica.html`, README da página, auditoria de aulas anterior, modelo de página e prompt universal; navegador integrado com automação Playwright; `git diff --check`.
- **Escopo percorrido:** conteúdo, laboratório, exercício, testes matemáticos e entrada no índice do caderno. Viewports emulados de 1280 × 800 e 360 × 800 px.
- **Limitações:** não foram usados dispositivo físico, leitor de tela, navegador adicional nem URL publicada. Não foram medidos Core Web Vitals nem feita auditoria de segurança abrangente.

## 2. Veredito geral do produto

No escopo local avaliado, a aula apresenta raízes quadradas, cúbicas e de índice 4 a 12, simplificação por fatoração, potência dentro e fora do radical, produto, quociente e soma/subtração de radicais semelhantes. Os 18 casos matemáticos e os fluxos de formulário exercitados produziram os resultados esperados; o layout não teve rolagem horizontal nas duas larguras emuladas. Ainda faltam testes com leitor de tela, toque físico e navegadores adicionais. **Confiança geral: média**, limitada à execução local e aos fluxos descritos.

## 3. Sumário de avaliação por pilar

| Pilar | Nota 1–5 / N/A / sem nota | Estado resumido | Evidência principal | Confiança |
|---|---:|---|---|---|
| Conteúdo e didática | 4/5 | Conceito, regras, laboratório, passos e prática presentes | Código da página e 18/18 testes matemáticos | Média |
| UX/UI | Sem nota — evidência insuficiente | Correção visual pontual observada; avaliação visual completa não realizada | Capturas do radical quadrado e cúbico e do resultado do laboratório | Baixa |
| Interatividade | 4/5 | Operações, exemplos, validação e prática responderam nos fluxos exercitados | Matriz funcional abaixo | Média |
| Acessibilidade | Sem nota — evidência insuficiente | Rótulos, foco visível e regiões de estado constam no código; sem leitor de tela | Inspeção do HTML/CSS/JS | Baixa |
| Responsividade/mobile | 4/5 | Sem rolagem horizontal nas larguras emuladas | `scrollWidth=clientWidth` em 360 e 1280 px | Média |
| Formulários e entradas | 4/5 | Domínio inválido bloqueado; correção recuperável | Radicando negativo par, divisor zero e entradas válidas após correção | Média |
| Qualidade técnica | 4/5 | Testes matemáticos passam; nenhum erro de página observado nos fluxos verificados | 18/18 testes; Playwright registrou zero `pageerror` | Média |
| Desempenho | Sem nota — evidência insuficiente | Métricas não medidas | Sem LCP, INP ou CLS | Baixa |
| Segurança básica do front-end | Sem nota — evidência insuficiente | Inspeção limitada ao código local; sem auditoria de segurança | Não avaliado de forma abrangente | Baixa |
| SEO básico | 4/5 | Idioma, título e descrição estão no HTML | `lang="pt-BR"` e metadados de `raizes/index.html` | Média |

As notas valem somente para esta página local e o escopo de teste descrito; não foi calculada média geral.

## 4. Pontos fortes da entrega — o que manter

- **Várias operações com uma única calculadora.** O seletor conduz entre raiz, potência, produto, divisão, potência de radical e operações com radicais semelhantes. **Estado:** confirmado no código e testado no navegador.
- **Forma exata, com aproximação identificada como tal.** Por exemplo, `√2 ÷ √3` é apresentado como `1/3 · √6`, com decimal rotulado como aproximado. **Estado:** testado e confirmado.
- **Domínio real explícito.** Índices pares com radicando negativo e divisão por radicando zero são recusados com mensagens próximas aos campos; valores corrigidos voltam a calcular. **Estado:** testado e confirmado.
- **Prática e integração do caderno.** A prática apresenta questões variadas; o índice mostra Radiciação como capítulo 07 entre oito capítulos. **Estado:** confirmado no código e observado no navegador.

## 5. Problemas confirmados e correções

| Problema observado | Correção | Verificação após a correção |
|---|---|---|
| A barra do radical e o gancho SVG não coincidiam; o SVG tinha proporção diferente do espaço de layout, separando visualmente o topo da raiz. | Barra integrada à borda superior do radicando; viewBox e traçado do gancho ajustados à proporção usada pelo CSS. | Capturas do hero e do resultado `³√(−216)` mostram uma única barra contínua ligada ao gancho. |
| No laboratório, a transformação após `=` ficava em uma linha abaixo da expressão. | Expressão e transformação colocadas em uma linha flexível com quebra responsiva. | Em 1280 px e 360 px, `³√(−216) = −6` permanece alinhado na mesma linha, sem rolagem horizontal. |

## 6. Testes funcionais executados

| Caso | Entrada/ação | Resultado esperado | Resultado observado | Estado | Evidência |
|---|---|---|---|---|---|
| Cálculos matemáticos | Abrir `testes/matematica.html` | Casos válidos exatos e entradas inválidas coerentes | 18/18 passaram: 14 casos válidos e 4 inválidos | Testado e confirmado | Resumo do navegador: `18/18 testes passaram` |
| Raiz quarta | Índice 4, radicando 256 | 4 | 4 | Testado e confirmado | Valor observado no laboratório |
| Potência dentro da raiz | `√(2⁶)` | 8 | 8 | Testado e confirmado | Valor observado no laboratório |
| Raiz cúbica negativa | `³√(−216)` | −6 | −6 | Testado e confirmado | Valor observado no laboratório |
| Divisão e recuperação | `√48 ÷ √3`; divisor 0; depois 3 | 4; mensagem para zero; volta a 4 | 4; “O divisor não pode ser zero”; 4 | Testado e confirmado | Valores e mensagem observados no laboratório |
| Soma de radicais semelhantes | `√8 + √18` | 5 · √2 | 5 · √(2) | Testado e confirmado | Valor observado no laboratório |
| Radicais não semelhantes | `√2 + √3` | Mensagem explicativa, sem resposta inválida | Mensagem de que índice e radicando simplificados devem coincidir | Testado e confirmado | Erro associado ao segundo radicando |
| Divisão irracional | `√2 ÷ √3` | Forma exata equivalente e aproximação marcada | `1/3 · √(6)` e `0,816497` aproximado | Testado e confirmado | Laboratório do navegador |
| Alinhamento da notação | Selecionar `³√(−216)` e inspecionar radical, índice e transformação | Índice no canto superior esquerdo; gancho ligado à barra; igualdade após a expressão na mesma linha | Captura confirma índice 3 junto ao radical, barra contínua e `= −6` alinhado; no hero, a raiz quadrada omite índice 2 | Testado e confirmado | Capturas do radical isolado e do cartão do laboratório; bounding boxes em viewport desktop e móvel |
| Prática | Selecionar resposta para `√72` | Feedback correto e placar atualizado | “Correto!”; 1 acerto e 1 tentativa | Testado e confirmado | Texto e placar observados |
| Persistência da pontuação | Enviar erro, recarregar; depois enviar acerto e recarregar | Preservar os contadores nos dois reloads | Erro: 1 acerto/2 tentativas antes e depois; acerto: 2/3 antes e depois | Testado e confirmado | Navegador local; `localStorage` |
| Responsividade emulada | Abrir em 1280 × 800 e 360 × 800; conferir a equação do laboratório | Sem rolagem horizontal; expressão e igualdade permanecem legíveis | Desktop: `1265=1265`; móvel: `345=345` px de área útil; índice cúbico adjacente ao radical e transformação ao lado em ambos | Testado e confirmado | `documentElement.scrollWidth`, `clientWidth`, bounding boxes e captura do resultado cúbico |
| Erros JavaScript de página | Percorrer cálculos e formulários descritos | Nenhuma exceção de execução | Zero eventos `pageerror` capturados no fluxo | Testado e confirmado | Listener Playwright durante o fluxo |
| Navegação do caderno | Abrir o índice | Capítulo Radiciação listado com rota local | Radiciação aparece como capítulo 07 de 08, rota `raizes/index.html` | Observado na interface | Snapshot do navegador |

## 7. Recomendações para validar

1. **Prioridade de validação — teclado e leitor de tela:** percorrer skip link, seletor, campos, passos expansíveis e feedback do exercício com NVDA ou VoiceOver. Esperado: foco previsível, nomes e mensagens anunciados. Requer navegador interativo e leitor de tela.
2. **Prioridade de validação — recuperação da prática:** responder corretamente, usar “Tentar novamente”, conferir que as opções voltam a ficar ativas e enviar uma nova resposta; repetir com erro e “Nova questão”. Esperado: controles utilizáveis, feedback atualizado e placar coerente. O código reativa as opções; esse ciclo não foi reexecutado após o ajuste.
3. **Prioridade de validação — celular físico:** testar teclado virtual, áreas de toque e rolagem com Android/iOS. Esperado: campos editáveis sem perda de posição e sem rolagem horizontal. As larguras deste relatório são emulação, não aparelho real.
4. **Prioridade de validação — casos restantes de entrada:** testar campos vazios, texto não numérico, limites ±1.000.000, expoentes 1 e 8, índice 12 e bases negativas com índice ímpar/par nos controles da interface. O conjunto automatizado cobre parte do domínio, não todas essas combinações na UI.
5. **Prioridade de validação — navegadores e zoom:** repetir em 320 px, zoom de 200%, Firefox e Safari. Esperado: sem sobreposição ou perda de conteúdo.
6. **Quando houver publicação:** testar a URL final, HTTPS, compartilhamento e métricas LCP, INP e CLS. Não avaliados em arquivo local.

## 8. Checklist de ação para a equipe

- [ ] Executar a verificação de teclado e leitor de tela; registrar ordem de foco e anúncio dos resultados.
- [ ] Repetir os fluxos principais em um celular físico e registrar viewport, navegador e teclado virtual.
- [ ] Validar os limites ainda não exercitados na interface e acrescentar casos permanentes se forem encontrados erros.
- [ ] Após publicação, conferir metadados na URL real e medir Core Web Vitals.

## 9. Limitações e próximos passos

Esta validação é local e limitada ao navegador automatizado e às larguras emuladas de 360 e 1280 px. Ela não demonstra compatibilidade com leitor de tela, funcionamento em hardware móvel, comportamento em outros navegadores, desempenho de produção, indexação nem segurança geral. O menor próximo passo para ampliar a confiança é executar os fluxos por teclado e leitor de tela e testar os limites indicados na seção 7.
