import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  Plus,
  Search,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Home,
  FileText,
  Lightbulb,
  Users,
  Heart,
  X,
  Save,
} from "lucide-react";
import type {
  Note,
  NoteCategory,
  CreateNoteInput,
  Task,
} from "../../utils/types";
import { taskStorage } from "../../lib/storage";

const CATEGORY_ICONS: Record<NoteCategory, any> = {
  "daily-log": Calendar,
  "task-note": FileText,
  reflection: Heart,
  idea: Lightbulb,
  meeting: Users,
};

const CATEGORY_COLORS: Record<NoteCategory, string> = {
  "daily-log": "bg-blue-100 text-blue-700 border-blue-300",
  "task-note": "bg-green-100 text-green-700 border-green-300",
  reflection: "bg-purple-100 text-purple-700 border-purple-300",
  idea: "bg-yellow-100 text-yellow-700 border-yellow-300",
  meeting: "bg-pink-100 text-pink-700 border-pink-300",
};

const NOTE_TEMPLATES: Record<NoteCategory, string> = {
  "daily-log": `# Daily Log - ${new Date().toLocaleDateString()}

## What I accomplished today
-

## Challenges faced
-

## What I learned
-

## Tomorrow's focus
- `,
  "task-note": `# Task Notes

## Context
<!-- Why are we doing this? -->

## Approach
<!-- How are we solving this? -->

## Blockers
<!-- What's preventing progress? -->

## Next Steps
- `,
  reflection: `# Reflection - ${new Date().toLocaleDateString()}

## What went well?
-

## What could be improved?
-

## Key insights
-

## Actions for next time
- `,
  idea: `# Idea

## The Concept
<!-- Describe your idea -->

## Why it matters
<!-- What problem does it solve? -->

## Implementation thoughts
-

## Questions to explore
- `,
  meeting: `# Meeting Notes - ${new Date().toLocaleDateString()}

## Attendees
-

## Agenda
1.

## Key Decisions
-

## Action Items
- [ ]

## Follow-up
- `,
};

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    NoteCategory | "all"
  >("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state for creating/editing notes
  const [noteForm, setNoteForm] = useState<CreateNoteInput>({
    title: "",
    content: "",
    category: "task-note",
    tags: [],
    taskId: null,
  });

  // Load notes and tasks
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allNotes = await taskStorage.getNotes();
      setNotes(allNotes);

      const allTasks = await taskStorage.getTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      alert("Please provide both title and content");
      return;
    }

    try {
      const newNote = await taskStorage.createNote(noteForm);
      setNotes([newNote, ...notes]);

      // Reset form
      setNoteForm({
        title: "",
        content: "",
        category: "task-note",
        tags: [],
        taskId: null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Failed to create note");
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNote || !noteForm.title.trim() || !noteForm.content.trim()) {
      return;
    }

    try {
      const updated = await taskStorage.updateNote(selectedNote.id, noteForm);
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
      setSelectedNote(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await taskStorage.deleteNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));

      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note");
    }
  };

  const startNewNote = (category?: NoteCategory) => {
    const cat = category || "task-note";
    setNoteForm({
      title: "",
      content: NOTE_TEMPLATES[cat],
      category: cat,
      tags: [],
      taskId: null,
    });
    setIsEditing(true);
    setSelectedNote(null);
  };

  const startEditNote = (note: Note) => {
    setSelectedNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags || [],
      taskId: note.taskId || null,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedNote(null);
    setNoteForm({
      title: "",
      content: "",
      category: "task-note",
      tags: [],
      taskId: null,
    });
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    if (selectedCategory !== "all" && note.category !== selectedCategory)
      return false;
    if (selectedTag && (!note.tags || !note.tags.includes(selectedTag)))
      return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        (note.tags && note.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }
    return true;
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags || [])),
  ).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={32} />
              Notes
            </h1>
            <p className="text-gray-600">
              Your markdown-powered knowledge base
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => startNewNote()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              <span>New Note</span>
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 mr-2">Quick start:</span>
          {(Object.keys(NOTE_TEMPLATES) as NoteCategory[]).map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <button
                key={category}
                onClick={() => startNewNote(category)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:shadow-sm ${CATEGORY_COLORS[category]}`}
              >
                <Icon size={14} />
                <span className="capitalize">{category.replace("-", " ")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as NoteCategory | "all")
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              {(Object.keys(NOTE_TEMPLATES) as NoteCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="text-gray-400" size={16} />
              {allTags.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-sm text-gray-600 mb-2">
            {filteredNotes.length}{" "}
            {filteredNotes.length === 1 ? "note" : "notes"}
          </div>

          {filteredNotes.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <BookOpen className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600 mb-4">No notes yet</p>
              <button
                onClick={() => startNewNote()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Your First Note
              </button>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const Icon = CATEGORY_ICONS[note.category];
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                  className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? "border-indigo-500 shadow-md"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon size={16} className="text-gray-500 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditNote(note);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-2 line-clamp-2 prose prose-xs max-w-none">
                    <ReactMarkdown>
                      {note.content.substring(0, 150)}
                    </ReactMarkdown>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-0.5 rounded font-medium ${CATEGORY_COLORS[note.category]}`}
                    >
                      {note.category}
                    </span>
                    <span className="text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {note.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Note Editor/Viewer */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedNote ? "Edit Note" : "New Note"}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectedNote ? handleUpdateNote : handleCreateNote}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, title: e.target.value })
                    }
                    placeholder="Note title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={noteForm.category}
                      onChange={(e) =>
                        setNoteForm({
                          ...noteForm,
                          category: e.target.value as NoteCategory,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {(Object.keys(NOTE_TEMPLATES) as NoteCategory[]).map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat.replace("-", " ")}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link to Task (optional)
                    </label>
                    <select
                      value={noteForm.taskId || ""}
                      onChange={(e) =>
                        setNoteForm({
                          ...noteForm,
                          taskId: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">None</option>
                      {tasks
                        .filter((t) => t.status === "active")
                        .map((task) => (
                          <option key={task.id} value={task.id}>
                            {task.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (Markdown)
                  </label>
                  <div data-color-mode="light">
                    <MDEditor
                      value={noteForm.content}
                      onChange={(val) =>
                        setNoteForm({ ...noteForm, content: val || "" })
                      }
                      height={400}
                      preview="edit"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : selectedNote ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedNote.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded font-medium text-xs ${CATEGORY_COLORS[selectedNote.category]}`}
                    >
                      {selectedNote.category}
                    </span>
                    <span>
                      Created{" "}
                      {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </span>
                    {selectedNote.updatedAt !== selectedNote.createdAt && (
                      <span>
                        • Updated{" "}
                        {new Date(selectedNote.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => startEditNote(selectedNote)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a note or create a new one
              </h3>
              <p className="text-gray-500 mb-6">Your notes will appear here</p>
              <button
                onClick={() => startNewNote()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Create New Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
