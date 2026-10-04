# Validação — Conversor de Medidas

## 1. Identificação e cobertura

- **Produto:** Conversor de Medidas do Caderno de Matemática.
- **Ambiente:** arquivos locais em `conversao/index.html`; avaliação em 03/10/2026.
- **Objetivo e público:** apoiar estudantes a converter medidas e entender as relações entre unidades.
- **Fontes examinadas:** código final, imagem anexada com as categorias, infográfico local `conversão.jpeg`, auditoria, modelo de página, prompt universal de validação e orientações UI/UX do projeto.
- **Ferramentas:** navegador integrado Chromium, testes matemáticos locais e diagnóstico de problemas do editor.
- **Fluxos e larguras:** seleção e conversão nas 13 categorias; taxa cambial online e manual; erro e recuperação; exercício; teclado; larguras de viewport 320, 375, 768, 1024 e 1440 px.
- **Limitações:** não foram usados aparelho físico, leitor de tela, outros navegadores, Lighthouse ou ambiente publicado. A falha/offline do serviço cambial não foi simulada. A checagem de código não é auditoria abrangente de segurança.

## 2. Veredito geral do produto

**No escopo testado**, os cálculos das categorias, o retorno de erros, a troca de unidades e o exercício funcionaram. A cotação de referência USD/BRL foi carregada pela API e a taxa manual também produziu o resultado esperado. Os testes funcionais passaram e as larguras inspecionadas não apresentaram rolagem horizontal. Permanecem pendentes testes com leitor de tela, aparelho físico, navegadores adicionais e indisponibilidade de rede cambial. **Confiança geral: média**, limitada ao navegador e às ações executadas.

## 3. Sumário de avaliação por pilar

| Pilar | Nota / estado | Evidência principal | Confiança |
|---|---|---|---|
| Conteúdo e didática | 4/5 | Categorias, regras, exemplos, etapas e pistas observados no código e no navegador | Média |
| UX/UI | 4/5 | Captura de desktop; controles e categorias operáveis nos fluxos executados | Média |
| Interatividade | 4/5 | Conversões nas 13 categorias, câmbio, troca de unidades e exercício executados | Média |
| Acessibilidade | Sem nota — evidência insuficiente | Semântica e foco inicial verificados; leitor de tela não testado | Baixa |
| Responsividade/mobile | 4/5 | `scrollWidth` igual a `clientWidth` em cinco larguras | Média |
| Formulários e entradas | 4/5 | Decimal com vírgula, texto inválido, recuperação e limite de temperatura testados | Média |
| Qualidade técnica | 4/5 | 23/23 testes matemáticos; diagnóstico do editor sem problemas | Média |
| Desempenho | Sem nota — evidência insuficiente | Nenhuma métrica de desempenho coletada | Baixa |
| Segurança básica do front-end | Sem nota — evidência insuficiente | Inspeção funcional limitada; sem teste de segurança abrangente | Baixa |
| SEO básico | 4/5 | Idioma, título, descrição e hierarquia principal presentes no HTML | Média |

## 4. Pontos fortes — o que manter

- **Treze grandezas alinhadas à referência:** a lista contém moeda, volume, comprimento, peso e massa, temperatura, energia, área, velocidade, tempo, potência, dados, pressão e ângulo. **Estado:** confirmado no código e observado no navegador.
- **Escalas visuais complementares:** as escadas de comprimento, área, volume, massa e capacidade explicam os fatores de 10, 100 e 1.000. **Estado:** confirmado no código.
- **Caminho de conversão explicado:** resultado, unidade de referência e fórmula especial de temperatura são apresentados em etapas. **Estado:** observado no navegador.
- **Alternativa para moeda sem cotação automática:** a taxa pode ser informada manualmente; o resultado distingue a taxa de câmbio da conversão fixa entre unidades. **Estado:** testado com taxa manual.
- **Acesso por teclado e layout adaptável:** o primeiro Tab chega ao link de salto e as larguras verificadas não exibiram rolagem horizontal. **Estado:** testado no navegador.

## 5. Problemas confirmados e oportunidades de melhoria

Não foi confirmado defeito funcional nos fluxos executados. As verificações ainda pendentes estão listadas na seção 7; não são falhas comprovadas.

## 6. Testes funcionais executados

