// Centro aproximado de cada UF [lat, lon]. O ViaCEP não devolve coordenadas,
// então a distância é uma ESTIMATIVA entre estados ou por proximidade de CEP.
const UF_CENTRO = {
  AC: [-9.02, -70.81], AL: [-9.57, -36.78], AP: [1.41, -51.77], AM: [-3.47, -65.1],
  BA: [-12.96, -41.7], CE: [-5.2, -39.3], DF: [-15.83, -47.86], ES: [-19.19, -40.34],
  GO: [-15.83, -49.84], MA: [-5.42, -45.44], MT: [-12.64, -55.42], MS: [-20.51, -54.54],
  MG: [-18.1, -44.38], PA: [-3.79, -52.48], PB: [-7.12, -36.72], PR: [-24.89, -51.55],
  PE: [-8.38, -37.86], PI: [-6.6, -42.28], RJ: [-22.25, -42.66], RN: [-5.81, -36.59],
  RS: [-30.17, -53.5], RO: [-10.83, -63.34], RR: [2.05, -61.4], SC: [-27.45, -50.95],
  SP: [-22.19, -48.79], SE: [-10.57, -37.45], TO: [-10.18, -48.33],
}

// CEPs reais usados para sortear a localização da loja fictícia.
export const CEPS_LOJA = [
  '01310-100', '20040-020', '30130-010', '40020-000',
  '70040-010', '60060-000', '80010-000', '90010-000',
]

export const LOJA_PADRAO = {
  cep: '01310-100', logradouro: 'Avenida Paulista', bairro: 'Bela Vista',
  localidade: 'São Paulo', uf: 'SP', ibge: '3550308',
}

export const sortearCep = (excluir) => {
  const opcoes = CEPS_LOJA.filter((c) => c !== excluir)
  return opcoes[Math.floor(Math.random() * opcoes.length)]
}

const rad = (g) => (g * Math.PI) / 180
function haversine([la1, lo1], [la2, lo2]) {
  const a =
    Math.sin(rad(la2 - la1) / 2) ** 2 +
    Math.cos(rad(la1)) * Math.cos(rad(la2)) * Math.sin(rad(lo2 - lo1) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

export function estimarDistanciaKm(loja, destino) {
  const diff = Math.abs(parseInt(loja.cep.replace('-', ''), 10) - parseInt(destino.cep.replace('-', ''), 10))
  if (loja.ibge && loja.ibge === destino.ibge) return Math.round(Math.min(4 + diff / 9000, 35))
  if (loja.uf === destino.uf) return Math.round(Math.min(45 + diff / 2500, 450))
  const base = haversine(UF_CENTRO[loja.uf] ?? UF_CENTRO.SP, UF_CENTRO[destino.uf] ?? UF_CENTRO.SP)
  return Math.round(Math.max(base * 1.25, 300)) // fator 1,25 aproxima o trajeto rodoviário
}

export function calcularFrete(loja, destino) {
  const km = estimarDistanciaKm(loja, destino)
  return {
    km,
    opcoes: [
      { id: 'eco', nome: 'Econômico', icone: 'bi-box-seam', preco: 9.9 + km * 0.015, prazo: Math.ceil(2 + km / 450) + 1 },
      { id: 'exp', nome: 'Expresso', icone: 'bi-lightning-charge', preco: 16.9 + km * 0.03, prazo: Math.max(1, Math.ceil(1 + km / 900)) },
    ],
  }
}

export const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const prazoTexto = (d) => `${d} ${d === 1 ? 'dia útil' : 'dias úteis'}`
