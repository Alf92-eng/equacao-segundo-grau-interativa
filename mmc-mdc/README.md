# Aula interativa: MMC e MDC

Página educacional independente para aprender a distinguir mínimo múltiplo comum e máximo divisor comum, fatorar inteiros positivos e praticar com feedback.

## Abrir

Abra `index.html` em um navegador moderno. A página não exige instalação nem servidor.

## Arquivos

- `index.html`: conteúdo, estrutura e controles.
- `style.css`: identidade visual e layout responsivo.
- `matematica.js`: validação e funções matemáticas reutilizadas pela aula e pelos testes.
- `script.js`: interação, apresentação dos resultados e exercícios.
- `testes/matematica.html`: testes matemáticos executáveis no navegador.
- `VALIDACAO.md`: relatório da validação funcional e suas limitações.

## Limites de entrada

Informe de 2 a 5 inteiros positivos, cada um entre 1 e 1.000.000. Separe os valores por vírgulas, espaços ou ponto e vírgula. O MMC é calculado com `BigInt` para preservar resultados exatos.

## Progresso

Os acertos e as tentativas são salvos no armazenamento local do navegador e permanecem após atualizar ou fechar a página. Se o navegador bloquear o armazenamento, a aula mostra um aviso e continua funcionando; nesse caso, a pontuação não pode ser preservada.
