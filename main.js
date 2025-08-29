const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const ExcelJS = require("exceljs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools(); //debugツール表示
}

app.whenReady().then(createWindow);

const storageDir = path.join(os.homedir(), "保管庫");
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

const efilePath = path.join(storageDir, 'task.xlsx');

// ----- Excel ファイル新規作成 -----
async function createEmptyExcel() {
  if (!fs.existsSync(efilePath)) {
    const wb = new ExcelJS.Workbook();
    const taskSheet = wb.addWorksheet("タスクリスト");
    taskSheet.addRow(["大タスク名","内容","期日","進捗","備考","id","重要度","check"]);
    const subtaskSheet = wb.addWorksheet("サブタスクリスト");
    subtaskSheet.addRow(["id","内容","完了","subid"]);
    await wb.xlsx.writeFile(efilePath);
  }
}

// ----- Excel 読み込み -----
async function readExcelTasks() {
  await createEmptyExcel();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(efilePath);

  const taskSheet = wb.getWorksheet("タスクリスト");
  const subtaskSheet = wb.getWorksheet("サブタスクリスト");

  const taskData = taskSheet.getSheetValues().slice(2).map(row => ({
    大タスク名: row[1],
    内容: row[2],
    期日: row[3],
    進捗: row[4],
    備考: row[5],
    id: row[6],
    重要度: row[7],
    check: row[8]
  }));

  const subtaskData = subtaskSheet.getSheetValues().slice(2).map(row => ({
    id: row[1],
    内容: row[2],
    完了: row[3],
    subid: row[4]
  }));

  // グループ化
  const groupMap = {};
  const taskGroups = [];
  let t_num = 1;

  for (const task of taskData) {
    const groupTitle = task.大タスク名;
    const taskId = task.id;

    const subtasks = subtaskData
      .filter(sub => sub.id === taskId)
      .map(sub => ({
        id: sub.subid,
        内容: sub.内容,
        進捗: sub.完了 ?? false
      }));

    const midTask = {
      id: taskId,
      内容: task.内容,
      期日: task.期日,
      進捗: task.進捗,
      備考: task.備考,
      重要度: task.重要度,
      subtasks,
      check: task.check ?? false
    };

    if (!groupMap[groupTitle]) {
      const newGroup = { id: t_num, title: groupTitle, tasks: [midTask] };
      groupMap[groupTitle] = newGroup;
      taskGroups.push(newGroup);
      t_num++;
    } else {
      groupMap[groupTitle].tasks.push(midTask);
    }
  }

  return taskGroups;
}

// ----- Excel 書き込み -----
// ----- Excel 書き込み -----
async function saveExcelTasks(middleTask, smallTask) {
  await createEmptyExcel();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(efilePath);

  const taskSheet = wb.getWorksheet("タスクリスト");
  const subtaskSheet = wb.getWorksheet("サブタスクリスト");

  // 中タスク追加・更新
  if (middleTask) {
    let found = false;
    taskSheet.eachRow((row) => {
      if (row.getCell(6).value === middleTask.id) {
        row.getCell(1).value = middleTask.title;
        row.getCell(2).value = middleTask.内容;
        row.getCell(3).value = middleTask.期日;
        row.getCell(4).value = middleTask.進捗;
        row.getCell(5).value = middleTask.備考;
        row.getCell(7).value = middleTask.重要度;
        row.getCell(8).value = middleTask.check ? "TRUE" : "FALSE";
        found = true;
      }
    });
    if (!found) {
      taskSheet.addRow([
        middleTask.title,
        middleTask.内容,
        middleTask.期日,
        middleTask.進捗,
        middleTask.備考,
        middleTask.id,
        middleTask.重要度,
        middleTask.check ? "TRUE" : "FALSE"
      ]);
    }
  }

  // 小タスク追加・更新
  if (smallTask) {
    let found = false;
    console.log("aaa")
    subtaskSheet.eachRow((row, rowNumber) => {
      // 型を統一して比較
      if (String(row.getCell(4).value) === String(smallTask.subid)) {
        row.getCell(1).value = smallTask.id;
        row.getCell(2).value = smallTask.内容;
        row.getCell(3).value = Boolean(smallTask.完了); // TRUE/FALSE 確実に反映
        found = true;
      }
    });
    if (!found) {
      subtaskSheet.addRow([
        smallTask.id,
        smallTask.内容,
        Boolean(smallTask.完了),
        smallTask.subid
      ]);
    }
  }

  await wb.xlsx.writeFile(efilePath);
}

