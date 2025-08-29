import React from "react";
import { useNavigate } from "react-router-dom";

// サンプル用アイコン（画像でもFontAwesomeでもOK）
const sampleIcon = "https://via.placeholder.com/64";

import dailyIcon from "./assets/editor.png";
import seeIcon from "./assets/see.png";
import tasksIcon from "./assets/tasklist.png";

const WelcomePage = () => {
  const navigate = useNavigate();

  // ボタンデータの配列
  const featureButtons = [
    {
      label: "エディタ",
      icon: dailyIcon,
      path: "/daily-editor",
      summary: "日報の作成・編集・保存ができます"
    },
    {
      label: "日報保存",
      icon: seeIcon,
      path: "/see-reports",
      summary: "作成した日報を見ることができます"
    },
    {
      label: "タスクリスト",
      icon: tasksIcon,
      path: "/tasks",
      summary: "タスク管理ができます"
    }
  ];

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>ようこそ！My Notes Appへ</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        {featureButtons.map((btn) => (
            <div 
            style={{
                width: "200px",
                }}
            >
            <img
                key={btn.label}
                src={btn.icon}
                alt={btn.label}
                onClick={() => navigate(btn.path)}
                style={{
                width: "150px",
                height: "150px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.2s",
                objectFit: "cover",
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
            />
            <p>{btn.summary}</p>
          </div>
        ))}
      </div>
    
    <div>
        <h2>Tips</h2>
        <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
            <p>・「エディタ」機能では、日報を作成できます！</p>
            <p>　無作為に作成したメモを、設定したタグごとに自動でまとめます</p>
            <p>・「日報閲覧」機能では、作成した日報を閲覧できます！</p>
            <p>　カレンダーから選択した日付の日報が見れます</p>
            <p>・「タスクリスト」機能では、タスクを作成・管理できます！</p>
            <p>　作成したタスクがそのまま「タグ」候補となります</p>
        </div>
    </div>


    </div>
  );
};

export default WelcomePage;
