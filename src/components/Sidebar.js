import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/sidebar.css';

import appIcon from "../assets/appicon.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "ホーム", path: "/" },
    { label: "日報エディタ", path: "/daily-editor" },
    { label: "日報閲覧", path: "/see-reports" },
    { label: "タスクリスト", path: "/tasks" },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={appIcon} alt="App Icon" className="app-icon" />
      </div>
      <div>
        {menuItems.map(item => (
          <button
            key={item.path}
            className={`sidebar-button ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
