import { useState, type FormEvent } from 'react';

type Props = {
  onAdd: (content: string) => Promise<boolean>;
  disabled: boolean;
};

export default function NotesForm({ onAdd, disabled }: Props) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const trimmed = content.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed || isSending || disabled) return;
    setIsSending(true);
    try {
      const success = await onAdd(trimmed);
      if (success) setContent('');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="note-form" onSubmit={(event) => { void handleSubmit(event); }}>
      <label htmlFor="note-content" className="form-label">New Note</label>
      <div className="textarea-wrapper">
        <textarea
          id="note-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={5000}
          disabled={disabled || isSending}
        />
        <button
          className="add-button"
          type="submit"
          disabled={!trimmed || isSending || disabled}
          aria-label="Добавить заметку"
          title="Добавить заметку"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 3.5 21 12 4 20.5l4-8.5-4-8.5Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </form>
  );
}
