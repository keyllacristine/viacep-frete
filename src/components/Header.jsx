export default function Header({ total, favoritos }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="brand">
          <i className="bi bi-truck" aria-hidden="true"></i>
          <div>
            <h1>Painel de Frete</h1>
            <p>Consulte um CEP e veja quanto custa receber.</p>
          </div>
        </div>
        <ul className="header__stats" aria-label="Resumo da sessão">
          <li><i className="bi bi-clock-history" aria-hidden="true"></i> {total} {total === 1 ? 'busca' : 'buscas'}</li>
          <li><i className="bi bi-star-fill" aria-hidden="true"></i> {favoritos} {favoritos === 1 ? 'favorito' : 'favoritos'}</li>
        </ul>
      </div>
    </header>
  )
}
