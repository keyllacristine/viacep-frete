export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          <i className="bi bi-info-circle" aria-hidden="true"></i> Loja e valores fictícios; a distância é uma
          estimativa. Endereços fornecidos pelo ViaCEP.
        </p>
        <p>© {new Date().getFullYear()} Painel de Frete</p>
      </div>
    </footer>
  )
}
