import { useState, useRef, useEffect } from "react";

export default function OrderActionsMenu({
  onEdit,
  onDelete,
  onStatus,
  status,
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false); // decide direction
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const statusLocked = status === "completed" || status === "cancelled";

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const toggleMenu = () => {
    if (!buttonRef.current) {
      setOpen((prev) => !prev);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    // ~160px is enough for your 3 options menu
    setOpenUp(spaceBelow < 160);
    setOpen((prev) => !prev);
  };

  const positionClasses = openUp
    ? "bottom-full mb-2" // open upward
    : "top-full mt-2"; // open downward (default)

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
          <button
            disabled={statusLocked}
            className={
              "w-full text-left px-4 py-2 rounded " +
              (statusLocked
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100")
            }
            onClick={() => {
              if (statusLocked) return; // prevent action
              setOpen(false);
              onStatus();
            }}
          >
            Update Status
          </button>

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
