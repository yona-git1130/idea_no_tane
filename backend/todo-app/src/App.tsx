import { useState, useEffect } from "react";//Reactをつかってる！

type Task = { text: string; done: boolean };

function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const STORAGE_KEY = "todo_tasks_v1";

  // load tasks from localStorage on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch (e) {
      // ignore parse errors
      console.warn("Failed to load tasks from localStorage:", e);
    }
  }, []);

  // for undo: store the last deleted task and a timer id
  const [lastDeleted, setLastDeleted] = useState<{ task: Task; index: number } | null>(null);
  const [undoTimerId, setUndoTimerId] = useState<number | null>(null);

  // save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("Failed to save tasks to localStorage:", e);
    }
  }, [tasks]);

  useEffect(() => {
    document.title = `ToDo (${tasks.length}件)`;
  }, [tasks]);

  const addTask = () => {
    if (input === "") return;
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  };

  const deleteTask = (index: number) => {
    // save last deleted for undo
    const taskToDelete = tasks[index];
    setLastDeleted({ task: taskToDelete, index });

    // clear existing timer if any
    if (undoTimerId) {
      clearTimeout(undoTimerId);
      setUndoTimerId(null);
    }

    // remove the task
    setTasks(tasks.filter((_, i) => i !== index));

    // auto-clear undo after 5s
    const id = window.setTimeout(() => setLastDeleted(null), 5000);
    setUndoTimerId(id);
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    setTasks(prev => {
      const copy = [...prev];
      // insert the deleted task back at its original index (clamped)
      const idx = Math.min(Math.max(0, lastDeleted.index), copy.length);
      copy.splice(idx, 0, lastDeleted.task);
      return copy;
    });

    // clear undo state and timer
    if (undoTimerId) {
      clearTimeout(undoTimerId);
      setUndoTimerId(null);
    }
    setLastDeleted(null);
  };

  const toggleTask = (index: number) => {
    setTasks(
      tasks.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
      />
      <button onClick={addTask}>追加</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(index)}
            />
            <span style={{ textDecoration: task.done ? "line-through" : "none", marginLeft: 8 }}>
              {task.text}
            </span>
            <button style={{ marginLeft: 8 }} onClick={() => deleteTask(index)}>
              削除
            </button>
          </li>
        ))}
      </ul>
      {lastDeleted && (
        <div style={{ marginTop: 12 }}>
          タスクを削除しました。
          <button style={{ marginLeft: 8 }} onClick={undoDelete}>元に戻す</button>
        </div>
      )}
    </div>
  );
}

export default App;
