# Validação de produto — aula de Conjuntos numéricos

## 1. Identificação e cobertura

- **Produto:** Matemática em Ação — aula interativa de Conjuntos numéricos.
- **URL/ambiente:** arquivo local `conjuntos-numericos/index.html`, ambiente de desenvolvimento.
- **Data:** 04/10/2026.
- **Objetivo:** ensinar estudantes a reconhecer os conjuntos dos naturais, inteiros, racionais, irracionais e reais, compreender inclusões e classificar números. Público-alvo de ensino fundamental/médio é uma premissa, conforme o modelo do projeto.
- **Fontes:** arquivos `index.html`, `style.css`, `script.js`, `README.md` e `testes/matematica.html` desta aula; índice inicial e navegação do projeto; `MODELO_PAGINA_MATEMATICA.md`; `prompt-validacao-universal-de-sites.md`.
- **Pesquisa externa:** não realizada; foram usados conceitos matemáticos elementares (definições de conjuntos numéricos e propriedades de decimais/radicais) e os exemplos foram verificados em testes locais.
- **Ferramentas usadas:** navegador integrado ao VS Code para abrir o arquivo local, ler a interface e executar interações; teste HTML/JavaScript local para verificar casos de pertinência. O nome e a versão do navegador não foram expostos.
- **Páginas e fluxos avaliados:** aula de Conjuntos numéricos; abertura do índice da home para observar a entrada da nova aula; classificação de √2, consulta da pertinência em ℕ e prática de uma resposta incorreta seguida de uma correta e avanço de questão.
- **Viewport:** largura móvel solicitada de 375 px, altura 844 px, emulada no navegador. `clientWidth`/`scrollWidth` observados foram 360/360 px; a diferença para a largura solicitada é compatível com a área reservada pela barra vertical do navegador. Não houve aparelho físico.
- **Fora do alcance:** leitor de tela, aparelho físico, outros navegadores, navegação completa por teclado, zoom de texto a 200%, contraste automatizado, medição de desempenho, rede de produção e segurança de servidor/API. Não foi feito monitoramento sistemático do console.

## 2. Veredito geral do produto

No escopo exercitado, a página comunica a hierarquia ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ, separa os irracionais dos racionais e explicita a convenção de incluir zero em ℕ. A classificação de √2, a consulta de pertinência em ℕ e o exercício com erro/acerto apresentaram os resultados esperados. O teste matemático local passou em 11/11 verificações e a largura emulada de 375 px não apresentou rolagem horizontal. Não foi confirmado defeito nos fluxos executados. A confiança é **média**, pois os testes funcionais cobrem apenas parte da aula e não incluem leitor de tela, aparelho físico ou navegação completa por teclado.

## 3. Sumário de avaliação por pilar

| Pilar | Nota 1–5 / N/A / sem nota | Estado resumido | Evidência principal | Confiança |
|---|---:|---|---|---|
| Conteúdo e didática | 4/5 | Sequência de definição, hierarquia, exemplos e prática; zero explicitamente convencionado | Conteúdo e exemplos no HTML/JS; 11/11 testes matemáticos | Média |
| UX/UI | 4/5 | Etapas, exemplos, classificação e prática apresentados em sequência compreensível | Interface aberta no navegador e fluxos principais executados | Média |
| Interatividade | 4/5 | Seleção de exemplo, consulta de pertinência, passos, exercícios e pontuação | Resultado de √2, retorno da consulta e feedback de exercício observados | Média |
| Acessibilidade | Sem nota — evidência insuficiente | Labels, textos alternativos, status e foco visível estão no código; teclado/leitor de tela não foram validados | Inspeção dos atributos HTML/CSS | Baixa |
| Responsividade/mobile | 4/5 | Sem rolagem horizontal no viewport estreito testado | Emulação solicitada de 375 px; `scrollWidth` coincidiu com `clientWidth` (360 px) | Média |
| Formulários e entradas | 4/5 | Controles limitados a exemplos válidos; entrada de exercício aceita letras dos conjuntos | Consulta e respostas Q/N exercitadas | Média |
| Qualidade técnica do front-end | 4/5 | Página executou e a bateria matemática terminou sem falhas | `testes/matematica.html`: 11/11 | Média |
| Desempenho | Sem nota — evidência insuficiente | Não medido com ferramenta apropriada | Sem dados de LCP, INP, CLS ou perfil | Baixa |
| Segurança básica do front-end | Sem nota — evidência insuficiente | Inspeção limitada a uma página estática; sem teste de segurança abrangente | Código local; APIs/servidor fora do escopo | Baixa |
| SEO básico | 4/5 | Idioma, título, descrição e hierarquia de títulos presentes no código | `index.html` da aula | Média |

