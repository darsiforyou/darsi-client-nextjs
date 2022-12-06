import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let user
if (typeof window !== 'undefined') {
  user = JSON.parse(localStorage.getItem("persist:root") || '{}')?.user;
}
  
const currentUser = user && JSON.parse(user)?.currentUser;
const TOKEN = currentUser?.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `` }
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
