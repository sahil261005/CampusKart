import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import apiFetch from "../utils/api";

const CURRENCY_SYMBOL = "Rs.";

const inputClassName =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400";

const initialState = {
  title: "",
  description: "",
  price: "",
  preview_pages: 2,
  file: null,
};

const Notes = () => {
  const { isAuthenticated, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [formState, setFormState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchNotes = async () => {
    try {
      const data = await apiFetch("/notes/");
      setNotes(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (err) {
      setError("Oops! We couldn't load the notes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await apiFetch(`/notes/${noteId}/`, { method: "DELETE" }, true);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      setMessage("Note removed successfully.");
      setError("");
    } catch (err) {
      const message = err?.payload?.detail || "Unable to remove note.";
      setError(message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      if (value) {
        payload.append(key, value);
      }
    });

    try {
      await apiFetch("/notes/", { method: "POST", body: payload }, true);
      setMessage("Note uploaded successfully!");
      setFormState(initialState);
      await fetchNotes();
    } catch (err) {
      const details =
        err?.payload?.detail || "Could not upload note. Please try again.";
      setError(details);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Notes Marketplace
        </h1>
        <p className="text-slate-600">
          Browse study notes and upload your own resources for classmates.
        </p>
      </header>

      {isAuthenticated && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-900">
            Upload a note
          </h2>
          <p className="text-sm text-slate-600">
            PDF files only. Preview will show the first few pages automatically.
          </p>
          {message && (
            <p className="mt-3 rounded-md bg-emerald-100 p-3 text-sm text-emerald-700">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-md bg-rose-100 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <form
            className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="title"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formState.title}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div className="space-y-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="price"
              >
                Price ({CURRENCY_SYMBOL})
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={formState.price}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                value={formState.description}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div className="space-y-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="preview_pages"
              >
                Preview pages
              </label>
              <input
                id="preview_pages"
                name="preview_pages"
                type="number"
                min="1"
                max="5"
                value={formState.preview_pages}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="file"
              >
                PDF file
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                required
                onChange={handleChange}
                className="block w-full text-sm text-slate-700"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? "Uploading..." : "Upload note"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Available notes
        </h2>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-slate-600">Loading notes...</span>
          </div>
        ) : notes.length === 0 ? (
          <p className="rounded-md bg-white p-6 text-center text-slate-600 shadow">
            No notes shared yet. Be the first to upload!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map((note) => (
              <article
                key={note.id}
                className="space-y-3 rounded-lg bg-white p-4 shadow"
              >
                <header className="space-y-1">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {note.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Uploaded by {note.uploader_name || note.uploader_email}
                  </p>
                </header>
                <p className="text-sm text-slate-700">{note.description}</p>
                <p className="text-sm font-medium text-slate-700">
                  Price: {CURRENCY_SYMBOL} {note.price}
                </p>
                <div className="flex items-center justify-between">
                  <a
                    href={note.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-slate-900 hover:underline"
                  >
                    Download full PDF
                  </a>
                  {isAuthenticated && user && note.uploader === user.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="rounded-md border border-rose-200 px-3 py-1 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      Remove note
                    </button>
                  )}
                </div>
                {Array.isArray(note.preview_content) &&
                  note.preview_content.length > 0 && (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="mb-2 font-medium text-slate-900">Preview</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        {note.preview_content.map((pageText, index) => (
                          <li
                            key={index}
                            className="whitespace-pre-wrap text-slate-700"
                          >
                            {pageText || "Preview unavailable for this page."}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notes;