Não foi calculada nota geral: não há evidência suficiente para pontuar todos os pilares.

## 4. Pontos fortes da entrega — o que manter

- **Convenção de ℕ visível:** a aula informa que `0 ∈ ℕ` e alerta que a convenção pode variar. Isso evita que uma diferença entre materiais seja confundida com erro do estudante. **Evidência:** nota conceitual, classificação do zero e caso de teste. **Estado:** confirmado no código e verificado matematicamente.
- **Classificação exata separada da aproximação:** √2 e π mantêm suas formas exatas; a reta usa aproximação e a interface informa esse limite. **Evidência:** ao selecionar √2, a classificação mostrou `𝕀` e `ℝ`, e a descrição da reta informou aproximadamente 1,4142. **Estado:** testado e confirmado.
- **Pertinência e menor conjunto não se confundem:** o laboratório exibe todos os conjuntos do exemplo e destaca o menor; o controle de consulta responde se o número pertence ao conjunto escolhido. **Evidência:** √2 identificado como irracional e resposta negativa para ℕ. **Estado:** testado e confirmado.
- **Feedback de prática orienta sem revelar a resposta logo após erro:** a tentativa incorreta fornece uma pista, e a correta confirma o menor conjunto. **Evidência:** respostas `Q` e `N` para o exercício inicial sobre 8. **Estado:** testado e confirmado.

## 5. Problemas confirmados e oportunidades de melhoria

**Nenhum problema confirmado na nova aula durante os fluxos exercitados.** Os itens abaixo são validações pendentes, não defeitos constatados.

## 6. Testes funcionais executados

| Caso | Entrada/ação | Resultado esperado | Resultado observado | Estado | Evidência |
|---|---|---|---|---|---|
| Bateria matemática | Dez consultas de pertinência, incluindo zero, inteiro, fração, decimal finito, dízima, raiz exata, √2, π e casos negativos; mais exemplo desconhecido | Relações de pertinência corretas e erro explícito para ID inválido | 11 de 11 passaram | Testado e confirmado | `testes/matematica.html`, executado no navegador |
| Classificação de irracional | Selecionar √2 | Menor conjunto 𝕀; pertences 𝕀 e ℝ; aproximação na reta identificada | Menor conjunto 𝕀; chips 𝕀 e ℝ; posição aproximadamente 1,4142 | Testado e confirmado | Interação na página local |
| Pertinência negativa | Selecionar ℕ para √2 e conferir | Informar que √2 não pertence a ℕ sem apagar a classificação | Retorno explicou que √2 não pertence a ℕ; classificação permaneceu visível | Testado e confirmado | Interação na página local |
| Prática — tentativa incorreta | Responder `Q` para a questão inicial sobre 8 | Mostrar pista específica sem marcar acerto | “Quase!” e pista sobre 8 ser inteiro positivo | Testado e confirmado | Feedback visível na página |
| Prática — acerto | Responder `N` para a questão inicial sobre 8 | Confirmar acerto e atualizar pontuação | “Correto!”; pontuação mostrou 1 acerto em 2 tentativas | Testado e confirmado | Interface e registro localStorage observado durante a sessão |
| Persistência da pontuação | Registrar uma tentativa incorreta, atualizar a página; depois acertar e atualizar novamente | Preservar acertos e tentativas | Após erro: 0 acertos/1 tentativa antes e depois; após acerto: 1/2 antes e depois | Testado e confirmado | Navegador local; `localStorage` |
| Nova questão | Acionar “Nova questão” | Avançar e apresentar novo enunciado | Enunciado mudou para −5 | Testado e confirmado | Interação na página local |
| Largura móvel | Abrir a aula em emulação de 375 × 844 px | Sem rolagem horizontal | `documentElement.scrollWidth` e `clientWidth` foram 360 px | Testado e confirmado | Medição no navegador integrado; emulação, não aparelho físico |
| Link no índice | Abrir a home e observar o índice | Entrada da aula com rota correta | Link “Conjuntos numéricos” apontou para `conjuntos-numericos/index.html` | Observado na interface | Snapshot do índice da home; não foi possível confirmar o clique de navegação nesta sessão |

