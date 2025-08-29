// DailyEditor.js
import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import MarkdownEditor3 from "../MarkdownEditor3";
import { saveMarkdownToFile4 } from "../utils/saveUtil";

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 任意のテーマを指定

marked.setOptions({
  breaks: true,
  gfm: true,
  tables: true,
  highlight: function (code, lang) {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

import '../styles/DailyEditor.css'; // 新しいCSSファイルをインポート

// marked.setOptions({
//   breaks: true,
//   gfm: true,
//   tables: true,
// });

const ColumStyle = {
  flex: 1,
  overflow: "auto",
  border: "1px solid #ccc",
  padding: "10px",
};

const DailyEditor = ({ editors, updateEditor, addEditor, groupedByTag, tagOptions, subtagOptionMap }) => {
    console.log(subtagOptionMap)
    useEffect(() => {
        marked.setOptions({
            breaks: true,
            gfm: true,
            tables: true,
            highlight: function (code, lang) {
            if (hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
            },
        });
    }, []);

    // ★ ココを追加
    useEffect(() => {
        hljs.highlightAll();
    }, [groupedByTag]);

  return (
    <div className="daily-editor-container">
      {/* 左：エディタエリア */}
      <div className="editor-column">
        <h2>Editor</h2>
        <div className="editor-scroll-area">
          {editors.map(({ id, tag, subtag, text }) => (
            <div key={id} className="editor-item">
                <select
                    className="tag-select"
                    value={tag}
                    onChange={(e) => {
                            updateEditor(id, "tag", e.target.value);
                            updateEditor(id, 'subtag', '');
                        }
                    }
                >
                <option value="">タグを選択</option>
                {tagOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
                </select>

                {/* 小タスク（subtag）選択 */}
                <select
                    className="subtag-select"
                    value={subtag || ""}
                    onChange={(e) => updateEditor(id, "subtag", e.target.value)}
                >
                    <option value="">小タスクを選択 </option>
                    {(subtagOptionMap[tag] || []).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
                <MarkdownEditor3
                    value={text}
                    onChange={(val) => updateEditor(id, "text", val)}
                />
            </div>
          ))}
        </div>
        <button onClick={addEditor} className="add-editor-button">増やす</button>
      </div>

      {/* 右：まとめエリア */}
      <div className="summary-column">
        <h2>まとめ</h2>
        <button onClick={() => saveMarkdownToFile4(groupedByTag)} className="save-summary-button">まとめを保存</button>
        <div className="summary-scroll-area">
          {Object.entries(groupedByTag).map(([tag, subtagObj]) => (
            <div key={tag} className="summary-tag-group">
                <h3>{`まとめ：${tag}`}</h3>
                {Object.entries(subtagObj).map(([subtag, texts]) => (
                    <div key={subtag} className="summary-subtag-group">
                        <h4>▶ {subtag}</h4>
                        {texts.map((txt, idx) => (
                        <div
                            key={idx}
                            className="markdown-content"
                            dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(marked(txt)),
                            }}
                        />
                        ))}
                    </div>
                    ))}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DailyEditor;
