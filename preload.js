const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveFile: (data) => ipcRenderer.invoke("save-file", data),
  saveFile2: (filename, content) => ipcRenderer.invoke('save-file2', filename, content),
  saveFile3: (subfolder, filename, content) => ipcRenderer.invoke("save-file3", subfolder, filename, content),
  readFile: (subDir, filename) => ipcRenderer.invoke('read-file', subDir, filename),
  saveExcel: (bufferData) => ipcRenderer.invoke('save-excel-file', bufferData),
  readExcel: () => ipcRenderer.invoke('read-excel-file'),
  saveExceldata: (middleTask, smallTask) => ipcRenderer.invoke('save-excel-tasks', middleTask, smallTask),
  readExceldata: () => ipcRenderer.invoke('read-excel-tasks'),
});