| Caso | Entrada/ação | Esperado | Observado | Estado |
|---|---|---|---|---|
| Suíte matemática | Abrir `testes/conversoes.html` | Todos os cálculos e validações aprovados | 23 de 23 testes passaram | Testado e confirmado |
| Comprimento | 2,5 m para cm | 250 cm | 250 cm | Testado e confirmado |
| Volume/capacidade | 1 L para mL | 1.000 mL | 1.000 mL | Testado e confirmado |
| Temperatura | 25 °C para °F | 77 °F | 77 °F | Testado e confirmado |
| Temperatura entre escalas | 273,15 K para °F; 25 °C para K | 32 °F; 298,15 K | Resultados numéricos passaram e as etapas K→°F foram verificadas no navegador | Testado e confirmado |
| Massa | 1 kg para g | 1.000 g | 1.000 g | Testado e confirmado |
| Energia | 1 kWh para J | 3.600.000 J | 3.600.000 J | Testado e confirmado |
| Área | 1 m² para cm² | 10.000 cm² | 10.000 cm² | Testado e confirmado |
| Velocidade | 1 km/h para m/s | Aproximadamente 0,277777… m/s | `≈ 0,277777777778 m/s` | Testado e confirmado |
| Tempo e potência | 1 h para min; 1 kW para W | 60 min; 1.000 W | Resultados conforme esperado | Testado e confirmado |
| Dados, pressão e ângulo | 1 GB para GiB; 1 atm para kPa; 1° para rad | Relações decimais/binárias e conversões correspondentes | Resultados exibidos, com aproximação indicada quando necessária | Testado e confirmado |
| Moeda online | USD para BRL | Aplicar taxa retornada pela API e informar a data | Frankfurter retornou taxa 5,2214 em 02/10/2026 | Testado e confirmado |
| Moeda manual | 2 USD com taxa informada 5,5 BRL/USD | 11 BRL | 11 R$ | Testado e confirmado |
| Entrada inválida e recuperação | Digitar `abc`, depois `2,5` m para cm | Mensagem clara; recuperar ao corrigir | Mensagem apresentada; resultado voltou a 250 cm | Testado e confirmado |
| Limite físico | −300 °C para °F | Recusar valor abaixo do zero absoluto | Mensagem específica sobre −273,15 °C | Testado e confirmado |
| Exercício | Resposta errada e correta; avançar questão | Pista, acerto e nova questão sem pista antiga | Pista específica, confirmação e próxima questão | Testado e confirmado |
| Foco inicial | Pressionar Tab ao abrir | Focar “Pular para o conteúdo” | Link de salto recebeu foco | Testado e confirmado |
| Responsividade | Viewports 320, 375, 768, 1024 e 1440 px | Sem rolagem horizontal | `scrollWidth` igual a `clientWidth` em todas as larguras | Testado e confirmado |
| Erros de execução | Interagir com as categorias | Nenhuma exceção JavaScript | Nenhum erro de página capturado durante a interação | Testado e confirmado |

## 7. Recomendações para validar

1. **P1 — Leitor de tela:** percorrer navegação, campos, mensagens de erro, etapas e exercício com NVDA ou VoiceOver; confirmar ordem, nomes e anúncios.
2. **P1 — Câmbio sem rede:** bloquear a API e verificar a mensagem de falha, o preenchimento manual e a recuperação após nova tentativa.
3. **P2 — Dispositivo físico e navegadores adicionais:** testar toque, teclado virtual e rolagem em telefone; repetir em Firefox e Safari.
4. **P2 — Zoom e acessibilidade visual:** verificar ampliação de 200%, escala de texto e contraste por ferramenta apropriada.
5. **P2 — Produção:** se a página for publicada, testar a URL final, HTTPS, metadados de compartilhamento e métricas Core Web Vitals.

## 8. Checklist de ação

- [ ] Executar a navegação completa com leitor de tela e registrar nome, ordem de foco e anúncio de feedback (recomendação 1).
- [ ] Repetir busca e conversão de moeda com rede indisponível; confirmar o caminho manual (recomendação 2).
- [ ] Testar toque, zoom de texto e navegadores adicionais antes da publicação (recomendações 3 e 4).
- [ ] Se publicar, verificar a URL final, HTTPS e desempenho com ferramentas próprias (recomendação 5).

## 9. Limitações e próximos passos

As conclusões valem para os arquivos locais e as ações executadas no navegador integrado. A ausência de erro observado não demonstra acessibilidade completa, compatibilidade universal, segurança do sistema ou desempenho de produção. Para elevar a confiança, os próximos testes prioritários são leitor de tela e falha simulada da API cambial.
