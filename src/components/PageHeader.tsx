interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-6 w-full flex flex-col justify-center items-center ${className}`}>
      <h1 className="text-3xl font-dm-serif font-light text-app-primary">{title}</h1>
      {subtitle && <p className="mt-1 text-candypop font-light text-sm">{subtitle}</p>}
    </div>
  )
}
