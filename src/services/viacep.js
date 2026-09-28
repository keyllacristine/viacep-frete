export const soDigitos = (v) => v.replace(/\D/g, '')

export const formatarCep = (v) => {
  const d = soDigitos(v).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export async function buscarCep(cep) {
  const digitos = soDigitos(cep)
  if (digitos.length !== 8) throw new Error('Informe um CEP com 8 dígitos.')

  let resposta
  try {
    resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
  } catch {
    throw new Error('Não foi possível acessar o ViaCEP. Verifique sua conexão.')
  }
  if (!resposta.ok) throw new Error('O ViaCEP não respondeu. Tente novamente.')

  const dados = await resposta.json()
  if (dados.erro) throw new Error('CEP não encontrado. Confira os números.')
  return { ...dados, cep: formatarCep(digitos) }
}
