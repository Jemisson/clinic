export function getInitials(name: string) {
  const parts = name.trim().split(" ")
  if (parts.length === 0) return ""
  return parts[0][0] + parts[parts.length - 1][0]
}
