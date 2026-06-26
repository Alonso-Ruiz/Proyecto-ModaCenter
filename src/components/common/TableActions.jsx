export default function TableActions({ onEdit, onDelete }) {
  return (
    <div className="flex justify-center gap-2 text-slate-400">
      <button
        type="button"
        onClick={onEdit}
        className="grid h-8 w-12 place-items-center rounded-md text-xs hover:bg-slate-100 hover:text-slate-700"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="grid h-8 w-12 place-items-center rounded-md text-xs hover:bg-rose-50 hover:text-rose-600"
      >
        Borrar
      </button>
    </div>
  );
}
