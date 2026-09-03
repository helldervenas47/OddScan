/**
 * Utilitários de Formatação de Data e Hora para o OddScan
 */

export function formatMatchDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (isSameDay(date, now)) {
    return `Hoje ${timeStr}`;
  }
  
  if (isSameDay(date, tomorrow)) {
    return `Amanhã ${timeStr}`;
  }

  const dayMonth = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  return `${dayMonth} às ${timeStr}`;
}

export function isMatchToday(isoString: string): boolean {
  if (!isoString) return false;
  const evtDate = new Date(isoString);
  const now = new Date();

  return (
    evtDate.getDate() === now.getDate() &&
    evtDate.getMonth() === now.getMonth() &&
    evtDate.getFullYear() === now.getFullYear()
  );
}
