export function cleanText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanTitle(title?: string | null): string {
  if (!title) return '';
  return cleanText(title)
    .replace(/\s+Full\s+Episode\s+Subtitle\s+Indonesia\s+-\s+Dracinema/gi, '')
    .replace(/\s+Sub\s+Indo\s+-\s+Dracinema/gi, '')
    .replace(/\s+-\s+Dracinema/gi, '')
    .trim();
}
