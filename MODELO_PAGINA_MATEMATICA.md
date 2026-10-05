# Modelo para criar páginas interativas de Matemática

**Como usar:** substitua somente a linha `TEMA` abaixo e envie o conteúdo deste arquivo ao assistente que fará a página. Os demais campos são opcionais. Se você informar apenas o tema, o assistente deve tomar decisões didáticas razoáveis e entregar uma página completa, sem interromper o trabalho para pedir detalhes secundários.

---

## Dados da nova página

**TEMA: [COLE AQUI O TEMA MATEMÁTICO]**

- Público-alvo (opcional): estudantes do ensino fundamental ou médio, conforme o tema.
- Objetivo específico (opcional): o que o aluno deve conseguir fazer ao final.
- Exemplos que precisam aparecer (opcional): equações, números, figuras ou situações desejadas.
- Local do projeto (opcional): pasta ou repositório onde a página será criada.
- Publicação (opcional): peça explicitamente se quiser publicar ou atualizar uma hospedagem.

---

## Instrução principal

Atue como engenheiro Front-End sênior e designer de experiências educacionais. Crie uma **pequena aplicação web de Matemática**, pronta para estudantes, sobre o tema informado. Ela deve ensinar por meio de explicações claras, exemplos resolvidos, manipulação visual e prática com feedback. Não entregue apenas uma página estática com fórmulas.

Use a página “Matemática Interativa — Equação do 2º Grau” como referência de **qualidade e comportamento**, não como conteúdo a ser copiado literalmente. Adapte a matemática, as interações e as visualizações ao novo tema. Uma parábola, por exemplo, só faz sentido quando o assunto realmente a exige.

### 1. Escopo e tecnologia

- Use HTML5, CSS3 e JavaScript Vanilla. Prefira um projeto que funcione abrindo `index.html` no navegador, sem instalação, build, servidor ou cadastro.
- Organize em `index.html`, `style.css`, `script.js` e `README.md`. Não concentre todo o CSS ou JavaScript no HTML.
- Não use React, Bootstrap ou frameworks por padrão. Uma biblioteca externa só deve entrar se houver ganho claro que não possa ser obtido com simplicidade em JavaScript puro; nesse caso, justifique e garanta que o site continue fácil de executar.
- Se o trabalho ocorrer dentro de um projeto existente, preserve os arquivos e alterações alheias ao tema. Uma nova página não deve sobrescrever a página atual sem pedido explícito.
- Interface, explicações, exemplos, mensagens de erro e README devem estar em português do Brasil.

### 2. Planejamento didático antes de codificar

1. Defina de 3 a 6 objetivos de aprendizagem mensuráveis: identificar, calcular, interpretar, visualizar e aplicar o conceito.
2. Escolha uma sequência curta que vá do intuitivo ao formal: **o que é → elementos → exemplo guiado → experimente → interpretação visual → pratique → resumo**.
3. Selecione ao menos um exemplo inicial simples, verificável mentalmente ou por substituição, e casos adicionais que mostrem comportamentos diferentes do tema.
4. Identifique pré-requisitos e explique termos novos com frases curtas, tooltips acessíveis ou notas contextuais.
5. Defina a visualização mais útil para o assunto: plano cartesiano, reta numérica, barras de frações, formas geométricas, tabela, árvore de possibilidades, animação de transformação ou outra representação pertinente.
6. Se o tema tiver exceções, domínios proibidos ou resultados inexistentes, mostre-os de maneira pedagógica. Nunca esconda um caso difícil apenas para a demonstração parecer funcionar.

### 3. Estrutura da página

Crie, na ordem que fizer sentido para o tema:

