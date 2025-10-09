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
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    // (xx) xxxx-xxxx
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
};
