"use client";

import React, { useState } from "react";
import { useBookStore } from "@/store/bookStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  GripVertical,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Chapter } from "@/types";

function SortableChapterItem({
  chapter,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: {
  chapter: Chapter;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(chapter.title);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDoubleClick = () => {
    setEditing(true);
    setEditValue(chapter.title);
  };

  const commitRename = () => {
    setEditing(false);
    if (editValue.trim()) onRename(editValue.trim());
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 ${
        isActive
          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 border border-transparent"
      }`}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 shrink-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      {editing ? (
        <input
          className="flex-1 bg-zinc-800 text-zinc-100 text-sm px-2 py-0.5 rounded border border-zinc-600 outline-none focus:border-indigo-500"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate">{chapter.title}</span>
      )}
      <button
        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-opacity shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function ChapterSidebar() {
  const { book, activeChapterId, setActiveChapter, addChapter, deleteChapter, renameChapter, reorderChapters, setTitle } =
    useBookStore();
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(book.title);
  const [collapsed, setCollapsed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = book.chapters.findIndex((c) => c.id === active.id);
      const newIndex = book.chapters.findIndex((c) => c.id === over.id);
      reorderChapters(arrayMove(book.chapters, oldIndex, newIndex));
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col h-full">
      {/* Book Title */}
      <div className="p-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-indigo-400" />
          {titleEditing ? (
            <input
              className="flex-1 bg-zinc-800 text-zinc-100 text-sm font-semibold px-2 py-1 rounded border border-zinc-600 outline-none focus:border-indigo-500"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={() => {
                setTitleEditing(false);
                if (titleValue.trim()) setTitle(titleValue.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setTitleEditing(false);
                  if (titleValue.trim()) setTitle(titleValue.trim());
                }
              }}
              autoFocus
            />
          ) : (
            <h2
              className="text-sm font-semibold text-zinc-100 truncate cursor-pointer hover:text-indigo-300 transition-colors"
              onDoubleClick={() => {
                setTitleValue(book.title);
                setTitleEditing(true);
              }}
              title="Double-click to edit"
            >
              {book.title}
            </h2>
          )}
        </div>
        <p className="text-xs text-zinc-500 pl-6">Double-click to rename</p>
      </div>

      {/* Chapters Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          className="flex items-center gap-1 text-xs font-medium text-zinc-400 uppercase tracking-wider hover:text-zinc-200 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          Chapters ({book.chapters.length})
        </button>
        <button
          className="p-1 rounded-md text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 transition-all"
          onClick={addChapter}
          title="Add Chapter"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Chapter List */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 scrollbar-thin">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={book.chapters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              {book.chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter) => (
                  <SortableChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    isActive={activeChapterId === chapter.id}
                    onSelect={() => setActiveChapter(chapter.id)}
                    onRename={(title) => renameChapter(chapter.id, title)}
                    onDelete={() => deleteChapter(chapter.id)}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800/80 text-xs text-zinc-600 text-center">
        Auto-saved to browser
      </div>
    </aside>
  );
}