## 7. Recomendações para validar

1. **Teclado e tecnologias assistivas:** percorrer do início ao fim com Tab/Shift+Tab, acionar exemplos, formulário, “Próximo passo”, prática e “Nova questão”; depois testar com leitor de tela. Confirmar ordem de foco, anúncio dos resultados e retorno de erro. **Por que importa:** os elementos são dinâmicos e a cobertura atual é de inspeção de código, não de tecnologia assistiva. **Ferramenta/acesso:** teclado e leitor de tela (por exemplo, NVDA).
2. **Armazenamento bloqueado:** bloquear o armazenamento e confirmar a mensagem de contingência. **Por que importa:** a restauração funciona com `localStorage`, mas sua indisponibilidade impede persistência. **Ferramenta/acesso:** navegador com armazenamento local.
3. **Responsividade adicional:** repetir a conferência em 390, 768 e 1440 px e verificar visualmente o diagrama, os textos e os controles. **Por que importa:** somente a largura estreita de 375 px foi medida. **Ferramenta/acesso:** navegador com emulação de viewport.
4. **Entradas e recuperação:** tentar campo de exercício vazio, texto inválido e nomes por extenso aceitos; limpar a resposta e avançar para outra questão após um erro. **Por que importa:** esses casos estão previstos pela interface, mas não foram executados todos. **Ferramenta/acesso:** navegador.
5. **Integração da home:** clicar no item 06 e verificar se a URL final abre a aula local. **Por que importa:** o snapshot confirmou o destino textual, mas a navegação por clique não foi concluída. **Ferramenta/acesso:** navegador local.
6. **Desempenho, contraste e SEO publicado:** medir com ferramenta adequada em ambiente publicado, caso a página venha a ser implantada. **Por que importa:** uma abertura local não representa rede ou métricas de campo. **Ferramenta/acesso:** URL de publicação e Lighthouse ou ferramenta equivalente.

## 8. Checklist de ação para a equipe

- [ ] Validar navegação completa por teclado e leitor de tela; critério de pronto: todos os controles operáveis e resultados/erros anunciados na ordem esperada.
- [x] Confirmar restauração dos acertos e tentativas após recarga; critério de pronto: contadores restaurados após resposta errada e correta.
- [ ] Confirmar contingência quando o armazenamento está bloqueado; critério de pronto: mensagem clara sem interromper a aula.
- [ ] Repetir medidas nos viewports de 390, 768 e 1440 px; critério de pronto: sem conteúdo cortado nem rolagem horizontal.
- [ ] Completar os casos de entrada vazia/inválida e recuperação; critério de pronto: feedback específico e estado anterior preservado quando pertinente.
- [ ] Confirmar o clique no link da home; critério de pronto: rota local abre a página Conjuntos numéricos.
- [ ] Se houver publicação, executar medição de desempenho/contraste e revisar SEO no endereço publicado; critério de pronto: relatório com ferramenta, ambiente e métricas registradas.

## 9. Limitações e próximos passos

Os resultados valem somente para os arquivos locais e os fluxos indicados. A página não foi publicada; não houve aparelho físico, leitor de tela, navegação completa por teclado, ferramentas de desempenho/contraste ou teste abrangente de segurança. O navegador integrado não expôs sua versão; embora o destino do link apareça no índice, a interação automatizada com a capa/índice não ficou acionável nesta sessão e o clique no destino não foi confirmado. O próximo conjunto mínimo de validação é teclado/leitor de tela, armazenamento bloqueado, viewports de tablet/desktop e clique no índice.
