export default function FormField({ label, error, className = '', children }) {
  return (
    <label className={`block text-xs font-semibold text-slate-500 ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
