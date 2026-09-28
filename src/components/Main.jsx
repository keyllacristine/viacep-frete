import { useMemo, useState } from 'react'
import { formatarCep } from '../services/viacep'
import { moeda, prazoTexto } from '../utils/frete'

function BotaoFavorito({ item, onFavorito }) {
  return (
    <button
      type="button"
      className="btn btn--ghost"
      aria-pressed={item.favorito}
      aria-label={`${item.favorito ? 'Remover dos' : 'Adicionar aos'} favoritos: CEP ${item.cep}`}
      onClick={() => onFavorito(item.cep)}
    >
      <i className={`bi ${item.favorito ? 'bi-star-fill' : 'bi-star'}`} aria-hidden="true"></i>
    </button>
  )
}

export default function Main({ loja, enderecos, atual, carregando, erro, onPesquisar, onSelecionar, onFavorito, onSortearLoja, onLimpar }) {
  const [cep, setCep] = useState('')
  const [texto, setTexto] = useState('')
  const [uf, setUf] = useState('')
  const [soFavoritos, setSoFavoritos] = useState(false)

  const ufs = useMemo(() => [...new Set(enderecos.map((e) => e.uf))].sort(), [enderecos])

  const filtrados = useMemo(() => {
    const t = texto.trim().toLowerCase()
    return enderecos.filter(
      (e) =>
        (!uf || e.uf === uf) &&
        (!soFavoritos || e.favorito) &&
        (!t || [e.logradouro, e.bairro, e.localidade, e.cep].join(' ').toLowerCase().includes(t))
    )
  }, [enderecos, texto, uf, soFavoritos])

  const enviar = (e) => {
    e.preventDefault()
    onPesquisar(cep)
  }

  return (
    <main id="conteudo" className="container main" tabIndex="-1">
      <section className="panel panel--search" aria-labelledby="t-busca">
        <h2 id="t-busca">Buscar CEP de entrega</h2>
        <form onSubmit={enviar} noValidate>
          <label htmlFor="cep">CEP</label>
          <div className="field">
            <input
              id="cep"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              maxLength={9}
              value={cep}
              onChange={(e) => setCep(formatarCep(e.target.value))}
              aria-describedby={erro ? 'cep-ajuda cep-erro' : 'cep-ajuda'}
              aria-invalid={Boolean(erro)}
            />
            <button className="btn" type="submit" disabled={carregando || !loja}>
              <i className={`bi ${carregando ? 'bi-arrow-repeat spin' : 'bi-search'}`} aria-hidden="true"></i>
              {carregando ? 'Buscando…' : 'Calcular frete'}
            </button>
          </div>
          <p id="cep-ajuda" className="hint">Digite os 8 números do CEP.</p>
          {erro && <p id="cep-erro" className="error" role="alert"><i className="bi bi-exclamation-triangle" aria-hidden="true"></i> {erro}</p>}
        </form>

        <div className="store">
          <p>
            <i className="bi bi-shop" aria-hidden="true"></i>{' '}
            <strong>Loja fictícia:</strong>{' '}
            {loja ? `${loja.localidade}/${loja.uf} · CEP ${loja.cep}` : 'sorteando…'}
          </p>
          <button type="button" className="btn btn--outline" onClick={onSortearLoja}>
            <i className="bi bi-shuffle" aria-hidden="true"></i> Sortear outra loja
          </button>
        </div>
      </section>

      <section className="panel panel--result" aria-labelledby="t-resultado" aria-live="polite">
        <h2 id="t-resultado">Estimativa de frete</h2>
        {!atual ? (
          <p className="empty"><i className="bi bi-geo-alt" aria-hidden="true"></i> Busque um CEP para ver valores e prazos.</p>
        ) : (
          <article>
            <div className="result__head">
              <div>
                <h3>{atual.logradouro || 'CEP geral da cidade'}</h3>
                <p>{[atual.bairro, `${atual.localidade}/${atual.uf}`].filter(Boolean).join(' · ')} · CEP {atual.cep}</p>
              </div>
              <BotaoFavorito item={atual} onFavorito={onFavorito} />
            </div>

            <div className="route" role="img" aria-label={`Trajeto estimado de ${loja.localidade} até ${atual.localidade}: ${atual.frete.km} quilômetros`}>
              <span>{loja.localidade}</span>
              <span className="route__line"><i className="bi bi-truck"></i></span>
              <span>{atual.localidade}</span>
            </div>
            <p className="route__km">≈ {atual.frete.km} km</p>

            <ul className="options">
              {atual.frete.opcoes.map((o) => (
                <li key={o.id} className="option">
                  <i className={`bi ${o.icone}`} aria-hidden="true"></i>
                  <div>
                    <h4>{o.nome}</h4>
                    <p>{prazoTexto(o.prazo)}</p>
                  </div>
                  <strong>{moeda(o.preco)}</strong>
                </li>
              ))}
            </ul>
          </article>
        )}
      </section>

      <section className="panel panel--history" aria-labelledby="t-historico">
        <div className="history__head">
          <h2 id="t-historico">Histórico da sessão</h2>
          <button type="button" className="btn btn--outline" onClick={onLimpar} disabled={!enderecos.length}>
            <i className="bi bi-trash3" aria-hidden="true"></i> Limpar não favoritos
          </button>
        </div>

        <fieldset className="filters" disabled={!enderecos.length}>
          <legend>Filtrar endereços</legend>
          <div>
            <label htmlFor="f-texto">Rua, bairro ou cidade</label>
            <input id="f-texto" type="search" value={texto} onChange={(e) => setTexto(e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-uf">Estado</label>
            <select id="f-uf" value={uf} onChange={(e) => setUf(e.target.value)}>
              <option value="">Todos</option>
              {ufs.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <label className="check" htmlFor="f-fav">
            <input id="f-fav" type="checkbox" checked={soFavoritos} onChange={(e) => setSoFavoritos(e.target.checked)} />
            Somente favoritos
          </label>
        </fieldset>

        <p className="hint" role="status">{filtrados.length} de {enderecos.length} endereços exibidos.</p>

        {filtrados.length === 0 ? (
          <p className="empty"><i className="bi bi-inbox" aria-hidden="true"></i> {enderecos.length ? 'Nenhum endereço combina com os filtros.' : 'Suas buscas aparecerão aqui.'}</p>
        ) : (
          <ul className="history">
            {filtrados.map((e) => (
              <li key={e.cep} className={`history__item ${atual?.cep === e.cep ? 'is-active' : ''}`}>
                <div>
                  <h3>{e.logradouro || 'CEP geral'} <small>{e.cep}</small></h3>
                  <p>{[e.bairro, `${e.localidade}/${e.uf}`].filter(Boolean).join(' · ')}</p>
                  <p className="price">a partir de {moeda(Math.min(...e.frete.opcoes.map((o) => o.preco)))}</p>
                </div>
                <div className="history__actions">
                  <BotaoFavorito item={e} onFavorito={onFavorito} />
                  <button type="button" className="btn btn--outline" onClick={() => onSelecionar(e.cep)} aria-label={`Ver frete do CEP ${e.cep}`}>
                    <i className="bi bi-eye" aria-hidden="true"></i> Ver
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
