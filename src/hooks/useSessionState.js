import { useEffect, useState } from 'react'

// useState que sobrevive a recarregamentos, mas só durante a sessão da aba.
export default function useSessionState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  }, [key, value])

  return [value, setValue]
}
