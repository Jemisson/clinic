export type CepAddress = {
  street: string
  neighborhood: string
  city: string
  state: string
}

export function onlyDigits(v: string) {
  return v.replace(/\D/g, "")
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress> {
  const clean = onlyDigits(cep)
  if (clean.length !== 8) {
    throw new Error("CEP inválido (use 8 dígitos).")
  }

  const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error("CEP não encontrado.")
  }

  const data = await res.json()
  return {
    street: data.street || data.logradouro || "",
    neighborhood: data.neighborhood || data.bairro || "",
    city: data.city || data.localidade || "",
    state: data.state || data.uf || "",
  }
}
