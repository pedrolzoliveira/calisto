export const filterContent = (content: string) => {
  return content.split('\n').filter(Boolean).map(line => line.trim()).join(' ')
}
