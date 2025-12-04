export default function ViewServicesModal({ isOpen, order, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[420px]">
        <h2 className="text-xl font-bold mb-4">
          Services for Order #{order.id}
        </h2>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border p-3 rounded-lg bg-gray-50 text-sm"
            >
              <div className="font-semibold">{item.serviceName}</div>
              <div>Weight: {item.weight} kg</div>
              <div>Price per kg: ₱{item.price}</div>
              <div className="font-bold">Total: ₱{item.total}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
