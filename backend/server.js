const express = require("express"); 
const cors = require("cors"); 
const db = require("./firebase"); 
 
const app = express(); 
app.use(cors()); 
app.use(express.json()); 
 
// Rota para listar todas as tarefas 
app.get("/tasks", async (req, res) => { 
    db.ref("tasks").once("value", snapshot => { 
        res.json(snapshot.val() || {}); 
    }); 
}); 
 
// Rota para adicionar uma tarefa 
app.post("/tasks", async (req, res) => { 
    const { text, description, responsavel } = req.body; 
    if (!text || !responsavel) return res.status(400).json({ error: "Tarefa e responsável são obrigatórios" }); 
 
    const newTaskRef = db.ref("tasks").push(); 
     
    const newTask = { 
        text, 
        description, 
        responsavel, 
        completed: false, 
        createdAt: new Date().toISOString(), 
        completedAt: null 
    }; 
 
    await newTaskRef.set(newTask); 
    res.json({ id: newTaskRef.key, ...newTask }); 
}); 
 
// Rota para buscar tarefas por responsável 
app.get("/tasks/:responsavel", async (req, res) => { 
    const { responsavel } = req.params; 
    db.ref("tasks").once("value", snapshot => { 
        const data = snapshot.val(); 
        if (data) { 
            const filteredTasks = Object.entries(data) 
                .filter(([id, task]) => task.responsavel === responsavel) 
                .map(([id, task]) => ({ id, ...task })); 
            res.json(filteredTasks); 
        } else { 
            res.json([]); 
        } 
    }); 
}); 
 
// Rota para marcar uma tarefa como concluída 
app.put("/tasks/:id", async (req, res) => { 
    const { completed } = req.body; 
    const taskRef = db.ref(`tasks/${req.params.id}`); 
 
    const updateData = { completed }; 
    if (completed) { 
        updateData.completedAt = new Date().toISOString(); 
    } else { 
        updateData.completedAt = null; 
    } 
 
    await taskRef.update(updateData); 
    res.json({ success: true }); 
}); 
 
// Rota para excluir uma tarefa 
app.delete("/tasks/:id", async (req, res) => { 
    const taskId = req.params.id; 
    if (!taskId) return res.status(400).json({ error: "ID da tarefa não fornecido." }); 
 
    try { 
        await db.ref(`tasks/${taskId}`).remove(); 
        res.json({ success: true }); 
    } catch (error) { 
        res.status(500).json({ error: "Erro ao excluir a tarefa." }); 
    } 
}); 
 
app.listen(5000, () => console.log("Servidor rodando na porta 5000")); 