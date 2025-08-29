import React, { useState } from "react";
import '../styles/tasktable.css';

const TaskTable = ({ taskGroups, setTaskGroups, tagOptions, selectedTask, setSelectedTask }) => {
  const [newTaskInputs, setNewTaskInputs] = useState({});
  const [newSubtaskInputs, setNewSubtaskInputs] = useState({});
  const [showIncompleteTasks, setShowIncompleteTasks] = useState(true);

  const handleNewTaskInput = (groupId, key, value) => {
    setNewTaskInputs((prev) => ({
      ...prev,
      [groupId]: {
        ...(prev[groupId] || { 内容: "", 期日: "", 進捗: 0, 備考: "", 重要度: 1 }),
        [key]: value,
      },
    }));
  };

  const addGroup = () => {
    const newGroupId = Date.now();
    setTaskGroups([...taskGroups, { id: newGroupId, title: "新しい大タスク", tasks: [] }]);
  };

  const toggleTaskCheck = (groupId, taskId) => {
    setTaskGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId ? { ...task, check: !task.check } : task
              ),
            }
          : group
      )
    );
  };

  const addTaskToGroup = async(groupId) => {
    const input = newTaskInputs[groupId];
    if (!input || !input.内容) return;

    const newTask = {
      id: Date.now(),
      title: taskGroups.find(g => g.id === groupId)?.title || "",
      ...input,
      subtasks: [],
      check: false,
    };

    setTaskGroups((prev) => {
      const updated = prev.map(group =>
        group.id === groupId ? { ...group, tasks: [...group.tasks, newTask] } : group
      );

      // Excel 保存
      try {
        window.electronAPI.saveExceldata({
          大タスク名: newTask.title,
          内容: newTask.内容,
          期日: newTask.期日,
          進捗: newTask.進捗,
          備考: newTask.備考,
          重要度: newTask.重要度,
          id: newTask.id,
          check: false,
        }, null);
      } catch (e) {
        console.error("Excel保存失敗", e);
      }

      return updated;
    });

    setNewTaskInputs((prev) => ({
      ...prev,
      [groupId]: { 内容: "", 期日: "", 進捗: 0, 備考: "", 重要度: 1 },
    }));
  };

  const updateTask = async(groupId, taskId, key, value) => {
    let newTask;
    setTaskGroups(prev =>
      prev.map(group => {
        if (group.id !== groupId) return group;
        const updatedTasks = group.tasks.map(task => {
          if (task.id !== taskId) return task;
          newTask = { ...task, [key]: value };
          return newTask;
        });
        return { ...group, tasks: updatedTasks };
      })
    );

    try {
      if (newTask) {
        await window.electronAPI.saveExceldata(newTask, null);
      }
    } catch (e) {
      console.error("Excel保存失敗", e);
    }
  };

  const updateGroupTitle = async(groupId, value) => {
    const updatedGroups = taskGroups.map(group =>
      group.id === groupId ? { ...group, title: value } : group
    );
    setTaskGroups(updatedGroups);

    const updatedGroup = updatedGroups.find(g => g.id === groupId);
    if (updatedGroup) {
      for (const task of updatedGroup.tasks) {
        try {
          await window.electronAPI.saveExceldata({
            大タスク名: value,
            内容: task.内容,
            期日: task.期日,
            進捗: task.進捗,
            備考: task.備考,
            重要度: task.重要度,
            id: task.id,
            check: task.check
          }, null);
        } catch (e) {
          console.error("Excel保存失敗", e);
        }
      }
    }
  };

  const toggleSubtaskStatus_o = async(groupId, taskId, subtaskIndex) => {
    let updatedSubtask = null;

    setTaskGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task => {
                if (task.id === taskId) {
                  const newSubtasks = task.subtasks.map((st, idx) => {
                    if (idx === subtaskIndex) {
                      const toggled = { ...st, 進捗: !st.進捗 };
                      updatedSubtask = {
                        id: task.id,
                        subid: st.subid,
                        内容: st.内容,
                        完了: toggled.進捗
                      };
                      return toggled;
                    }
                    return st;
                  });
                  return { ...task, subtasks: newSubtasks };
                }
                return task;
              }),
            }
          : group
      )
    );

    try {
      if (updatedSubtask) {
        await window.electronAPI.saveExceldata(null, updatedSubtask);
      }
    } catch (e) {
      console.error("Excel保存失敗", e);
    }

    setTimeout(() => updateTaskProgressFromSubtasks(groupId, taskId), 0);
  };

    const toggleSubtaskStatus = async (groupId, taskId, subtaskIndex) => {
        let updatedSubtask = null;

        const newTaskGroups = taskGroups.map((group) =>
            group.id === groupId
            ? {
                ...group,
                tasks: group.tasks.map((task) => {
                    if (task.id !== taskId) return task;

                    const newSubtasks = task.subtasks.map((st, idx) => {
                    if (idx === subtaskIndex) {
                        const toggled = { ...st, 進捗: !st.進捗 };
                        updatedSubtask = {
                        id: task.id,
                        subid: st.id,
                        内容: st.内容,
                        完了: toggled.進捗,
                        };
                        return toggled;
                    }
                    return st;
                    });

                    return { ...task, subtasks: newSubtasks };
                }),
                }
            : group
        );

        // state 更新
        setTaskGroups(newTaskGroups);

        // ここで確実に updatedSubtask を使える
        if (updatedSubtask) {
            try {
            // await window.electronAPI.saveExcelTasks(null, updatedSubtask);
            await window.electronAPI.saveExceldata(null, updatedSubtask);
            } catch (e) {
            console.error("Excel 保存失敗", e);
            }
        }
    };



  const updateTaskProgressFromSubtasks = (groupId, taskId) => {
    setTaskGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task => {
                if (task.id !== taskId) return task;
                const total = task.subtasks.length;
                if (total === 0) return { ...task, 進捗: 0 };
                const completed = task.subtasks.filter(s => s.進捗).length;
                const progress = Math.round((completed / total) * 100);
                return { ...task, 進捗: progress };
              }),
            }
          : group
      )
    );
  };

  const addSubtask = async(groupId, taskId) => {
    const input = newSubtaskInputs[taskId];
    if (!input || !input.trim()) return;

    const subid = Date.now();
    const newSubtask = {
      id: taskId,
      subid,
      内容: input.trim(),
      進捗: false
    };

    setTaskGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId
                  ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
                  : task
              ),
            }
          : group
      )
    );

    try {
      await window.electronAPI.saveExceldata(null, {
        id: newSubtask.id,
        subid: newSubtask.subid,
        内容: newSubtask.内容,
        完了: newSubtask.進捗
      });
    } catch (e) {
      console.error("Excel保存失敗", e);
    }

    setNewSubtaskInputs(prev => ({ ...prev, [taskId]: "" }));
    setTimeout(() => updateTaskProgressFromSubtasks(groupId, taskId), 0);
  };

  return (
    <div className="task-management-container">
      {/* 未完了/完了切替 */}
      <div className="task-view-toggle-buttons">
        <button className={`toggle-button ${showIncompleteTasks ? 'active' : ''}`} onClick={() => setShowIncompleteTasks(true)}>未達成タスク</button>
        <button className={`toggle-button ${!showIncompleteTasks ? 'active' : ''}`} onClick={() => setShowIncompleteTasks(false)}>完了済みタスク</button>
      </div>

      {/* 未完了タスク */}
      {showIncompleteTasks && (
        <div className="main-task-section">
          {taskGroups.map(group => (
            <div key={group.id} className="task-group">
              <input className="group-title-input" value={group.title} onChange={(e) => updateGroupTitle(group.id, e.target.value)} />
              <table className="task-table">
                <thead>
                  <tr>
                    <th></th><th>内容</th><th>期日</th><th>進捗(%)</th><th>備考欄</th><th>重要度</th><th>完了</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tasks.filter(task => !task.check).map(task => (
                    <tr key={task.id} className="task-row">
                      <td><button className="action-button" onClick={() => setSelectedTask({ groupId: group.id, taskId: task.id })}>表示</button></td>
                      <td>{task.内容}</td>
                      <td><input type="date" className="task-input date-input" value={task.期日} onChange={e => updateTask(group.id, task.id, "期日", e.target.value)} /></td>
                      <td>{task.進捗}</td>
                      <td><input className="task-input" value={task.備考} onChange={e => updateTask(group.id, task.id, "備考", e.target.value)} /></td>
                      <td><input type="number" min="1" max="5" className="task-input importance-input" value={task.重要度} onChange={e => updateTask(group.id, task.id, "重要度", Number(e.target.value))} /></td>
                      <td><input type="checkbox" className="task-checkbox" checked={!!task.check} onChange={() => toggleTaskCheck(group.id, task.id)} /></td>
                    </tr>
                  ))}

                  {/* 追加タスク */}
                  <tr className="add-task-row">
                    <td>追加タスク：</td>
                    <td><input className="task-input" value={newTaskInputs[group.id]?.内容 || ""} onChange={e => handleNewTaskInput(group.id, "内容", e.target.value)} /></td>
                    <td><input type="date" className="task-input date-input" value={newTaskInputs[group.id]?.期日 || ""} onChange={e => handleNewTaskInput(group.id, "期日", e.target.value)} /></td>
                    <td>0</td>
                    <td><input className="task-input" value={newTaskInputs[group.id]?.備考 || ""} onChange={e => handleNewTaskInput(group.id, "備考", e.target.value)} /></td>
                    <td><input type="number" min="1" max="5" className="task-input importance-input" value={newTaskInputs[group.id]?.重要度 || 0} onChange={e => handleNewTaskInput(group.id, "重要度", Number(e.target.value))} /></td>
                    <td><button className="add-button" onClick={() => addTaskToGroup(group.id)}>追加</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          <button className="add-group-button" onClick={addGroup}>大タスクを追加</button>
        </div>
      )}

      {/* 完了済みタスク */}
      {!showIncompleteTasks && (
        <div className="completed-task-section">
          <h2>完了済みタスク</h2>
          {taskGroups.map(group => (
            <div key={group.id} className="task-group">
              <h3 className="completed-group-title">{group.title}</h3>
              <table className="task-table completed-table">
                <thead>
                  <tr>
                    <th></th><th>内容</th><th>期日</th><th>進捗(%)</th><th>備考欄</th><th>重要度</th><th>完了</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tasks.filter(task => task.check).map(task => (
                    <tr key={task.id} className="task-row completed-task-row">
                      <td><button className="action-button" onClick={() => setSelectedTask({ groupId: group.id, taskId: task.id })}>表示</button></td>
                      <td>{task.内容}</td>
                      <td>{task.期日}</td>
                      <td>{task.進捗}</td>
                      <td>{task.備考}</td>
                      <td>{task.重要度}</td>
                      <td><input type="checkbox" className="task-checkbox" checked={!!task.check} onChange={() => toggleTaskCheck(group.id, task.id)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* 小タスク詳細 */}
      <div className="subtask-detail-section">
        {selectedTask ? (() => {
          const group = taskGroups.find(g => g.id === selectedTask.groupId);
          if (!group) return <div className="info-message">グループが見つかりません</div>;
          const task = group.tasks.find(t => t.id === selectedTask.taskId);
          if (!task) return <div className="info-message">タスクが見つかりません</div>;

          return (
            <div className="subtask-detail-card">
              <h3 className="subtask-title">{task.内容} の小タスク一覧</h3>
              <table className="subtask-table">
                <thead>
                  <tr><th>内容</th><th>状態</th><th>完了</th></tr>
                </thead>
                <tbody>
                  {task.subtasks.map((subtask, i) => (
                    <tr key={i} className="subtask-row">
                      <td>{subtask.内容}</td>
                      <td>{subtask.進捗 ? "完了" : "未完了"}</td>
                      <td><input type="checkbox" className="subtask-checkbox" checked={!!subtask.進捗} onChange={() => toggleSubtaskStatus(group.id, task.id, i)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="add-subtask-form">
                <input type="text" placeholder="小タスクを入力" className="subtask-input" value={newSubtaskInputs[task.id] || ""} onChange={e => setNewSubtaskInputs(prev => ({ ...prev, [task.id]: e.target.value }))} />
                <button className="add-button" onClick={() => addSubtask(group.id, task.id)}>追加</button>
              </div>
            </div>
          );
        })() : <div className="info-message">小タスクを表示するタスクを選択してください</div>}
      </div>
    </div>
  );
};

export default TaskTable;