1. Cabeçalho com marca textual, título do tema, subtítulo objetivo e navegação/progresso entre etapas.
2. Hero que explique em uma frase o que o aluno aprenderá e ofereça um caminho óbvio para começar.
3. Conceito central com fórmula, definição ou representação visual legível.
4. Explicação dos símbolos, termos e parâmetros em cards curtos.
5. Laboratório ou calculadora com campos grandes, rótulos claros e resultado atualizado em tempo real quando válido.
6. Botão de calcular/aplicar quando uma ação explícita ajudar a organizar o raciocínio.
7. Resolução **linha por linha**, incluindo substituição dos valores, operações intermediárias, interpretação e conclusão. Use cards numerados expansíveis (`<details>`/`<summary>` quando adequado) e um botão “Próximo passo”.
8. Resultado destacado com significado em linguagem comum, não apenas um número.
9. Visualização interativa sincronizada com os dados e uma descrição textual equivalente.
10. Exemplos rápidos que preencham os controles e mostrem resultados distintos.
11. “Agora é sua vez”: exercícios gerados ou selecionados, verificação e pistas específicas.
12. “Guarde isso”: resumo compacto das ideias e fórmulas principais.

Se alguma seção não for pertinente ao tema, substitua-a por uma experiência equivalente que ensine melhor. Não crie seções vazias só para cumprir a lista.

### 4. Interatividade que realmente ensina

- Mantenha **uma única fonte de verdade** para os valores do problema. Campos, fórmula exibida, resolução, indicadores e visualização devem usar os mesmos dados.
- Quando fizer sentido, permita interação nos dois sentidos: alterar campos muda a figura; manipular a figura atualiza os campos e a expressão matemática.
- Se houver entrada textual de expressão, aceite formas usuais para estudantes, mostre exemplos de sintaxe e apresente erro claro quando a expressão não puder ser interpretada. Nunca execute texto digitado como código.
- Desenhe com SVG ou Canvas puro. Inclua eixos, grade, escala, pontos e legendas somente quando forem úteis ao tema. A visualização deve se adaptar ao tamanho da tela e ao intervalo dos dados.
- Para gráficos ou construções arrastáveis: preserve a correspondência entre coordenadas da tela e valores matemáticos em qualquer zoom; não permita que a edição “trave” em casos-limite; ofereça uma maneira natural de voltar atrás.
- Para visualizações com zoom: inclua botões `+`, `−` e “Centralizar”; permita roda do mouse no computador e movimento do plano quando pertinente. Não coloque uma barra de zoom que ocupe espaço se botões e gestos forem mais claros.
- Não faça o gráfico capturar gestos de rolagem do celular sem intenção. No toque, a rolagem da página deve ser o padrão; para editar a figura com o dedo, ofereça uma ativação explícita e uma ação visível para voltar a rolar.
- Mantenha alternativa por campos e teclado para qualquer interação que dependa de arrastar pontos.
- Use microinterações discretas para indicar atualização, abertura de cards, seleção de exemplo e acerto. Evite animações longas ou decorativas que atrapalhem a leitura.

### 5. Leitura e navegação no celular

- Trabalhe de forma responsiva, começando pelo celular quando conveniente. Teste pelo menos uma largura estreita (aproximadamente 375–390 px), tablet e desktop.
- Organize os conteúdos em **blocos de foco**. No celular, use pontos de parada suaves entre seções, por exemplo `scroll-snap-type: y proximity`, sem rolagem obrigatória que prenda o aluno em uma seção longa.
- Mantenha uma navegação de etapas compacta e visível. Ajuste o deslocamento dos links internos à altura real do cabeçalho fixo.
- Cards e campos devem empilhar em uma coluna quando o espaço exigir. Fórmulas não podem ficar ilegíveis, cortadas ou causar rolagem horizontal.
- Botões e controles de toque devem ter área confortável, em torno de 44 × 44 px ou maior, com espaço entre alvos.
- Se a pessoa pediu redução de movimento no sistema, desative rolagem suave, encaixe de seções e animações não essenciais.
- Não use `overflow-x: hidden` como substituto para corrigir um elemento que realmente ultrapassa a largura da tela; encontre e corrija a causa.

### 6. Design visual

