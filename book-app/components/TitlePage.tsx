"use client";

import React from "react";
import { BookSettings } from "@/types";

export default function TitlePage({
  title,
  author,
  subtitle,
  settings,
}: {
  title: string;
  author: string;
  subtitle: string;
  settings: BookSettings;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center px-6"
      style={{ fontFamily: `"${settings.fontFamily}", Georgia, serif` }}
    >
      {/* Top decorative rule */}
      <div className="w-24 h-[2px] bg-zinc-800 mb-12" />

      {/* Title */}
      <h1
        className="font-bold tracking-tight leading-[1.15]"
        style={{
          fontSize: "2.2em",
          color: "#1a1a1a",
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          className="mt-3 italic"
          style={{
            fontSize: "1em",
            color: "#555",
            letterSpacing: "0.04em",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Decorative element */}
      <div className="flex items-center gap-3 my-10">
        <div className="w-12 h-[1px] bg-zinc-400" />
        <div className="w-2 h-2 rotate-45 border border-zinc-400" />
        <div className="w-12 h-[1px] bg-zinc-400" />
      </div>

      {/* Author */}
      <p
        className="tracking-[0.25em] uppercase font-semibold"
        style={{
          fontSize: "0.8em",
          color: "#555",
        }}
      >
        {author}
      </p>
    </div>
  );
}
