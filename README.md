# Painel de Frete · ViaCEP

## Problemática

Ao comprar online, muita gente só descobre o valor do frete no final do carrinho, o que gera surpresa e abandono da compra. Digitar o CEP e encontrar o endereço correto também é uma etapa sujeita a erros. Falta uma forma rápida de consultar vários endereços, comparar custos e prazos de entrega e guardar os que mais interessam.

## Objetivo da aplicação

Oferecer um painel de página única em que a pessoa informa um ou mais CEPs, confere o endereço retornado e recebe uma **estimativa de frete** (valor e prazo) a partir de uma **loja fictícia** situada em um CEP sorteado. A aplicação também mantém o histórico das consultas da sessão, permite marcar favoritos e filtrar os endereços, facilitando a comparação.

## Tecnologias utilizadas

- [React 18](https://react.dev): interface baseada em componentes (`Header`, `Main`, `Footer`)
- [Vite 5](https://vitejs.dev): ambiente de desenvolvimento e build
- JavaScript (ES Modules) e CSS puro, com layout responsivo (Grid e Flexbox)
- [Bootstrap Icons](https://icons.getbootstrap.com): ícones, via pacote `bootstrap-icons`
- Fonte **Elms Sans** (Google Fonts)
- `sessionStorage` para manter histórico e favoritos durante a sessão

## API utilizada

**[ViaCEP](https://viacep.com.br)**: API pública e gratuita de consulta de endereços por CEP.

- Endpoint: `GET https://viacep.com.br/ws/{cep}/json/`
- Campos utilizados: `cep`, `logradouro`, `bairro`, `localidade`, `uf` e `ibge`
- Tratamento de erros: CEP com formato inválido, CEP inexistente (`erro: true`) e falha de rede

O ViaCEP não fornece coordenadas. Por isso, a distância usada no frete é uma **estimativa**:

| Situação | Cálculo de distância |
| --- | --- |
| Mesma cidade (mesmo código IBGE) | 4 km + diferença numérica entre CEPs, limitado a 35 km |
| Mesmo estado, cidades diferentes | 45 km + diferença entre CEPs, limitado a 450 km |
| Estados diferentes | Distância (Haversine) entre os centros dos estados × 1,25, mínimo de 300 km |

Valores e prazos (regras em `src/utils/frete.js`):

- **Econômico:** R$ 9,90 + R$ 0,015/km; prazo `⌈2 + km/450⌉ + 1` dias úteis
- **Expresso:** R$ 16,90 + R$ 0,03/km; prazo `max(1, ⌈1 + km/900⌉)` dias úteis

## Principais funcionalidades

- Consulta de CEP com máscara automática (`00000-000`) e mensagens de erro claras
- Loja fictícia com CEP real sorteado a cada sessão, com botão para sortear outra (os fretes são recalculados)
- Estimativa de frete com duas modalidades, exibindo valor, prazo e distância aproximada
- Histórico de endereços pesquisados na sessão, sem duplicatas
- Favoritos na sessão, com botão de estrela
- Filtros por texto (rua, bairro, cidade ou CEP), por estado (UF) e por favoritos
- Botão "Limpar não favoritos" para limpar o histórico mantendo os favoritos
- Página única, responsiva, com tema verde e branco
- Acessibilidade: tags semânticas (`header`, `main`, `section`, `article`, `footer`), link "Ir para o conteúdo", rótulos associados, foco visível, `role="alert"` nos erros, regiões `aria-live` e respeito a `prefers-reduced-motion`

### Estrutura de pastas

```
src/
├── App.jsx                  # estado da sessão e regras de negócio
├── main.jsx
├── styles.css
├── components/
│   ├── Header.jsx
│   ├── Main.jsx             # busca, resultado, filtros e histórico
│   └── Footer.jsx
├── hooks/useSessionState.js # useState persistido em sessionStorage
├── services/viacep.js       # chamada à API e máscara de CEP
└── utils/frete.js           # sorteio da loja e cálculo de frete
```

## Link da aplicação publicada

> 🔗 **[Adicione aqui o link da aplicação publicada]**


## Informações sobre o uso de IA

Este projeto foi desenvolvido com apoio de inteligência artificial generativa (**Claude**, da Anthropic), que gerou a estrutura inicial do código (componentes React, serviço de consulta ao ViaCEP, cálculo de frete, estilos) e este README, a partir de um roteiro de requisitos definido pelo autor.

- A lógica de estimativa de frete é fictícia e simplificada; os valores **não** refletem tarifas reais de transportadoras.
- O código gerado deve ser revisado, testado e ajustado por quem o utilizar antes de qualquer uso além do educacional.

## Prompt:

Crie uma aplicação em react + vite com painel interativo e alimentação de API.
A aplicação deverá:

* Se alimentar da API ViaCep.
* Estimar valores do frete de uma loja fictícia situada em um CEP aleatório baseado nos CEPs digitados.
* Ter algum tipo de interatividade que possibilite a filtragem de dados para a interface também como histórico de endereços procurados na sessão e possibilidade de adicionar favoritos dentro da mesma sessão.
* O site deve ser responsivo e se adaptar a diferentes resoluções e dispositivos
* A aplicação deve possuir componentização: Header, Main e Footer.
* O estilo do site deve ser limpo, moderno e acessível: a paleta sugerida é de verde e branco. Utilize ícones do bootstrap e a fonte Elms Sans.
* Utilize tags semânticas e recursos de acessibilidade.
* O site deve operar em apenas uma página, sem abrir links adicionais.
* Crie um README.md para o projeto.