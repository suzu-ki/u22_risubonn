
const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Data = reader.result.split(',')[1]; // base64部分だけ抽出
    try {
      const savedPath = await window.electronAPI.saveExcel(base64Data);
      console.log('保存成功:', savedPath);
    } catch (e) {
      console.error('保存失敗:', e);
    }
  };
  reader.readAsDataURL(file); // base64形式のDataURLとして読み込む
};

// utils/excel.jsなどに
export async function saveExcelFile(base64Data) {
  try {
    // base64DataはBase64文字列（ファイル読み込みなどで作成）
    // そのままipcRendererでmainに渡す
    const savedPath = await window.electronAPI.saveExcel(base64Data);
    console.log("Excelファイル保存成功:", savedPath);
    return savedPath;
  } catch (error) {
    console.error("Excelファイル保存失敗:", error);
    throw error;
  }
}

export async function loadExcelFile(){
//   filename = 'task.xlsx'
  const res = await window.electronAPI.readExcel();
  if (res.success) {
    const base64 = res.content;
    // 必要に応じてBlobやファイルに変換して処理
    // console.log(base64);
    return base64
  } else {
    console.error('読み込みエラー:', res.error);
    return null
  }
};


// import React, { useState } from "react";
// import * as XLSX from "xlsx";

// const ExcelLoader = () => {
//   const [taskLists, setTaskLists] = useState([]);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const data = evt.target.result;
//       const workbook = XLSX.read(data, { type: "binary" });

//       // 最初のシート名を取得
//       const firstSheetName = workbook.SheetNames[0];
//       // シートデータをJSONに変換
//       const worksheet = workbook.Sheets[firstSheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);

//       // jsonDataを状態にセット
//       setTaskLists(jsonData);
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//       <pre>{JSON.stringify(taskLists, null, 2)}</pre>
//     </div>
//   );
// };

// export default ExcelLoader;
