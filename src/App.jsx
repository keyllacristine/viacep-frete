import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import { buscarCep } from './services/viacep'
import { LOJA_PADRAO, calcularFrete, sortearCep } from './utils/frete'
import useSessionState from './hooks/useSessionState'

export default function App() {
  const [loja, setLoja] = useSessionState('loja', null)
  const [historico, setHistorico] = useSessionState('historico', [])
  const [favoritos, setFavoritos] = useSessionState('favoritos', [])
  const [atualCep, setAtualCep] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const sortearLoja = useCallback(async () => {
    try {
      setLoja(await buscarCep(sortearCep(loja?.cep)))
    } catch {
      setLoja(LOJA_PADRAO)
    }
  }, [loja, setLoja])

  useEffect(() => {
    if (!loja) sortearLoja()
  }, [loja, sortearLoja])

  const pesquisar = async (cep) => {
    setCarregando(true)
    setErro('')
    try {
      const dados = await buscarCep(cep)
      setHistorico((h) => [dados, ...h.filter((x) => x.cep !== dados.cep)])
      setAtualCep(dados.cep)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  const alternarFavorito = (cep) =>
    setFavoritos((f) => (f.includes(cep) ? f.filter((c) => c !== cep) : [...f, cep]))

  // Somente favoritos permanecem; o restante do histórico é descartado.
  const limparHistorico = () => {
    setHistorico((h) => h.filter((x) => favoritos.includes(x.cep)))
    setAtualCep(null)
  }

  // O frete é recalculado sempre que a loja muda.
  const enderecos = useMemo(
    () => (loja ? historico.map((h) => ({ ...h, frete: calcularFrete(loja, h), favorito: favoritos.includes(h.cep) })) : []),
    [historico, favoritos, loja]
  )

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <Header total={historico.length} favoritos={favoritos.length} />
      <Main
        loja={loja}
        enderecos={enderecos}
        atual={enderecos.find((e) => e.cep === atualCep)}
        carregando={carregando}
        erro={erro}
        onPesquisar={pesquisar}
        onSelecionar={setAtualCep}
        onFavorito={alternarFavorito}
        onSortearLoja={sortearLoja}
        onLimpar={limparHistorico}
      />
      <Footer />
    </>
  )
}