- Mantenha o clima de **caderno/folha de estudos**: fundo claro, linhas discretas, cards brancos, bordas arredondadas, sombra muito suave e destaques contidos em verde. Use azul discreto para interações.
- Priorize hierarquia tipográfica, espaço em branco e leitura. Títulos grandes devem continuar proporcionais ao card e ao celular; não deixe fontes gigantes quebrarem o layout.
- Defina em `:root` variáveis para cores, fontes, espaçamentos, raios e sombras. Use estilos consistentes para botões, campos, avisos, fórmulas, cards e estados de foco.
- Cores devem reforçar significados, nunca ser a única forma de transmitir uma condição. Combine cor com texto, símbolos ou ícones.
- Não copie marcas, nomes, logotipos ou interface de redes sociais presentes em imagens de referência. Use referências apenas para direção estética e didática.

### 7. Matemática, validação e precisão

- Verifique as fórmulas e exemplos antes de implementar. Defina claramente domínio, unidades, restrições e casos especiais próprios do tema.
- Valide campos vazios, texto inválido, zero quando proibido, negativos, decimais e valores muito grandes ou muito pequenos. Mostre mensagens perto do campo relevante e preserve os dados para correção.
- Não exiba `NaN`, `undefined`, `Infinity`, divisão por zero ou raízes de números negativos como se fossem respostas reais. Explique o que ocorreu em linguagem apropriada ao aluno.
- Faça os cálculos com a precisão interna do JavaScript e **formate apenas na apresentação**. Elimine casas desnecessárias; em português, mostre vírgula decimal quando possível. Indique quando um valor é aproximado.
- Uma representação visual deve continuar correta após zoom, redimensionamento e edição. A grade, os eixos, os pontos e os valores exibidos devem permanecer sincronizados.
- Inclua ao menos três casos de teste matemático com entradas e respostas esperadas: um caso comum, um caso-limite e um caso inválido. Adapte os testes ao tema.

### 8. Prática e feedback

- Gere ou escolha exercícios compatíveis com o conteúdo já ensinado. Evite perguntas ambíguas e resultados que dependam de arredondamento não explicado.
- Separe as respostas por etapa do raciocínio quando isso fizer sentido. Ao verificar, mostre “Correto!” ou “Quase! Confira este passo”, com uma pista **específica para o primeiro erro provável**.
- Mostre pistas junto ao campo e um resumo acessível da tentativa. Limpe pistas desatualizadas quando a pessoa editar a resposta ou pedir outra questão.
- Registre acertos e tentativas somente na memória da página aberta. Não use `localStorage`, `sessionStorage`, cookies ou outro mecanismo para persistir resultados. Ao sair da página, recarregá-la ou fechá-la, zere os contadores e não restaure pontuações anteriores; se a página voltar do cache de navegação, reinicie também o estado visual do exercício.
- Ofereça “Nova questão” e uma maneira simples de tentar novamente. Não revele imediatamente toda a resposta quando uma pista permitir que o estudante raciocine.

### 9. Acessibilidade

- Use HTML semântico, ordem lógica de títulos, `<label>` para cada campo, botões reais para ações e foco de teclado bem visível.
- A navegação por etapas, cards expansíveis, exercícios e controles da visualização precisam funcionar por teclado.
- Use `aria-live` com moderação para resultados e feedback; não anuncie cada quadro de uma animação.
- Toda informação transmitida por gráfico, cor ou animação deve existir também em texto. Inclua descrição atualizada da visualização, interpretação dos resultados e legendas compreensíveis.
- Garanta contraste adequado, idioma `pt-BR`, tamanho de texto confortável e funcionamento com movimento reduzido.

### 10. Organização do JavaScript

