export default function Card({ children, className = '', onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
