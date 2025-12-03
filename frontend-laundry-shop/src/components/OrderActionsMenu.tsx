import { useState, useRef, useEffect } from "react";

type OrderActionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  onStatus: () => void;
  status: string;
};

export default function OrderActionsMenu({
  onEdit,
  onDelete,
  onStatus,
  status,
}: OrderActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const locked = status === "completed" || status === "cancelled";

  // Close menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      // open upward if not enough space
      setOpenUp(spaceBelow < 160);
    }
    setOpen((prev) => !prev);
  };

  const positionClasses = openUp ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        ref={buttonRef}
        className="px-3 py-1 rounded-lg hover:bg-gray-200"
        onClick={toggleMenu}
      >
        •••
      </button>

      {open && (
        <div
          className={
            "absolute right-0 w-40 bg-white shadow-lg rounded-xl text-sm z-50 " +
            positionClasses
          }
        >
          {/* UPDATE STATUS */}
          <button
            disabled={locked}
            className={
              "w-full text-left px-4 py-2 rounded " +
              (locked
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100")
            }
            onClick={() => {
              if (locked) return;
              setOpen(false);
              onStatus();
            }}
          >
            Update Status
          </button>

          {/* EDIT */}
          <button
            disabled={locked}
            className={
              "w-full text-left px-4 py-2 rounded " +
              (locked
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100")
            }
            onClick={() => {
              if (locked) return;
              setOpen(false);
              onEdit();
            }}
          >
            Edit
          </button>

          {/* DELETE */}
          <button
            disabled={locked}
            className={
              "w-full text-left px-4 py-2 text-red-600 rounded " +
              (locked ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100")
            }
            onClick={() => {
              if (locked) return;
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