- Separe cálculo, estado, validação, formatação, renderização, visualização e eventos em funções pequenas com nomes claros.
- Use `const` e `let`, nunca `var`. Evite repetição e comentários óbvios; comente apenas decisões difíceis, como conversão entre coordenadas e valores.
- Recalcule resultados a partir do estado validado. Evite dependência de texto já formatado para realizar novas contas.
- Se houver entrada de função ou controles visuais, mantenha um fluxo claro de atualização para evitar que um controle sobrescreva indevidamente o outro.
- Respeite desempenho em dispositivos modestos; para arraste e zoom, agrupe redesenhos com `requestAnimationFrame` quando necessário.

### 11. Verificação antes da entrega

Execute e confira, na medida do possível:

- A página abre localmente sem dependências e sem erros de JavaScript no console.
- O exemplo inicial e os três testes matemáticos têm exatamente os resultados esperados.
- Todos os campos e exemplos atualizam expressão, solução e visualização de forma consistente.
- Dados inválidos produzem mensagens úteis, sem números impossíveis na tela.
- Exercício: acerto, erro, nova questão, limpeza de pistas e pontuação limitada à visita atual; confirme que os contadores zeram ao atualizar, sair e voltar à página.
- Desktop: mouse, zoom, edição visual e teclado.
- Celular: leitura em blocos, rolagem normal dentro de seções longas, zoom por botões, edição por toque apenas quando ativada e **nenhuma rolagem horizontal**.
- Foco visível, textos alternativos à visualização e preferência por movimento reduzido.

Se não puder testar um item no ambiente disponível, diga exatamente qual ficou sem verificação; não apresente um teste não realizado como concluído.

### 11.1 Validação obrigatória ao terminar a página

Depois de criar ou alterar a página, **sempre execute integralmente o prompt de validação universal** em `prompt-validacao-universal-de-sites.md`, antes de considerar a entrega concluída. A validação deve usar a página final e os arquivos realmente produzidos, não apenas uma inspeção do código.

- Preencha o contexto do prompt com o tema, o público, os fluxos implementados e o caminho ou URL da página.
- Execute os fluxos prioritários no navegador quando houver navegador disponível, incluindo desktop e uma largura móvel; faça também a inspeção de código e os testes automatizados pertinentes.
- Registre no relatório o ambiente, as ações, os resultados esperados e observados, além dos estados de evidência definidos pelo prompt.
- Corrija os problemas encontrados que forem necessários para cumprir este modelo e repita a validação após as correções.
- Se algum item não puder ser executado, declare-o explicitamente como não verificado e liste-o como limitação ou recomendação. Nunca marque como confirmado um teste que não foi realizado.
- Considere a entrega incompleta até que o relatório final de validação esteja pronto e seja incluído no resumo da entrega, com o caminho do arquivo gerado quando houver um relatório salvo.

### 12. Versões, README e publicação

- Escreva um `README.md` curto com objetivo do site, recursos, modo de executar, link público (se existir), forma de enviar feedback e instruções para recuperar revisões.
- Antes de alterar uma versão já publicada, preserve a anterior por **commit e branch ou tag** com nome claro. Faça a nova revisão em um commit separado. Não apague a versão antiga nem misture cópias de versões dentro da interface do estudante.
- Se for pedido para publicar, verifique qual repositório e hospedagem pertencem ao projeto, envie apenas os arquivos necessários e confirme que a implantação terminou e que o link público mostra a nova página. Não afirme que está no ar apenas porque o upload começou.
- Se publicar no GitHub Pages, explique como baixar uma revisão antiga: selecionar a branch/tag desejada e usar **Code → Download ZIP**, ou acessar o histórico de commits.
- Se o pedido for apenas criar a página ou este briefing, não publique nem altere contas externas por iniciativa própria.

## Entrega esperada

Entregue os arquivos completos e funcionais, sem trechos omitidos ou marcadores como “continue aqui”. Informe o caminho da página, como abri-la, quais interações foram implementadas, quais testes foram feitos, o resultado e as limitações da validação universal obrigatória e, se houver publicação, o link verificado. O resultado deve parecer um produto educacional pronto para um estudante usar, não uma demonstração técnica inacabada.
