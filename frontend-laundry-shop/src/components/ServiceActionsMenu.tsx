import { useState, useRef, useEffect } from "react";

interface ServiceActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServiceActionsMenu({
  onEdit,
  onDelete,
}: ServiceActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        className="px-3 py-1 rounded-lg hover:bg-gray-200"
        onClick={() => setOpen((prev) => !prev)}
      >
        •••
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-xl text-sm z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            Edit
          </button>

          <button
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
