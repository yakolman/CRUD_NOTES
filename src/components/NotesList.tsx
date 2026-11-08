import type { Note } from '../types';
import NoteCard from './NoteCard';

type Props = {
  notes: Note[];
  onDelete: (id: number) => void;
  disabled: boolean;
  loading: boolean;
};

export default function NotesList({ notes, onDelete, disabled, loading }: Props) {
  if (loading && notes.length === 0) return <p className="loading-text" role="status">Загрузка…</p>;
  return (
    <div className="notes-grid">
      {notes.map((note) => <NoteCard key={note.id} note={note} onDelete={onDelete} disabled={disabled} />)}
    </div>
  );
}
