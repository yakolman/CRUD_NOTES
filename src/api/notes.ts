import type { Note } from '../types';

const API_URL = 'http://localhost:7070/notes';

async function assertOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(`Ошибка сервера: HTTP ${response.status}`);
  }
}

export async function getNotes(signal?: AbortSignal): Promise<Note[]> {
  const response = await fetch(API_URL, { signal });
  await assertOk(response);
  return (await response.json()) as Note[];
}

export async function postNote(content: string): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 0, content }),
  });
  await assertOk(response);
  // Сервер из задания отвечает 204 No Content: response.json() здесь не нужен.
}

export async function deleteNote(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await assertOk(response);
}
