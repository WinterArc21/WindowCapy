export default function Text({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return <p className={'text-sm ' + (muted ? 'text-text/70' : 'text-text')}>{children}</p>
}
