import type { Note } from '../types';

type Props = {
  note: Note;
  onDelete: (id: number) => void;
  disabled: boolean;
};

export default function NoteCard({ note, onDelete, disabled }: Props) {
  return (
    <article className="note-card">
      <p className="note-content">{note.content}</p>
      <button
        className="delete-button"
        type="button"
        disabled={disabled}
        onClick={() => onDelete(note.id)}
        aria-label={`Удалить заметку №${note.id}`}
        title="Удалить заметку"
      >×</button>
    </article>
  );
}
