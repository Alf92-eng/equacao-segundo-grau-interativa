# Auditoria das aulas de potenciação e trigonometria

## 1. Identificação e cobertura

- **Produto e objetivo:** duas aulas locais do Caderno de Matemática para aprender conceitos, explorar cálculos e praticar com feedback.
- **Ambiente e data:** arquivos `potenciacao/index.html` e `trigonometria/index.html`, abertos localmente no Windows em 20/09/2026. Navegador de teste: Google Chrome 153.0.8010.52 em modo headless.
- **Fontes e ferramentas:** código HTML, CSS e JavaScript; `prompt-validacao-universal-de-sites.md`; testes matemáticos das duas pastas; parser HTML da biblioteca padrão do Python; Chrome headless e protocolo de depuração do Chrome para ações, capturas e medidas de viewport.
- **Fluxos executados:** abertura, exemplos rápidos, valores válidos e inválidos, recuperação após erro, exercícios com acerto e erro, teclado no ponto móvel de trigonometria, primeiro foco por Tab e alternância do modo de toque. As capturas de topo, laboratório e prática foram feitas em viewports de **360 × 800** e **1280 × 800** pixels. O navegador foi emulado; não se tratou de aparelho físico.
- **Fora do alcance:** leitor de tela, dispositivo de toque físico, Firefox/Safari, rede de produção, métricas reais de desempenho, indexação em buscadores e segurança de servidor. Não há autenticação nem transações nestas páginas.

## 2. Veredito geral do produto

**No escopo testado**, os cálculos e os fluxos principais das duas aulas funcionaram. Os casos matemáticos passaram (24/24 em potenciação e 6/6 em trigonometria), os formulários deram retorno a entradas inválidas e as capturas de 360 e 1280 pixels não mostraram rolagem horizontal. A revisão levou a ajustes nas explicações de expoentes, na aceitação do sinal de menos exibido na aula, na leitura do feedback, na descrição da ilustração e na apresentação de aproximações trigonométricas. A próxima validação prioritária é usar leitor de tela e toque em aparelho físico. **Confiança geral: média**, limitada aos navegadores e fluxos descritos.

## 3. Sumário de avaliação por pilar

| Pilar | Nota | Estado resumido | Evidência principal | Confiança |
|---|---:|---|---|---|
| Conteúdo e didática | 4/5 | Sequência de conceitos, laboratório e prática; explicações ajustadas | Código das aulas; 24/24 e 6/6 testes matemáticos | Média |
| UX/UI | 4/5 | Hierarquia e instruções legíveis nas capturas avaliadas | Capturas `*-360-*-cdp.png` e `*-1280-*-cdp.png` da sessão | Média |
| Interatividade | 4/5 | Exemplos, exercícios, retorno de erro e ponto móvel responderam aos testes | Matriz funcional abaixo | Média |
| Acessibilidade | Sem nota — evidência insuficiente | Rótulos, skip link, estados e descrição SVG presentes; cobertura manual incompleta | Primeiro Tab chegou a “Pular para o conteúdo” nas duas páginas; inspeção do código | Baixa |
| Responsividade/mobile | 4/5 | Sem rolagem horizontal nas duas larguras emuladas | `innerWidth=360` e `documentElement.scrollWidth=360` em ambas | Média |
| Formulários e entradas | 4/5 | Limites, divisão por zero, erro e recuperação responderam aos casos executados | Matriz funcional abaixo | Média |
| Qualidade técnica do front-end | 4/5 | Referências locais íntegras e sem erro capturado no carregamento | Parser HTML; zero eventos `Runtime.exceptionThrown`, `Network.loadingFailed` ou `Log.entryAdded` no carregamento | Média |
| Desempenho | Sem nota — evidência insuficiente | Não houve medição confiável de Core Web Vitals | Nenhuma medição de LCP, INP ou CLS | Baixa |
| Segurança básica do front-end | Sem nota — evidência insuficiente | Escopo local não permite concluir segurança geral | Inspeção parcial do código, sem teste de segurança abrangente | Baixa |
| SEO básico | 4/5 | Título, descrição, idioma e títulos principais encontrados | `index.html` de ambas as aulas | Média |

As notas se referem apenas ao escopo testado; não foi calculada média geral. A escala e os estados de evidência seguem o arquivo de validação universal.

## 4. Pontos fortes da entrega — o que manter

