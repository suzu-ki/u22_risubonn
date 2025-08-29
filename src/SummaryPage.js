import React, { useEffect, useState } from "react";

const SummaryPage = () => {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("editorData");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const groupedByTag = parsed.reduce((acc, { tag, text }) => {
      if (!tag) return acc;
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(text);
      return acc;
    }, {});

    setGrouped(groupedByTag);
  }, []);

  return (
    <div>
      <h2>まとめ</h2>
      {Object.entries(grouped).map(([tag, texts]) => (
        <div key={tag} style={{ marginBottom: "20px" }}>
          <h3>{`<まとめ：${tag}>`}</h3>
          {texts.map((txt, idx) => (
            <pre key={idx} style={{ background: "#f5f5f5", padding: "10px" }}>
              {txt}
            </pre>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SummaryPage;
