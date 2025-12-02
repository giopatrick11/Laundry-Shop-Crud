import axios from "axios";
import type { Post } from "../types/Post";
const APP_URL = "http://localhost:8000/api";

export const getPosts = () => axios.get<Post[]>(APP_URL + "/posts");
