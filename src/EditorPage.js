import React, { useState } from "react";
import MarkdownEditor3 from "./MarkdownEditor3";

const TAG_OPTIONS = ["日記", "Todo", "メモ"];

const EditorPage = () => {
  const [editors, setEditors] = useState([
    { id: 0, tag: "", text: "" },
  ]);

  const addEditor = () => {
    setEditors(prev => [
      ...prev,
      { id: prev.length, tag: "", text: "" },
    ]);
  };

  const updateEditor = (id, key, value) => {
    setEditors(prev =>
      prev.map(editor =>
        editor.id === id ? { ...editor, [key]: value } : editor
      )
    );
  };

  // 保存（localStorageに一時保存）
  const saveToStorage = () => {
    localStorage.setItem("editorData", JSON.stringify(editors));
    alert("保存しました");
  };

  return (
    <div>
      <h2>Editor</h2>
      {editors.map(({ id, tag, text }) => (
        <div key={id} style={{ marginBottom: "20px" }}>
          <select
            value={tag}
            onChange={(e) => updateEditor(id, "tag", e.target.value)}
          >
            <option value="">タグを選択</option>
            {TAG_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <MarkdownEditor3
            value={text}
            onChange={(val) => updateEditor(id, "text", val)}
          />
        </div>
      ))}
      <button onClick={addEditor}>エディタを増やす</button>
      <button onClick={saveToStorage} style={{ marginLeft: "10px" }}>保存</button>
    </div>
  );
};

export default EditorPage;
