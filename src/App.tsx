import { useCallback, useEffect, useRef, useState } from 'react';
import NotesForm from './components/NotesForm';
import NotesList from './components/NotesList';
import { deleteNote, getNotes, postNote } from './api/notes';
import type { Note } from './types';

function errorMessage(error: unknown): string {
  if (error instanceof TypeError) return 'Не удалось подключиться к серверу. Проверьте, что backend запущен на localhost:7070.';
  if (error instanceof Error) return error.message;
  return 'Произошла неизвестная ошибка.';
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRequest = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    lastRequest.current?.abort();
    const controller = new AbortController();
    lastRequest.current = controller;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotes(controller.signal);
      if (!controller.signal.aborted && mounted.current) setNotes(data);
    } catch (caught) {
      if (!controller.signal.aborted && mounted.current) setError(errorMessage(caught));
    } finally {
      if (!controller.signal.aborted && mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => {
      mounted.current = false;
      lastRequest.current?.abort();
    };
  }, [refresh]);

  async function handleAdd(content: string): Promise<boolean> {
    setMutating(true);
    setError(null);
    try {
      await postNote(content);
      await refresh();
      return true;
    } catch (caught) {
      setError(errorMessage(caught));
      return false;
    } finally {
      setMutating(false);
    }
  }

  async function handleDelete(id: number): Promise<void> {
    setMutating(true);
    setError(null);
    try {
      await deleteNote(id);
      await refresh();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setMutating(false);
    }
  }

  const disabled = loading || mutating;

  return (
    <main className="app">
      <div className="title-row">
        <h1>Notes</h1>
        <button
          className="refresh-button"
          type="button"
          onClick={() => { void refresh(); }}
          disabled={disabled}
          aria-label="Обновить заметки"
          title="Обновить заметки"
        >
          <svg className={loading ? 'refresh-icon spinning' : 'refresh-icon'} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 9a7.5 7.5 0 0 0-13.5-2M5 4v3.5h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15a7.5 7.5 0 0 0 13.5 2M19 20v-3.5h-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      <section className="notes-section" aria-label="Список заметок">
        <NotesList notes={notes} onDelete={(id) => { void handleDelete(id); }} disabled={disabled} loading={loading} />
      </section>

      <section className="create-section" aria-label="Новая заметка">
        <NotesForm onAdd={handleAdd} disabled={disabled} />
      </section>
    </main>
  );
}
