export default function Avatar({ src, alt, size = 36 }: { src?: string | null; alt: string; size?: number }) {
  return (
    <img
      src={src || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="               0.0000009F5F2"/><text x="50