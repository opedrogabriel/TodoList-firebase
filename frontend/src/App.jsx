import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [filtroResponsavel, setFiltroResponsavel] = useState("");

  // Buscar tarefas do backend
  useEffect(() => {
    const fetchTasks = () => {
      if (filtroResponsavel) {
        axios
          .get(`${API_URL}/${filtroResponsavel}`)
          .then((response) => setTasks(response.data))
          .catch((error) => console.error("Erro ao buscar tarefas:", error));
      } else {
        axios
          .get(API_URL)
          .then((response) =>
            setTasks(
              Object.entries(response.data || {}).map(([id, task]) => ({
                id,
                ...task,
              }))
            )
          )
          .catch((error) => console.error("Erro ao buscar tarefas:", error));
      }
    };

    fetchTasks();
  }, [filtroResponsavel]);

  // Adicionar nova tarefa
  const addTask = () => {
    if (!newTask.trim() || !responsavel.trim()) return;

    axios
      .post(API_URL, { text: newTask, description, responsavel })
      .then(() => {
        setNewTask("");
        setDescription("");
        setResponsavel("");
        setFiltroResponsavel(responsavel);
      })
      .catch((error) => console.error("Erro ao adicionar tarefa:", error));
  };

  // Excluir tarefa
  const deleteTask = (taskId) => {
    axios
      .delete(`${API_URL}/${taskId}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error("Erro ao excluir tarefa:", error));
  };

  return (
    <div>
      <h1 className="page-title">Lista de Tarefas com Firebase</h1>

      <div className="app-container">
        <div className="task-input-container">
          <h2>Digite a Tarefa</h2>
          <input
            type="text"
            placeholder="Título da Tarefa..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <textarea
            placeholder="Descrição da Tarefa..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Responsável..."
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
          />
          <button onClick={addTask}>Adicionar</button>
        </div>

        <div className="tasks-container">
          <h2 className="task-list-title">Lista de Tarefas</h2>

          <select
            className="task-filter"
            onChange={(e) => setFiltroResponsavel(e.target.value)}
            value={filtroResponsavel}
          >
            <option value="">Mostrar todas</option>
            {tasks.map((task, index) => (
              <option key={index} value={task.responsavel}>
                {task.responsavel}
              </option>
            ))}
          </select>

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="placeholder-card">
                <h3>Aguardando tarefas...</h3>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${task.completed ? "completed" : ""}`}
                >
                  <div className="task-header">
                    <h3>{task.text}</h3>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Excluir
                    </button>
                  </div>
                  <p>{task.description}</p>
                  <p>
                    <strong>Responsável:</strong> {task.responsavel}
                  </p>
                  <p>
                    <strong>Criado em:</strong>{" "}
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                  {task.completedAt && (
                    <p>
                      <strong>Concluído em:</strong>{" "}
                      {new Date(task.completedAt).toLocaleString()}
                    </p>
                  )}
                  <div className="task-footer">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        axios
                          .put(`${API_URL}/${task.id}`, {
                            completed: !task.completed,
                          })
                          .then(() => setFiltroResponsavel(filtroResponsavel))
                      }
                    />
                    <span>{task.completed ? "Concluída" : "Pendente"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
