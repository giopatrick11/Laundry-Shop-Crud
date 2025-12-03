<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['items' => function ($q) {
            $q->select(
                'id',
                'order_id',
                'service_name as serviceName',
                'weight',
                'price',
                'total'
            );
        }])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customerName' => 'required|string',
            'contactNumber' => 'required|string',
            'services' => 'required|array|min:1',
            'services.*.serviceName' => 'required|string',
            'services.*.weight' => 'required|numeric',
            'services.*.price' => 'required|numeric',
            'services.*.total' => 'required|numeric',
        ]);

        $totalAmount = collect($validated['services'])->sum('total');

        $order = Order::create([
            'customer_name'   => $validated['customerName'],
            'contact_number'  => $validated['contactNumber'],
            'total_amount'    => $totalAmount,
            'status'          => 'pending',
        ]);

        foreach ($validated['services'] as $item) {
            $order->items()->create([
                'service_name' => $item['serviceName'],
                'weight'       => $item['weight'],
                'price'        => $item['price'],
                'total'        => $item['total'],
            ]);
        }

        return response()->json([
            'message' => 'Order created successfully',
            'order_id' => $order->id,
        ], 201);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,ongoing,completed,cancelled'
        ]);

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated successfully',
            'order'   => $order,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'customerName' => 'required|string',
            'contactNumber' => 'required|string',
            'services' => 'required|array|min:1',
            'services.*.serviceName' => 'required|string',
            'services.*.weight' => 'required|numeric',
            'services.*.price' => 'required|numeric',
            'services.*.total' => 'required|numeric',
        ]);

        $totalAmount = collect($validated['services'])->sum('total');

        $order->update([
            'customer_name' => $validated['customerName'],
            'contact_number' => $validated['contactNumber'],
            'total_amount' => $totalAmount,
        ]);

        $order->items()->delete();

        foreach ($validated['services'] as $item) {
            $order->items()->create([
                'service_name' => $item['serviceName'],
                'weight'       => $item['weight'],
                'price'        => $item['price'],
                'total'        => $item['total'],
            ]);
        }

        return response()->json([
            'message' => 'Order updated successfully',
            'order'   => $order->load('items'),
        ]);
    }

    public function delete($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if (!in_array($order->status, ['pending', 'ongoing'])) {
            return response()->json(['message' => 'Cannot delete completed or cancelled orders'], 403);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

    /* ===========================================================
     * UPDATE CUSTOMER (Name + Phone) ACROSS ALL THEIR ORDERS
     * =========================================================== */
    public function updateCustomer(Request $request)
    {
        $request->validate([
            'old_name' => 'required|string',
            'old_phone' => 'required|string',
            'new_name' => 'required|string',
            'new_phone' => 'required|string',
        ]);

        DB::table('orders')
            ->where('customer_name', $request->old_name)
            ->where('contact_number', $request->old_phone)
            ->update([
                'customer_name' => $request->new_name,
                'contact_number' => $request->new_phone,
            ]);

        return response()->json(['message' => 'Customer updated successfully']);
    }
}
