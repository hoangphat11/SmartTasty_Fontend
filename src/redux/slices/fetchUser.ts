// src/utils/api.ts

export async function fetchUser(token: string) {
  const res = await fetch('/api/User', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json(); // Giả sử server trả về { name: string, email: string }
}