- **Aprendizagem em etapas:** cada aula apresenta conceito, exploração, exemplos e prática com pistas. Isso permite conferir a regra antes de responder. **Estado:** confirmado no código de ambos os `index.html` e observado nas capturas.
- **Casos matemáticos especiais tratados:** a potenciação distingue `0⁰`, expoente negativo com base zero e denominador zero; a trigonometria limita o triângulo a ângulos agudos e explica os extremos da tabela. **Estado:** testado nos testes matemáticos e nos formulários.
- **Alternativas ao arraste:** em trigonometria, campos, controle de faixa e setas do teclado permitem mudar o ângulo; o SVG tem descrição textual atualizada. **Estado:** confirmado no código e mudança por seta testada no Chrome.

## 5. Problemas confirmados e oportunidades de melhoria

Os itens abaixo foram **resolvidos nesta auditoria**. A versão anterior não foi executada no navegador antes dos ajustes; as condições anteriores vieram da revisão do código. Não foi confirmado defeito aberto nos fluxos executados.

**[POT-01] Aceitar o sinal de menos usado pela própria aula**  
**Pilar:** Formulários · **Severidade original:** média · **Estado original:** confirmado no código · **Prioridade sugerida:** P1 · **Situação:** resolvido.

- **Onde:** `potenciacao/script.js`, função `parseAnswer`.
- **Evidência:** o parser agora converte `−` em `-` antes de avaliar a resposta. O teste automatizado respondeu `−8` na questão de base negativa e recebeu “Correto!”.
- **Esperado x observado antes da correção:** não testado no navegador da versão anterior.
- **Impacto:** copiar o sinal mostrado na expressão poderia impedir um acerto legítimo.
- **Correção e verificação:** normalização do caractere; caso permanente em `potenciacao/testes/matematica.html` e teste funcional no Chrome.

**[POT-02] Explicar expoentes zero e negativos conforme a operação**  
**Pilar:** Conteúdo e didática · **Severidade original:** média · **Estado original:** confirmado no código · **Prioridade sugerida:** P1 · **Situação:** resolvido.

- **Onde:** `potenciacao/script.js`, ramos de divisão e potência de potência.
- **Evidência:** a explicação da divisão trata separadamente inversos e expoente zero; o mapa da potência de potência diz “inverso” quando o expoente externo é negativo, em vez de apresentar grupos negativos. Os novos casos matemáticos cobrem expoentes zero e negativos.
- **Esperado x observado antes da correção:** não testado no navegador da versão anterior.
- **Impacto:** texto impreciso poderia ensinar uma interpretação errada mesmo com resultado numérico correto.
- **Correção e verificação:** 24/24 testes matemáticos passaram no Chrome headless, incluindo os novos casos e as explicações.

**[POT-03] Separar o título da pista no feedback**  
**Pilar:** UX/UI e acessibilidade · **Severidade:** baixa · **Estado:** testado e confirmado · **Prioridade sugerida:** P2 · **Situação:** resolvido.

- **Onde:** `potenciacao/script.js`, função `giveFeedback`.
- **Como reproduzir antes da correção:** enviar uma resposta correta ou incorreta no exercício e ler o `textContent` do retorno.
- **Esperado x observado:** esperava-se um espaço entre o título e a explicação; o teste retornou `Correto!A transformação...`. O espaço foi incluído entre os elementos HTML.
- **Impacto:** a frase ficava unida para leitura por tecnologia assistiva ou extração de texto.
- **Como verificar a correção:** repetir o exercício; o texto deve começar com `Correto! A transformação...`.

**[POT-04 / TRI-01] Descrições e notação matemática mais claras**  
**Pilar:** Acessibilidade e conteúdo · **Severidade sugerida:** baixa · **Estado:** confirmado no código e testado após o ajuste · **Prioridade sugerida:** P2 · **Situação:** resolvido.

- **Onde:** `potenciacao/index.html` (`role="img"` e descrição da ilustração); `trigonometria/script.js` (relações numéricas e sinal de aproximação).
- **Evidência:** a ilustração de potenciação tem nome acessível explícito. Em trigonometria a conta de 45° aparece como `10 × sen 45° ≈ 7,07`, e as razões mantêm `≈` quando os valores exibidos foram arredondados.
- **Esperado x observado antes da correção:** não testado no navegador da versão anterior.
- **Impacto:** melhora a interpretação da ilustração e evita apresentar arredondamento como igualdade exata.
- **Como verificar a correção:** inspecionar a descrição da imagem na árvore de acessibilidade e selecionar 45° no laboratório de trigonometria.

## 6. Testes funcionais executados

