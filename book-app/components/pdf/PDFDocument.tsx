"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Book, PAGE_SIZES, ThemeMode } from "@/types";
import { JSONContent } from "@tiptap/react";
import { extractText } from "@/lib/tiptapToText";

// Register a basic font
Font.register({
  family: "Georgia",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/eb-garamond@latest/latin-400-normal.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/eb-garamond@latest/latin-700-normal.ttf",
      fontWeight: 700,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/eb-garamond@latest/latin-400-italic.ttf",
      fontStyle: "italic",
    },
  ],
});

const THEME_COLORS: Record<ThemeMode, { bg: string; text: string; muted: string }> = {
  light: { bg: "#FFFFFF", text: "#1a1a1a", muted: "#666666" },
  sepia: { bg: "#F5F0E8", text: "#2c2416", muted: "#8a7f6e" },
  dark: { bg: "#1e1e1e", text: "#d4d4d4", muted: "#666666" },
};

export default function PDFDocument({ book }: { book: Book }) {
  const dims = PAGE_SIZES[book.settings.pageSize];
  const theme = THEME_COLORS[book.settings.theme];
  const { margins, fontSize, lineHeight, fontFamily } = book.settings;

  const usedFont = "Georgia"; // Using registered font

  const styles = StyleSheet.create({
    page: {
      width: dims.width,
      height: dims.height,
      paddingTop: margins.top,
      paddingBottom: margins.bottom,
      paddingLeft: margins.left,
      paddingRight: margins.right,
      backgroundColor: theme.bg,
      fontFamily: usedFont,
      fontSize,
      color: theme.text,
      lineHeight: lineHeight,
      position: "relative",
    },
    header: {
      position: "absolute",
      top: margins.top * 0.3,
      left: margins.left,
      right: margins.right,
      textAlign: "center",
      fontSize: 8,
      color: theme.muted,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    footer: {
      position: "absolute",
      bottom: margins.bottom * 0.3,
      left: margins.left,
      right: margins.right,
      textAlign: "center",
      fontSize: 9,
      color: theme.muted,
    },
    titlePage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    bookTitle: {
      fontSize: fontSize * 2.5,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 12,
      letterSpacing: 1,
    },
    bookSubtitle: {
      fontSize: fontSize * 1.2,
      textAlign: "center",
      fontStyle: "italic",
      color: theme.muted,
      marginBottom: 24,
    },
    bookAuthor: {
      fontSize: fontSize * 0.9,
      textAlign: "center",
      color: theme.muted,
      letterSpacing: 3,
      textTransform: "uppercase",
    },
    decorativeLine: {
      width: 60,
      height: 1,
      backgroundColor: theme.muted,
      marginBottom: 24,
    },
    decorativeLineSmall: {
      width: 30,
      height: 1,
      backgroundColor: theme.muted,
    },
    decorativeDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.muted,
      marginHorizontal: 8,
    },
    decorativeGroup: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
    },
    tocTitle: {
      fontSize: fontSize * 1.5,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 24,
      letterSpacing: 3,
      textTransform: "uppercase",
    },
    tocEntry: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.muted + "44",
      borderBottomStyle: "dotted" as const,
    },
    tocChapterTitle: {
      fontSize: fontSize,
      fontWeight: "bold",
    },
    tocPageNum: {
      fontSize: fontSize * 0.9,
      color: theme.muted,
    },
    chapterTitle: {
      fontSize: fontSize * 1.8,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 24,
      letterSpacing: 1,
    },
    paragraph: {
      marginBottom: fontSize * 0.8,
      textAlign: "justify",
    },
    heading1: {
      fontSize: fontSize * 1.6,
      fontWeight: "bold",
      marginBottom: fontSize * 0.6,
      marginTop: fontSize * 1.2,
    },
    heading2: {
      fontSize: fontSize * 1.3,
      fontWeight: "bold",
      marginBottom: fontSize * 0.5,
      marginTop: fontSize * 1.0,
    },
    heading3: {
      fontSize: fontSize * 1.1,
      fontWeight: "bold",
      marginBottom: fontSize * 0.4,
      marginTop: fontSize * 0.8,
    },
    blockquote: {
      borderLeftWidth: 2,
      borderLeftColor: theme.muted,
      paddingLeft: 12,
      marginVertical: fontSize * 0.5,
      fontStyle: "italic",
      color: theme.muted,
    },
    listItem: {
      flexDirection: "row",
      marginBottom: fontSize * 0.3,
    },
    listBullet: {
      width: 14,
      fontSize: fontSize * 0.7,
    },
    listContent: {
      flex: 1,
    },
    boldText: {
      fontWeight: "bold",
    },
    italicText: {
      fontStyle: "italic",
    },
  });

  // Render chapter content from Tiptap JSON
  const renderContent = (content: JSONContent) => {
    if (!content.content) return null;
    return content.content.map((node, i) => renderNode(node, i));
  };

  const renderNode = (node: JSONContent, key: number): React.ReactNode => {
    switch (node.type) {
      case "heading": {
        const level = node.attrs?.level ?? 1;
        const headingStyles = [styles.heading1, styles.heading2, styles.heading3];
        const headingStyle = headingStyles[Math.min(level - 1, 2)];
        return (
          <Text key={key} style={headingStyle}>
            {renderInline(node.content)}
          </Text>
        );
      }
      case "paragraph": {
        const text = extractText(node);
        if (!text && !node.content?.length) {
          return <Text key={key} style={{ marginBottom: fontSize * 0.4 }}> </Text>;
        }
        return (
          <Text key={key} style={styles.paragraph}>
            {renderInline(node.content)}
          </Text>
        );
      }
      case "blockquote":
        return (
          <View key={key} style={styles.blockquote}>
            {node.content?.map((child, j) => renderNode(child, j))}
          </View>
        );
      case "bulletList":
        return (
          <View key={key}>
            {node.content?.map((item, j) => (
              <View key={j} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <View style={styles.listContent}>
                  {item.content?.map((child, k) => renderNode(child, k))}
                </View>
              </View>
            ))}
          </View>
        );
      case "orderedList":
        return (
          <View key={key}>
            {node.content?.map((item, j) => (
              <View key={j} style={styles.listItem}>
                <Text style={styles.listBullet}>{j + 1}.</Text>
                <View style={styles.listContent}>
                  {item.content?.map((child, k) => renderNode(child, k))}
                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  const renderInline = (content?: JSONContent[]): React.ReactNode => {
    if (!content) return "";
    return content.map((node, i) => {
      if (node.type === "hardBreak") return "\n";
      if (!node.text) return "";
      const hasBold = node.marks?.some((m) => m.type === "bold");
      const hasItalic = node.marks?.some((m) => m.type === "italic");
      const inlineStyle: Record<string, string> = {};
      if (hasBold) inlineStyle.fontWeight = "bold";
      if (hasItalic) inlineStyle.fontStyle = "italic";
      return (
        <Text key={i} style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}>
          {node.text}
        </Text>
      );
    });
  };

  // Calculate chapter start pages
  const sortedChapters = [...book.chapters].sort((a, b) => a.order - b.order);

  // Simple pagination: title=1, TOC=2, chapters start at 3
  const tocEntries = sortedChapters.map((ch, i) => ({
    title: ch.title,
    page: 3 + i,
  }));

  return (
    <Document title={book.title} author={book.author}>
      {/* Title Page */}
      <Page size={[dims.width, dims.height]} style={styles.page}>
        <View style={styles.titlePage}>
          <View style={styles.decorativeLine} />
          <Text style={styles.bookTitle}>{book.title}</Text>
          {book.subtitle && <Text style={styles.bookSubtitle}>{book.subtitle}</Text>}
          <View style={styles.decorativeGroup}>
            <View style={styles.decorativeLineSmall} />
            <View style={styles.decorativeDot} />
            <View style={styles.decorativeLineSmall} />
          </View>
          <Text style={styles.bookAuthor}>{book.author}</Text>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size={[dims.width, dims.height]} style={styles.page}>
        <Text style={styles.header}>{book.title}</Text>
        <Text style={styles.tocTitle}>Contents</Text>
        {tocEntries.map((entry, i) => (
          <View key={i} style={styles.tocEntry}>
            <Text style={styles.tocChapterTitle}>{entry.title}</Text>
            <Text style={styles.tocPageNum}>{entry.page}</Text>
          </View>
        ))}
        <Text
          style={styles.footer}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </Page>

      {/* Chapters */}
      {sortedChapters.map((chapter) => (
        <Page key={chapter.id} size={[dims.width, dims.height]} style={styles.page} wrap>
          <Text style={styles.header} fixed>
            {book.title}
          </Text>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          {renderContent(chapter.content)}
          <Text
            style={styles.footer}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
        </Page>
      ))}
    </Document>
  );
}
