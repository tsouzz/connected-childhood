# Infância Conectada

Site educativo que mostra, na prática, como as interfaces digitais podem manipular crianças e adolescentes, e o que o **ECA Digital (Lei nº 15.211/2025)** e a **LGPD (Lei nº 13.709/2018)** exigem no lugar dessas práticas.

A ideia central é simples: o visitante experimenta cada *dark pattern* e, com um clique, alterna para a versão que a lei exige, podendo comparar as duas experiências lado a lado.

> Projeto da disciplina de Desenvolvimento Web, IFSP.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Simulações](#simulações)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Decisões de projeto](#decisões-de-projeto)
- [Acessibilidade](#acessibilidade)
- [Publicação no GitHub Pages](#publicação-no-github-pages)
- [Fontes e créditos](#fontes-e-créditos)

---

## Funcionalidades

O site tem três páginas:

| Página | Arquivo | O que oferece |
| --- | --- | --- |
| Início | `index.html` | Dados sobre o uso da internet por crianças, vídeo e áudio explicativos e quatro simulações interativas |
| O que a lei diz | `law.html` | Resumo do ECA Digital, linha do tempo, tabela filtrável de padrões de design e perguntas rápidas |
| Como proteger meu filho | `proteger.html` | Checklist de seis passos para pais e responsáveis, com progresso salvo no navegador |

## Simulações

Cada simulação tem um seletor com dois modos: **Simular Dark Pattern** e **Ver como a Lei exige**.

| Simulação | No modo dark pattern | No modo da lei |
| --- | --- | --- |
| **Banner de cookies** | Aceitar é grande e fácil; recusar exige abrir um painel e desligar cada opção, com um contador de falsa urgência | Aceitar e recusar têm o mesmo peso, e os opcionais começam desligados |
| **Loot box** | Caixa-surpresa paga com 5% de chance de item lendário e painel "por trás da cortina" com os números reais | A caixa fica indisponível, como prevê o art. 20 do ECA Digital |
| **Falsa urgência** | Cronômetro e estoque "quase esgotado" que recomeçam sozinhos | Preço fixo, sem prazo artificial |
| **Feed de vídeos** | Rolagem infinita com reprodução automática; novos lotes carregam sozinhos | Lista finita que termina com uma pausa e deixa a escolha com o usuário |

Todas são educativas: **nada coleta dados nem cobra dinheiro**.

## Tecnologias

- HTML5 semântico
- CSS3 com variáveis (design tokens) e tema escuro único
- JavaScript puro (*vanilla*), sem frameworks, bibliotecas ou etapa de build
- Fonte [Inter](https://fonts.google.com/specimen/Inter), carregada do Google Fonts, com fallback para fontes do sistema

APIs do navegador utilizadas: `<dialog>`, `IntersectionObserver`, `localStorage`, `matchMedia` e `<video>`/`<audio>`.

## Como executar

Não há dependências para instalar. Clone o repositório e abra o `index.html` no navegador:

```bash
git clone https://github.com/SEU-USUARIO/infancia-conectada.git
cd infancia-conectada
```

Para um resultado mais fiel (por exemplo, para o feed de vídeos), sirva a pasta com um servidor estático:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura do projeto

```
infancia-conectada/
├── index.html
├── law.html
├── proteger.html
├── css/
│   ├── tokens.css      variáveis de cor, raio e tipografia
│   ├── base.css        reset, tipografia, botões, cards, diálogo e layout
│   ├── home.css        hero, números, barras e player da página inicial
│   ├── sims.css        simulações e feed de vídeos
│   ├── law.css         tabela, filtros, linha do tempo e escudo
│   └── proteger.css    checklist e painel de progresso
├── js/
│   ├── core/
│   │   ├── storage.js  leitura e escrita seguras no localStorage
│   │   ├── nav.js      menu responsivo
│   │   └── modes.js    alternância entre modo dark pattern e modo da lei
│   ├── home.js         contadores animados
│   ├── law.js          filtros da tabela
│   ├── checklist.js    checklist com persistência
│   └── sims/
│       ├── cookies.js
│       ├── lootbox.js
│       ├── urgency.js
│       └── feed.js
└── assets/
    ├── img/            ilustração, pôster do vídeo e ícones
    ├── audio/          áudio explicativo
    └── video/          vídeo explicativo e vídeos do feed
```

## Decisões de projeto

- **Sem build e sem dependências.** O site abre direto do disco e pode ser hospedado em qualquer servidor estático.
- **Design system único.** Fundo `#000000`, superfícies `#0a0a0a`, bordas finas de 1px, botão primário branco com texto preto. Tudo vem de variáveis em `tokens.css`.
- **Utilitários centralizados.** `IC.storage`, `IC.bindMode` e `IC.plural` ficam em `js/core/` e são reaproveitados pelos demais scripts.
- **Scripts defensivos.** Cada script verifica se os elementos de que depende existem antes de rodar, então os arquivos compartilhados não geram erros ao navegar entre páginas.
- **Código sem comentários.** O código-fonte é mantido limpo, sem comentários.

## Acessibilidade

- Link "Pular para o conteúdo" no início de cada página
- Um único `h1` por página e hierarquia de títulos consistente
- `aria-current`, `aria-expanded`, `aria-pressed` e `aria-live` nos componentes interativos
- Navegação completa por teclado, com foco visível; `Esc` fecha o menu e os diálogos
- Respeito a `prefers-reduced-motion`: animações são desligadas e os vídeos do feed passam a ter controles manuais
- Vídeos do feed silenciados e com `playsinline`, com aviso visível caso um arquivo não carregue

## Publicação no GitHub Pages

1. No repositório, abra **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`, e clique em **Save**.
4. Em alguns minutos o site estará em `https://SEU-USUARIO.github.io/infancia-conectada/`.

> Os vídeos são pesados (o vídeo explicativo passa de 70 MB). Se o repositório ficar lento, considere comprimi-los.

## Fontes e créditos

- Lei nº 15.211, de 17 de setembro de 2025 (ECA Digital)
- Decreto nº 12.880, de 18 de março de 2026
- Lei nº 13.709, de 14 de agosto de 2018 (LGPD)
- Ministério da Justiça e Segurança Pública, *ECA Digital*, gov.br/mj, publicado em 20/03/2026
- Cetic.br/NIC.br, *TIC Kids Online Brasil 2025*