| Caso | Entrada/ação | Esperado | Observado | Estado |
|---|---|---|---|---|
| Potenciação: caminho principal | Abrir e escolher `2⁻²` | Resultado inicial 32 e depois 1/4 | `32` e `1/4` | Testado e confirmado |
| Potenciação: entrada inválida e recuperação | Base `abc`, depois `2` | Mensagem próxima ao campo e retorno ao cálculo | Mensagem para inteiro; voltou a `32` | Testado e confirmado |
| Potenciação: limites de domínio | `0⁻¹`; quociente com `b=0`; depois `b=2` | Bloquear valores indefinidos e recuperar | Exibiu `—` e mensagens específicas; depois `4` | Testado e confirmado |
| Potenciação: prática | Respostas `32` e `−8` com propriedade correta | Aceitar ambas | “Correto!” em ambas | Testado e confirmado |
| Trigonometria: caminho principal | Abrir e escolher 45° | `sen 30°=0,5`; `sen 45°≈0,7071` | Valores exibidos conforme esperado | Testado e confirmado |
| Trigonometria: entrada inválida e recuperação | Ângulo `90`, depois 45; entrada `0x10` | Erro de intervalo/formato, sem resultado inválido, e recuperação | Mensagens específicas, resultado oculto no erro, recuperação em 45° | Testado e confirmado |
| Trigonometria: extremos | `0,1°` com H=`0,01`; `89,9°` com H=`10000` | Valores finitos | `sen≈0,0017` e `tg≈572,9572` | Testado e confirmado |
| Trigonometria: prática | `0` incorreto, depois `3/5`, `4/5`, `3/4`; também `3/0` | Pista, acerto e recusa de divisão por zero | Pista para seno; acerto; placar 1 acerto e 2 tentativas; `3/0` recebeu pista | Testado e confirmado |
| Teclado e foco | Primeiro Tab; seta direita no ponto móvel | Skip link em foco; ângulo +1° | Skip link em ambas; ângulo 30→31 e `aria-valuenow=31` | Testado e confirmado |
| Responsividade | Renderizar a 360 e 1280 px | Sem rolagem horizontal indevida | Em 360 px, largura rolável de 360 px nas duas páginas; capturas inspecionadas | Testado e confirmado |
| Testes matemáticos | Abrir as duas páginas de testes | Todos os casos passam | Potenciação 24/24; trigonometria 6/6 | Testado e confirmado |

Todos os testes funcionais acima usaram arquivos locais no Chrome headless. A inspeção visual das capturas foi feita pelo auditor; não houve sessão manual em aparelho físico.

## 7. Recomendações para validar

1. **P1 — Leitor de tela e teclado completo.** Percorrer os formulários, o SVG e as mensagens de erro com NVDA ou VoiceOver; confirmar nome, ordem, foco e anúncio do feedback. Requer leitor de tela e navegador interativo.
2. **P1 — Toque em aparelho físico.** Arrastar o ponto da trigonometria, alternar “Ativar arraste”/“Voltar a rolar” e preencher os campos com teclado virtual. Esperado: nenhum bloqueio de rolagem ou perda de valor. Requer telefone ou tablet real.
3. **P2 — Zoom e navegador adicional.** Verificar 200% de zoom, viewport de 320 px, Firefox e Safari. Esperado: texto e controles legíveis, acessíveis e sem sobreposição. Requer esses navegadores.
4. **P2 — Publicação e desempenho.** Quando houver URL publicada, medir LCP, INP e CLS, verificar HTTPS, canonical e indexação conforme o objetivo de publicação. Requer ambiente de produção ou homologação.

## 8. Checklist de ação para a equipe

- [ ] Executar a validação de leitor de tela e teclado completo nas duas aulas; registrar foco, anúncio dos erros e resultado de cada fluxo (recomendação 1).
- [ ] Testar o arraste e a edição por toque em aparelho físico; registrar rolagem e resposta dos controles (recomendação 2).
- [ ] Revisar 320 px, zoom de 200% e Firefox/Safari; corrigir apenas problemas reproduzidos (recomendação 3).
- [ ] Após publicar, medir desempenho e revisar metadados/HTTPS na URL real (recomendação 4).

## 9. Limitações e próximos passos

As conclusões se limitam aos arquivos locais e ao Chrome 153 automatizado. O carregamento não gerou eventos de exceção ou falha de rede na sessão observada; isso não demonstra ausência de erro em todos os navegadores ou interações. A menor etapa adicional para aumentar a confiança é executar as recomendações 1 e 2 e registrar os resultados. As notas acima não representam aparelho físico, leitor de tela nem ambiente publicado. As pastas das duas aulas e este relatório aparecem como arquivos ainda não rastreados pelo Git; nenhuma versão foi registrada nesta auditoria.
