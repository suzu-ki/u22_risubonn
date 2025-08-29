import React, { useState, useCallback, useMemo, useEffect } from "react";
import SimpleMde from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const MarkdownEditor3 = ({ value, onChange }) => {
  const insertH2 = {
    name: "h2",
    action(editor) {
      const cm = editor.codemirror;
      const doc = cm.getDoc();
      const cursor = doc.getCursor();
      doc.replaceRange("## Heading 2\n", cursor);
      cm.focus();
    },
    // className: "fas fa-h1",
    className: "fas fa-heading", // ← ここを変更
    title: "見出し2を挿入",
  };

  const insertCode = {
    name: "code",
    action(editor) {
      const cm = editor.codemirror;
      const doc = cm.getDoc();
      const cursor = doc.getCursor();
      doc.replaceRange("```js\n```\n", cursor);
      cm.focus();
    },
    // className: "fas fa-h1",
    className: "fa fa-code", // ← ここを変更
    title: "見出し2を挿入",
  };

  const insertTable = {
    name: "table",
    action(editor) {
      const cm = editor.codemirror;
      const doc = cm.getDoc();
      const cursor = doc.getCursor();
      const tableTemplate =
        `| 列1 | 列2 | 列3 | 列4 |\n` +
        `| ---- | ---- | ---- | ---- |\n` +
        `|      |      |      |      |\n`;
      doc.replaceRange(tableTemplate, cursor);
      cm.focus();
    },
    className: "fa fa-table",
    title: "テーブルを挿入",
  };

  const options = useMemo(() => ({
    autofocus: true,
    toolbar: [
      "bold",
      "italic",
      "strikethrough",
      "|",
      insertH2,
      {
        name: "h3",
        action: (editor) => {
          const cm = editor.codemirror;
          const doc = cm.getDoc();
          const cursor = doc.getCursor();
          doc.replaceRange("### Heading 3\n", cursor);
          cm.focus();
        },
        className: "fa fa-header",
        title: "見出し3を挿入",
      },
      "|",
      insertTable,
      insertCode,
      "|",
      "quote",
      "unordered-list",
      "ordered-list",
      "|",
      "link",
      "image",
      "preview",
      "side-by-side",
      "fullscreen",
      "|",
      "guide",
    ],
  }), []); // 空の依存配列で options を1度だけ生成

  return <SimpleMde value={value} onChange={onChange} options={options} />;
};

export default MarkdownEditor3;
