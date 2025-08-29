import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/sidebar.css';

import appIcon from "../assets/appicon.png";

// Sidebar コンポーネントのスタイル（インラインスタイルでシンプルに）
const sidebarStyle = {
  width: '200px',
  backgroundColor: '#f0f0f0',
  padding: '15px',
  boxSizing: 'border-box',
  // height: '100vh', // 全体の高さに合わせる
  // position: 'fixed', // スクロールしても固定
  // top: 0,
  // left: 0,
  borderRight: '1px solid #ddd',
};

const navItemStyle = {
  padding: '10px 0',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  listStyle: 'none', // リストの点を除去
};

const navItemLastStyle = {
  padding: '10px 0',
  cursor: 'pointer',
  listStyle: 'none', // リストの点を除去
};

// const Sidebar = () => {
//   const navigate = useNavigate();
//   return (
//     <div>
//       <button onClick={() => navigate("/daily-editor")}>エディタ</button>
//       <button onClick={() => navigate("/see-reports")}>閲覧</button>
//       <button onClick={() => navigate("/weekly-reports")}>週報</button>
//       <button onClick={() => navigate("/summary-notes")}>まとめ</button>
//       <button onClick={() => navigate("/tasks")}>タスク</button>
//       {/* 他も同様に */}
//     </div>
//   );
// };

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={appIcon} alt="App Icon" className="app-icon" />
      </div>
      <div>
        <button className="sidebar-button" onClick={() => navigate("/")}>ホーム</button>
        <button className="sidebar-button" onClick={() => navigate("/daily-editor")}>日報エディタ</button>
        <button className="sidebar-button" onClick={() => navigate("/see-reports")}>日報閲覧</button>
        {/* <button className="sidebar-button" onClick={() => navigate("/weekly-reports")}>週報</button>
        <button className="sidebar-button" onClick={() => navigate("/summary-notes")}>まとめ</button> */}
        <button className="sidebar-button" onClick={() => navigate("/tasks")}>タスクリスト</button>
      </div>
    </div>
  );
};

export default Sidebar;


// function Sidebar({ onNavigate }) {
//   return (
//     <div style={sidebarStyle}>
//       <h2>ナビゲーション</h2>
//       <ul style={{ padding: 0 }}> {/* ulのデフォルトのパディングを除去 */}
//         <li style={navItemStyle} onClick={() => onNavigate('dashboard')}>ダッシュボード</li>
//         <li style={navItemStyle} onClick={() => onNavigate('daily-editor')}>日報editor</li>
//         <li style={navItemStyle} onClick={() => onNavigate('see-reports')}>閲覧</li>
//         <li style={navItemStyle} onClick={() => onNavigate('summary-notes')}>まとめノート</li>
//         <li style={navItemStyle} onClick={() => onNavigate('tasks')}>課題リスト</li>
//         <li style={navItemLastStyle} onClick={() => onNavigate('settings')}>設定</li>
//       </ul>
//     </div>
//   );
// }
