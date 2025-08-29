import React, { useState, useMemo, useEffect } from "react";
import DOMPurify from "dompurify";         // ← 追加
// import * as XLSX from 'xlsx'
import { marked } from "marked";
marked.setOptions({
    breaks: true,
    gfm: true,
    tables: true,
  });

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Sidebar from './components/Sidebar'; 
import TaskTable from "./components/TaskTable";
import { saveMarkdownToFile, saveHtmlLocally2, saveMarkdownToFile3 } from "./utils/saveUtil";
import DailyReportCalendar from './components/DailyReportCalendar'; 
import DailyEditor from './components/DailyEditor'; 
import WelcomePage from './WelcomePage'; 
// import TaskRecommendationModal from './components/TaskRecommendationModal'; // 新規作成

// import Home from "./Home"; // 仮のトップページ



// --- スタイル定義 ---
// const appContainerStyle = {
//   display: 'flex',       // アプリ全体を3列で横並びにする
//   height: '100vh',       // ビューポートの高さ全体を使う
//   width: '100vw',        // ビューポートの幅全体を使う
//   overflow: 'hidden',    // 全体のスクロールはなし
// };
const appContainerStyle = {
  display: 'grid',         // CSS Gridを使用
  gridTemplateColumns: '250px 1fr', // 左カラム（Sidebar+LLM）の幅と、右カラム（MainContent）の幅
  gridTemplateRows: '1fr', // 行は1つ（コンテンツの高さは内部で調整）
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
};
const leftColumnStyle = { // 新しい左カラム全体を定義するスタイル
  gridColumn: '1 / 2',
  gridRow: '1 / 2',
  display: 'grid', // さらに内部でグリッドを組む
  gridTemplateRows: '1fr auto', // 上半分(Sidebar)と下半分(MessagePanel)
  borderRight: '1px solid #ccc',
  overflowY: 'hidden', // 左カラム全体のスクロールはなし（内部で調整）
};

const sidebarStyle = { // Sidebarのスタイルを調整
  gridRow: '1 / 2', // leftColumn内の1行目
  flexShrink: 0,
  width: '100%', // 親（leftColumn）の幅に合わせる
  overflowY: 'auto', // サイドバー自体はスクロール可能
  backgroundColor: '#f8f8f8',
};

const fileListWrapperStyle = {
  flexShrink: 0,       // 幅が縮まらないように
  width: '250px',      // FileListを表示するエリアの固定幅
  height: '100vh',       // ビューポートの高さ全体を使う
  // marginRight: '20px', // メインコンテンツとの間隔
  borderRight: '1px solid #ccc', // 区切り線
  // padding: '20px',
  overflowY: 'auto',   // ファイルリストが長くなったらスクロール
};

// メインコンテンツエリアのスタイル (右端の領域)
// const mainContentAreaStyle = {
//   flexGrow: 1,         // 残りの幅をすべて占める
//   padding: '20px',
//   overflowY: 'auto',   // メインコンテンツが長くなったらスクロール
// };

const mainContentAreaStyle = {
  gridColumn: '2 / 3', // 2列目
  gridRow: '1 / 2',    // 1行目
  padding: '20px',
  overflowY: 'auto',   // メインコンテンツが長くなったらスクロール
  backgroundColor: '#ffffff',
};

const ColumStyle = {
    flex: 1, 
    overflow: "auto", 
    border: "1px solid #ccc", 
    padding: "10px" 
}


const messagePanelStyle = { // MessagePanelのスタイルを調整
  gridRow: '2 / 3', // leftColumn内の2行目
  borderTop: '1px solid #ccc', // Sidebarとの区切り線
  padding: '15px 20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  backgroundColor: '#e0e0e0',
  maxHeight: '200px', // LLMパネルの最大高さ
  overflowY: 'auto',
};

const systemMessageStyle = {
  marginBottom: '10px',
  fontSize: '0.9em',
  color: '#333',
};


const taskLists = [{
    id: 1,
    title: "プロコン",
    tasks: [
      { id: 1, 内容: "実装", 期日: "5/30", 進捗: 0, 備考: "", 重要度: 1,
        subtasks: [
        { id: 1, 内容: "設計", 達成: false },
        { id: 2, 内容: "コーディング", 達成: false },
      ],
      check: false
       },
      { id: 2, 内容: "動画", 期日: "6/1", 進捗: 0, 備考: "5分の動画作成", 重要度: 1,
        subtasks: [],
        check: false
       },
    ],
}];

