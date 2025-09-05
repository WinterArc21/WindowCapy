export default function PrivacyBadge({ privacy }: { privacy: 'public' | 'followers' }) {
  const label = privacy === 'public' ? 'Public' : 'Followers'
  return (
    <span className='inline-flex items-center rounded-full bg-bgMuted px-2 py-0.5 text-xs text-text/70 border border-outline'>
      {label}
    </span>
  )
}
