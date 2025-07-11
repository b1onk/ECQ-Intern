import React, { useState, useEffect } from 'react';
import './App.css';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const STORAGE_KEY = "todo_tasks";

  // Lấy dữ liệu từ localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        setTasks(parsed);
      }
    } catch (err) {
      console.error("Lỗi khi load localStorage:", err);
    }
  }, []);

  // Cập nhật localStorage khi tasks thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(e) {
    setNewTask(e.target.value);
  }

  function addTask() {
    const trimmed = newTask.trim();
    if (!trimmed) return;

    const exists = tasks.find(task => task.text.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("Task đã tồn tại!");
      return;
    }

    setTasks([...tasks, { text: trimmed, completed: false }]);
    setNewTask("");
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  }

  function editTask(index, updatedText) {
    const updated = [...tasks];
    updated[index].text = updatedText;
    setTasks(updated);
  }

  function toggleCompleted(index) {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updated = [...tasks];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      setTasks(updated);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updated = [...tasks];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setTasks(updated);
    }
  }

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <div className="button-group">
                  <button onClick={() => {
                    if (editedTask.trim() !== "") {
                      editTask(index, editedTask);
                      setEditIndex(null);
                    }
                  }}>Save</button>
                  <button onClick={() => setEditIndex(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="content-row">
                <label className="checkbox-text">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(index)}
                  />
                  <span className={`text ${task.completed ? "completed" : ""}`}>{task.text}</span>
                </label>
                <div className="button-group">
                  <button className="delete-button" onClick={() => deleteTask(index)}>🗑</button>
                  <button className="move-button" onClick={() => moveTaskUp(index)}>☝</button>
                  <button className="move-button" onClick={() => moveTaskDown(index)}>👇</button>
                  <button className="edit-button" onClick={() => {
                    setEditIndex(index);
                    setEditedTask(task.text);
                  }}>✎</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;