const App = () => {
  // const [currentPage, setCurrentPage] = useState('dashboard');
  const [editors, setEditors] = useState([
    { id: 0, tag: "", subtag: "", text: "" },
  ]);
  // App.js
  // const [taskGroups, setTaskGroups] = useState(taskLists);
  const [taskGroups, setTaskGroups] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

  // LLM関連のState
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  // const [systemMessage, setSystemMessage] = useState("こんにちは！何かお手伝いできることはありますか？"); // システムメッセージ

  // ★追加：仮ポップアップ用State
  const [showConsultationPopup, setShowConsultationPopup] = useState(false);


  useEffect(() => {
    const load = async () => {
      console.log("loadExcelFile を呼び出し");
      const data = await window.electronAPI.readExceldata();
      setTaskGroups(data);  // ← ここで読み込んだデータをセット
    };
    load();
    console.log(taskGroups);
  }, []);  // ← 初回のみ実行

  const tagOptions = Array.from(
    new Set(taskGroups.flatMap(group => group.tasks.map(task => task.内容)))
  );

  const subtagOptionMap = useMemo(() => {
    const map = {};
    taskGroups.forEach(group => {
      group.tasks.forEach(task => {
        if (!map[task.内容]) {
          map[task.内容] = [];
        }
        if (task.subtasks) {
          task.subtasks.forEach(sub => {
            if (!map[task.内容].includes(sub.内容)) {
              map[task.内容].push(sub.内容);
            }
          });
        }
      });
    });
    return map;
  }, [taskGroups]);

  const addEditor = () => {
    setEditors((prev) => [
      ...prev,
      { id: prev.length, tag: "", text: "" },
    ]);
  };

  const updateEditor = (id, key, value) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === id ? { ...editor, [key]: value } : editor
      )
    );
  };

  // タグごとのまとめ
  // const groupedByTag = editors.reduce((acc, editor) => {
  //   if (!editor.tag) return acc;
  //   if (!acc[editor.tag]) acc[editor.tag] = [];
  //   acc[editor.tag].push(editor.text);
  //   return acc;
  // }, {});
  const groupedByTag = editors.reduce((acc, editor) => {
    if (!editor.tag) return acc;
    if (!acc[editor.tag]) acc[editor.tag] = {};
    if (!acc[editor.tag][editor.subtag]) acc[editor.tag][editor.subtag] = [];
    acc[editor.tag][editor.subtag].push(editor.text);
    return acc;
  }, {});


  // const handleSave = () => {
  //   let combined = "";
  //   for (const [tag, texts] of Object.entries(groupedByTag)) {
  //     combined += `## ${tag}\n\n`;
  //     combined += texts.join("\n\n") + "\n\n";
  //   }
  //   saveHtmlLocally2(combined);
  // };

  // LLMからの推薦タスクを受け取るハンドラ

  // ユーザーが推薦タスクを採用するかどうかを処理

  // ポップアップ表示のロジック（例：サブタスク完了時）
  // 例えば、TaskTableコンポーネントでサブタスクの完了状態が変更されたことを
  // App.jsに通知するコールバック関数を渡すことで、ここでポップアップを制御できます。
  // const handleSubtaskCompletion = () => {
  //   setSystemMessage("サブタスクが完了しましたね！次のステップについてAIに相談してみませんか？");
  //   // ここでポップアップを表示するStateなどを設定することも可能
  //   // ただし、今回はLLMボタンをクリックした時に表示する形式なので、直接モーダルは出さない
  // };

  return (
    <Router>
      <div style={appContainerStyle}>
        {/* 左カラム全体（SidebarとMessagePanelを含む） */}
        <div style={leftColumnStyle}>
          {/* サイドバー */}
          <div style={sidebarStyle}>
            <Sidebar />
          </div>

          {/* メッセージ欄とLLMボタン */}
          
        </div>

        <div style={mainContentAreaStyle}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            {/* <Route path="/" element={
              <div>
                <h1>ようこそ！My Notes Appへ</h1>
                <p>このアプリでは、メモの整理、日報保存、タスクリスト作成ができます。</p>
                  <div style={{marginTop: "20px"}}>
                    <button onClick={() => navigate("/daily-editor")}>メモ整理</button>
                  </div>
              </div>
            } /> */}
            <Route
              path="/daily-editor"
              element={
                <DailyEditor
                  editors={editors}
                  updateEditor={updateEditor}
                  addEditor={addEditor}
                  groupedByTag={groupedByTag}
                  tagOptions={tagOptions}
                  subtagOptionMap={subtagOptionMap}
                />
              }
            />
            <Route path="/see-reports" element={<DailyReportCalendar />} />
            <Route path="/weekly-reports" element={<div>ああ</div>} />
            <Route path="/summary-notes" element={<div>ああ</div>} />
            <Route
              path="/tasks"
              element={
                <TaskTable
                  taskGroups={taskGroups}
                  setTaskGroups={setTaskGroups}
                  tagOptions={tagOptions}
                  selectedTask={selectedTask}
                  setSelectedTask={setSelectedTask}
                />
              }
            />
            {/* <Route path="/settings" element={<div>ああ</div>} /> */}
          </Routes>
        </div>
        {/* 推薦タスクモーダル 
        {showRecommendationModal && (
          <TaskRecommendationModal
            recommendedTasks={recommendedTasks}
            onApply={applyRecommendedTasks}
            onCancel={cancelRecommendation}
          />
        )}
        */}
        {/* ★追加：相談ポップアップ 
        {showConsultationPopup && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            zIndex: 1001,
            textAlign: 'center',
            maxWidth: '350px',
          }}>
            <h3>AIに相談してみませんか？</h3>
            <p>サブタスクが完了しましたね。次のステップについてAIが提案できます。</p>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={handleConsultationAccept}
                style={{ padding: '8px 15px', fontSize: '1em', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                はい、相談する
              </button>
              <button
                onClick={handleConsultationDecline}
                style={{ padding: '8px 15px', fontSize: '1em', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                いいえ、結構です
              </button>
            </div>
          </div>
        )}
        */}
        {/* ポップアップ表示中は背景を暗くするオーバーレイ 
        {showConsultationPopup && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }} onClick={handleConsultationDecline}></div> // オーバーレイクリックで閉じる
        )}
        */}
      </div>
    </Router>
  );
};

export default App;
