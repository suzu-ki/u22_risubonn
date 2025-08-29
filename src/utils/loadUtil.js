// const loadMarkdownByDate = async (dateObj) => {
//   const yyyy = dateObj.getFullYear();
//   const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
//   const dd = String(dateObj.getDate()).padStart(2, "0");
//   const filename = `${yyyy}-${mm}-${dd}.md`;

//   const result = await window.electronAPI.readFile("diary", filename);

//   if (result.success) {
//     return result.content;
//   } else {
//     console.error("読み込みエラー:", result.error);
//     return null;
//   }
// };
