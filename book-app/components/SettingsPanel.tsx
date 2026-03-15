"use client";

import React from "react";
import { useBookStore } from "@/store/bookStore";
import { FONT_OPTIONS, PAGE_SIZES, PageSize, ThemeMode } from "@/types";
import { Settings, Type, Ruler, Palette, BookMarked, Columns2 } from "lucide-react";

export default function SettingsPanel() {
  const { book, updateSettings, setAuthor, setSubtitle } = useBookStore();
  const { settings } = book;

  return (
    <aside className="w-72 shrink-0 bg-zinc-900/80 backdrop-blur-xl border-l border-zinc-800/80 flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="p-4 border-b border-zinc-800/80 flex items-center gap-2">
        <Settings size={16} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Book Settings</h3>
      </div>

      {/* Book Info */}
      <Section icon={<BookMarked size={14} />} title="Book Info">
        <Label text="Author">
          <input
            type="text"
            className="input-field"
            value={book.author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
          />
        </Label>
        <Label text="Subtitle">
          <input
            type="text"
            className="input-field"
            value={book.subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Optional subtitle"
          />
        </Label>
      </Section>

      {/* Page Layout */}
      <Section icon={<Ruler size={14} />} title="Page Layout">
        <Label text="Page Size">
          <select
            className="input-field"
            value={settings.pageSize}
            onChange={(e) => updateSettings({ pageSize: e.target.value as PageSize })}
          >
            {Object.entries(PAGE_SIZES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </Label>
        <Label text="Margins (pt)">
          <div className="grid grid-cols-2 gap-2">
            {(["top", "bottom", "inner", "outer"] as const).map((side) => (
              <div key={side}>
                <span className="text-[10px] text-zinc-600 uppercase">{side}</span>
                <input
                  type="number"
                  className="input-field text-xs"
                  value={settings.margins[side]}
                  onChange={(e) =>
                    updateSettings({
                      margins: { ...settings.margins, [side]: Number(e.target.value) },
                    })
                  }
                  min={18}
                  max={144}
                />
              </div>
            ))}
          </div>
        </Label>
      </Section>

      {/* Columns */}
      <Section icon={<Columns2 size={14} />} title="Columns">
        <div className="flex gap-2">
          {([1, 2] as const).map((cols) => (
            <button
              key={cols}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                settings.columnCount === cols
                  ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
              onClick={() => updateSettings({ columnCount: cols })}
            >
              {cols} Column{cols > 1 ? "s" : ""}
            </button>
          ))}
        </div>
        {settings.columnCount === 2 && (
          <Label text={`Column Gap: ${settings.columnGap}px`}>
            <input
              type="range"
              className="w-full accent-indigo-500"
              min={16}
              max={40}
              value={settings.columnGap}
              onChange={(e) => updateSettings({ columnGap: Number(e.target.value) })}
            />
          </Label>
        )}
      </Section>

      {/* Typography */}
      <Section icon={<Type size={14} />} title="Typography">
        <Label text="Font Family">
          <select
            className="input-field"
            value={settings.fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Label>
        <Label text={`Font Size: ${settings.fontSize}pt`}>
          <input
            type="range"
            className="w-full accent-indigo-500"
            min={9}
            max={14}
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
          />
        </Label>
        <Label text={`Line Height: ${settings.lineHeight}`}>
          <input
            type="range"
            className="w-full accent-indigo-500"
            min={1.2}
            max={2.0}
            step={0.05}
            value={settings.lineHeight}
            onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
          />
        </Label>
      </Section>

      {/* Theme */}
      <Section icon={<Palette size={14} />} title="Theme">
        <div className="flex gap-2">
          {(["light", "sepia", "dark"] as ThemeMode[]).map((t) => (
            <button
              key={t}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all border ${
                settings.theme === t
                  ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
              onClick={() => updateSettings({ theme: t })}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>
    </aside>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 border-b border-zinc-800/50 space-y-3">
      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-zinc-500">{text}</span>
      {children}
    </label>
  );
}
