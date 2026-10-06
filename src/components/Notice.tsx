export default function Notice({ message, kind = 'error' }: { message: string | null; kind?: 'error' | 'ok' }) {
  if (!message) return null
  return <p className={`notice ${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{message}</p>
}
