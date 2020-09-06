import express from 'express'
import cors from 'cors'
import pool from './db.js'

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log("=========== server start port :: 3000 ===========")
})

app.post('/todos', async(req, res) => {
    // await
    try {
        // console.log(req.body);
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO tb_todo (description) VALUES ($1) RETURNING *", 
             [description]
        );

        res.json(newTodo.rows[0])
    } catch (err) {
        console.log(err.message);
    }
})

app.get('/todos', async(req,res) => {
   try {
       const allTodos = await pool.query("SELECT * FROM tb_todo")
       res.json(allTodos.rows)
   } catch (err) {
       console.log(err.message)
   } 
})


app.get('/todos/:id' , async(req, res)=> {
    try {
        // console.log(req.params) //{ id: '1' }
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM tb_todo WHERE todo_id = $1", [id])

        res.json(todo.rows)

    } catch (err) {
        console.log(err.message)
    }
})

app.put('/todos/:id' , async(req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query(
            "UPDATE tb_todo SET description = $1 WHERE todo_id = $2",
             [description, id]);

             res.json("Todo was updated!")

    } catch (err) {
        console.log(err.message)
    }
})

app.delete("/todos/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM tb_todo WHERE todo_id = $1", [id]);

            res.json("Todo was deleted!")
    } catch (err) {
        console.log(err.message)
    }
})