<?php

namespace App\Http\Controllers;

use App\Models\Post;  
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::select(["id", "title", "body"])->get();  
        return response()->json($posts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $post = Post::create([
            "title" => $request->title,
            "body" => $request->body,
        ]);

        return response()->json(["id" => $post->id, "title" => $post->title,  "body" => $post->body ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::find($id);    
          return response()->json(["id" => $post->id, "title" => $post->title,  "body" => $post->body ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
           $post = Post::find($id);

        $post->title = $request->title;
        $post->body = $request->body;
        $post->save();
        return response()->json(["id" => $post->id, "title" => $post->title,  "body" => $post->body ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Post::destroy($id);
        return response()->json(["Post deleted."]); 
    }
}
