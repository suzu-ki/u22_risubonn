import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
import '../styles/DailyReportCalendar.css'; // 新しいCSSファイルをインポート

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 任意のテーマを指定

// import { loadMarkdownByDate } from "../utils/loadUtil";

const mockReports = {
  "2025-05-28": "今日はプロジェクトのUI設計を進めた。",
  "2025-05-27": "Electronとの統合作業に苦戦した。",
  // ...他の日付
};

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

const loadMarkdownByDate = async (dateObj) => {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const filename = `${yyyy}-${mm}-${dd}.md`;

  // const result = await window.electronAPI.readFile("diary", filename);

  // if (result.success) {
  //   return result.content;
  // } else {
  //   console.error("読み込みエラー:", result.error);
  //   return null;
  // }
  try {
    const result = await window.electronAPI.readFile("diary", filename);
    if (result.success) {
      return result.content;
    } else {
      console.error("読み込みエラー:", result.error);
      return null;
    }
  } catch (err) {
    console.error("通信エラー:", err);
    return null;
  }
};

const DailyReportCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaryContent, setDiaryContent] = useState("");


  const handleDateChange = (date) => {
    setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
  };

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
    }, [diaryContent]);

  // return (
  //   <div style={{ display: "flex", gap: "30px" }}>
  //     <Calendar
  //       onClickDay={async (value) => {
  //         const content = await loadMarkdownByDate(value);
  //         if (content) {
  //           setDiaryContent(content);  // useStateで管理
  //         } else {
  //           setDiaryContent("その日の記録はありません。");
  //         }
  //       }}
  //     />
  //     <div>
  //       <h3>選択した日の日報</h3>
  //       <div
  //         className="markdown-content"
  //         dangerouslySetInnerHTML={{
  //           __html: DOMPurify.sanitize(marked(diaryContent)),
  //         }}
  //       ></div>
  //     </div>

  //     {/* <Calendar onChange={handleDateChange} />
  //     <div>
  //       <h2>日報</h2>
  //       {selectedDate && (
  //         <div>
  //           <h3>{selectedDate}</h3>
  //           <p>{mockReports[selectedDate] || "まだ日報がありません。"}</p>
  //         </div>
  //       )}
  //     </div> */}
  //   </div>
  // );
  return (
    <div className="daily-report-container">
      <Calendar
        className="report-calendar" // カレンダーにクラスを付与
        onClickDay={async (value) => {
          const content = await loadMarkdownByDate(value);
          if (content) {
            setDiaryContent(content);  // useStateで管理
          } else {
            setDiaryContent("その日の記録はありません。");
          }
        }}
      />
      <div className="report-content-area">
        <h3 className="report-content-title">選択した日の日報</h3>
        <div
          className="markdown-content" // Markdown表示部分に既存のクラスを再利用
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked(diaryContent)),
          }}
        ></div>
      </div>
    </div>
  );
};

export default DailyReportCalendar;