async function saveExcelTasks_oo(middleTask, smallTask) {
  await createEmptyExcel();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(efilePath);

  const taskSheet = wb.getWorksheet("タスクリスト");
  const subtaskSheet = wb.getWorksheet("サブタスクリスト");

  // 中タスク追加・更新
  if (middleTask) {
    let found = false;
    taskSheet.eachRow((row, rowNumber) => {
      if (row.getCell(6).value === middleTask.id) {
        row.getCell(1).value = middleTask.title;
        row.getCell(2).value = middleTask.内容;
        row.getCell(3).value = middleTask.期日;
        row.getCell(4).value = middleTask.進捗;
        row.getCell(5).value = middleTask.備考;
        row.getCell(7).value = middleTask.重要度;
        row.getCell(8).value = middleTask.check;
        found = true;
      }
    });
    if (!found) {
      taskSheet.addRow([
        middleTask.title, middleTask.内容, middleTask.期日, middleTask.進捗,
        middleTask.備考, middleTask.id, middleTask.重要度, middleTask.check
      ]);
    }
  }

  // 小タスク追加・更新
  // if (smallTask) {
  //   let found = false;
  //   subtaskSheet.eachRow((row, rowNumber) => {
  //     if (row.getCell(4).value === smallTask.subid) {
  //       row.getCell(1).value = smallTask.id;
  //       row.getCell(2).value = smallTask.内容;
  //       row.getCell(3).value = smallTask.完了;
  //       found = true;
  //     }
  //   });
  //   if (!found) {
  //     subtaskSheet.addRow([smallTask.id, smallTask.内容, smallTask.完了, smallTask.subid]);
  //   }
  // }
  // 小タスク追加・更新
  if (smallTask) {
    let found = false;
    subtaskSheet.eachRow((row) => {
      if (String(row.getCell(4).value) === String(smallTask.subid)) {
        row.getCell(1).value = smallTask.id;      // 中タスクID
        row.getCell(2).value = smallTask.内容;
        row.getCell(3).value = smallTask.完了;
        found = true;
      }
    });
    if (!found) {
      subtaskSheet.addRow([
        smallTask.id, smallTask.内容, smallTask.完了, smallTask.subid
      ]);
    }
  }


  await wb.xlsx.writeFile(efilePath);
}

// ----- IPC ハンドラ -----
ipcMain.handle("read-excel-tasks", async () => {
  return await readExcelTasks();
});

ipcMain.handle("save-excel-tasks", async (event, middleTask, smallTask) => {
  await saveExcelTasks(middleTask, smallTask);
  return { success: true, path: efilePath };
});

// ----- 他のファイル操作は従来どおり -----
ipcMain.handle("save-file", async (event, data) => {
  const filePath = path.join(app.getPath("documents"), "preview.html");
  fs.writeFileSync(filePath, data);
  return filePath;
});

ipcMain.handle("save-file2", async (event, filename, content) => {
  const filePath = path.join(storageDir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
});

ipcMain.handle("save-file3", async (event, subfolder, filename, content) => {
  const folderPath = path.join(storageDir, subfolder);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  const filePath = path.join(folderPath, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
});

ipcMain.handle("read-file", async (event, subDir, filename) => {
  const baseDir = path.join(storageDir, subDir);
  const filePath = path.join(baseDir, filename);
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return { success: true, content: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
