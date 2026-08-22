import { apiFetch } from "./client";
import type { User } from "../types/user";

type AuthResponse = { user: User; token: string };

export function registerRequest(params: {
  username: string;
  email: string;
  password: string;
}) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function loginRequest(params: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function fetchMe() {
  return apiFetch<{ user: User }>("/users/me");
}

export function updateMeRequest(params: {
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  return apiFetch<{ user: User }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}
