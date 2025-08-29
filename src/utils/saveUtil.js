export const saveHtmlLocally = async (html) => {
  if (window.electronAPI?.saveFile) {
    const filePath = await window.electronAPI.saveFile(html);
    console.log("Saved to:", filePath);
  }
};

// src/utils/saveUtil.js

export function saveMarkdownToFile(groupedByTag, filename = "summary.md") {
  let combined = "";
  for (const [tag, texts] of Object.entries(groupedByTag)) {
    combined += `## ${tag}\n\n`;
    combined += texts.join("\n\n") + "\n\n";
  }

  const blob = new Blob([combined], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


export const saveHtmlLocally2 = async (html) => {
  // Reactなどのフロント側
  window.electronAPI.saveFile2('summary.md', 'ファイルの中身テキスト').then((savedPath) => {
    console.log('保存完了:', savedPath);
  });
};

const saveSummaryToDiary = async () => {
  let combined = "";
  for (const [tag, texts] of Object.entries(groupedByTag)) {
    combined += `## ${tag}\n\n`;
    combined += texts.join("\n\n") + "\n\n";
  }

  try {
    const savedPath = await window.electronAPI.saveFile("diary", "summary.md", combined);
    console.log("日報として保存しました:", savedPath);
  } catch (err) {
    console.error("保存エラー:", err);
  }
};

export async function saveMarkdownToFile3(groupedByTag) {
  let combined = "";
  for (const [tag, texts] of Object.entries(groupedByTag)) {
    combined += `## ${tag}\n\n`;
    combined += texts.join("\n\n") + "\n\n";
  }

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;
  const mdfilename = `${dateStr}.md`;

  try {
    const savedPath = await window.electronAPI.saveFile3("diary", mdfilename, combined);
    console.log("日報として保存しました:", savedPath);
  } catch (err) {
    console.error("保存エラー:", err);
  }
}

// export async function saveMarkdownToFile4(groupedByTag) {
//   let combined = "";

//   for (const [tag, subtagObj] of Object.entries(groupedByTag)) {
//     combined += `# Tag: ${tag} << \n\n`;
//     combined += `---------------\n`;
//     for (const [subtag, texts] of Object.entries(subtagObj)) {
//       combined += `##  SubTag: ${subtag}<<< \n`;
//       texts.forEach((text) => {
//         // インデントを入れて箇条書き表示
//         // combined += `  - ${text.replace(/\n/g, '\n    ')}\n`;
//         combined += texts.join("\n\n") + "\n\n";
//       });
//       combined += "\n";
//     }
//   }

//   const now = new Date();
//   const yyyy = now.getFullYear();
//   const mm = String(now.getMonth() + 1).padStart(2, "0");
//   const dd = String(now.getDate()).padStart(2, "0");
//   const dateStr = `${yyyy}-${mm}-${dd}`;
//   const mdfilename = `${dateStr}.md`;

//   try {
//     const savedPath = await window.electronAPI.saveFile3("diary", mdfilename, combined);
//     console.log("日報として保存しました:", savedPath);
//   } catch (err) {
//     console.error("保存エラー:", err);
//   }
// }

export async function saveMarkdownToFile4(groupedByTag) {
  let combined = "";

  for (const [tag, subtagObj] of Object.entries(groupedByTag)) {
    combined += `# >> Tag: ${tag}\n\n`;
    combined += `---------------\n\n`;

    for (const [subtag, texts] of Object.entries(subtagObj)) {
      combined += `## >>> SubTag: ${subtag}\n\n`;

      texts.forEach((text) => {
        // 箇条書き + インデント整形
        combined += `- ${text.replace(/\n/g, '\n  ')}\n`;
      });

      combined += `\n`; // サブタグごとに区切り
    }
  }

  // const blob = new Blob([combined], { type: "text/markdown" });
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "summary.md";
  // a.click();
  // URL.revokeObjectURL(url);
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;
  const mdfilename = `${dateStr}.md`;

  try {
    const savedPath = await window.electronAPI.saveFile3("diary", mdfilename, combined);
    console.log("日報として保存しました:", savedPath);
  } catch (err) {
    console.error("保存エラー:", err);
  }
}


