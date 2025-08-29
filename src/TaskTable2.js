import React, { useState } from "react";

export const taskLists = [{
    id: 1,
    title: "プロコン",
    tasks: [
      { id: 1, 内容: "実装", 期日: "5/30", 進捗: 80, 備考: "" },
      { id: 2, 内容: "動画", 期日: "6/1", 進捗: 10, 備考: "5分の動画作成" },
    ],
  }];

const TaskTable = ({ tagOptions, setTagOptions }) => {
  const [taskGroups, setTaskGroups] = useState(
    taskLists
    );

  const addGroup = () => {
    const newGroupId = Date.now();
    setTaskGroups([
      ...taskGroups,
      { id: newGroupId, title: "新しい大タスク", tasks: [] },
    ]);
  };

  const addTaskToGroup = (groupId) => {
    setTaskGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: [
                ...group.tasks,
                {
                  id: Date.now(),
                  内容: "",
                  期日: "",
                  進捗: 0,
                  備考: "",
                },
              ],
            }
          : group
      )
    );
  };

  const updateTask = (groupId, taskId, key, value) => {
    setTaskGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId ? { ...task, [key]: value } : task
              ),
            }
          : group
      )
    );
    setTagOptions([...tagOptions, value]);
  };

  const deleteTask = (groupId, taskId) => {
    setTaskGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.filter((task) => task.id !== taskId),
            }
          : group
      )
    );
  };

  const updateGroupTitle = (groupId, value) => {
    setTaskGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, title: value } : group
      )
    );
  };

  return (
    <div>
      {taskGroups.map((group) => (
        <div key={group.id} style={{ marginBottom: "30px" }}>
          <input
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "5px",
              width: "100%",
            }}
            value={group.title}
            onChange={(e) => updateGroupTitle(group.id, e.target.value)}
          />
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>内容</th>
                <th>期日</th>
                <th>進捗(%)</th>
                <th>備考欄</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {group.tasks.map(({ id, 内容, 期日, 進捗, 備考 }) => (
                <tr key={id}>
                  <td>
                    <input
                      value={内容}
                      onChange={(e) => updateTask(group.id, id, "内容", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={期日}
                      onChange={(e) => updateTask(group.id, id, "期日", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={進捗}
                      min="0"
                      max="100"
                      onChange={(e) => updateTask(group.id, id, "進捗", Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      value={備考}
                      onChange={(e) => updateTask(group.id, id, "備考", e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => deleteTask(group.id, id)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addTaskToGroup(group.id)} style={{ marginTop: "5px" }}>
            小タスク追加
          </button>
        </div>
      ))}
      <button onClick={addGroup}>大タスクを追加</button>
    </div>
  );
};

export default TaskTable;

