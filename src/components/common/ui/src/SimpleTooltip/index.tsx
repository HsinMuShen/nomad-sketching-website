type TooltipProps = {
  message: string
  children: React.ReactNode
  className?: string
}

export function SimpleTooltip({ message, children, className }: TooltipProps) {
  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className="z-3 absolute whitespace-nowrap top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
        {message}
      </div>
    </div>
  )
}

export default SimpleTooltip
