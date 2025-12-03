<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET all users
    public function index()
    {
        return User::select('id', 'name', 'email', 'role')->get();
    }

    // CREATE secretary user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,secretary',
        ]);

        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        return response()->json(['message' => 'User created successfully'], 201);
    }

    // DELETE user
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user)
            return response()->json(['message' => 'User not found'], 404);

        if ($user->role === "admin")
            return response()->json(['message' => 'Admin cannot be deleted'], 403);

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
