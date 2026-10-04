export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`.trim()} aria-hidden="true">
      <span className="brand-x">X</span>
      <span className="brand-tech">Tech</span>
    </span>
  )
}

export function BrandLink({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`logo-link ${className}`.trim()} aria-label="XTech">
      <BrandMark />
    </a>
  )
}
