export default function Avatar({ src, alt, size = 36 }: { src?: string | null; alt: string; size?: number }) {
  return (
    <img
      src={src || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23F9F5F2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="%232F2F2F">🙂</text></svg>'}
      alt={alt}
      width={size}
      height={size}
      className="inline-block rounded-full border border-outline object-cover"
    />
  )
}
