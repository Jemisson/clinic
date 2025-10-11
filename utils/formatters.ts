import { Addresses } from "@/types/patients";

export const formatCPF = (cpf?: string | null): string => {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "").slice(0, 11);
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatPhone = (phone?: string | null): string => {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 11) {
    // (xx) xxxxx-xxxx
    return digits.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
  }
  if (digits.length === 10) {
    // (xx) xxxx-xxxx
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
};

function formatCEP(v?: string | null): string {
  if (!v) return ""
  const d = String(v).replace(/\D/g, "")
  return d.length === 8 ? d.replace(/(\d{5})(\d{3})/, "$1-$2") : String(v)
}

export function formatAddress(addr?: Addresses | null): string {
  if (!addr) return ""

  const street  = addr.street?.trim() || ""
  const number  = (addr.number ?? "").toString().trim()
  const neigh   = addr.neighborhood?.trim() || ""
  const city    = addr.city?.trim() || ""
  const state   = addr.state?.trim() || ""
  const country = addr.country?.trim() || ""
  const zip     = formatCEP(addr.zip_code)

  const streetNum = street && number ? `${street}, ${number}` : street || number
  const cityUF    = [city, state].filter(Boolean).join(" - ")

  let out = ""
  if (streetNum) out += streetNum
  if (neigh)     out += (out ? " - " : "") + neigh
  if (cityUF)    out += (out ? ", " : "") + cityUF
  if (zip)       out += (out ? ", " : "") + `CEP ${zip}`
  if (country)   out += (out ? ", " : "") + country

  return out
}
