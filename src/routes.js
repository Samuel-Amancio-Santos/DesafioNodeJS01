import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const {search} = req.query

      const tasks = database.select('tasks',search ? {
        title: search,
        description: search
      } : null)
      

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID().slice(0, 8),
        title,
        description,
        completed_at: false,
        created_at: new Date().toLocaleString("pt-BR", { 
          day: "2-digit", 
          month: "2-digit", 
          year: "numeric", 
          hour: "2-digit", 
          minute: "2-digit",
          second: "2-digit"
        }),
        updated_at: null,
      };

      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectById('tasks', id)

      if (!task){
        return res.writeHead(404).end();
      }
      
      database.delete("tasks", id);
      return res.writeHead(204).end();
      
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (title && description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title or description are required' })
        )
      }

      const task = database.selectById('tasks', id)

      console.log(task)
       
      if (!task) {
        return res.writeHead(404).end()
      }

      database.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        completed_at: task.completed_at,
        created_at: task.created_at,
        update_at: new Date().toLocaleString("pt-BR", { 
          day: "2-digit", 
          month: "2-digit", 
          year: "numeric", 
          hour: "2-digit", 
          minute: "2-digit",
          second: "2-digit"
        }),
      })

      return res.writeHead(204).end()
      
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.selectById('tasks', id)

      if (!task) {
        return res.writeHead(404).end()
      }

      if (id && task.completed_at === false){

        database.update('tasks', id, {
          title: task.title,
          description: task.description,
          completed_at: true,
          created_at: task.created_at,
          update_at: new Date().toLocaleString("pt-BR", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit",
            second: "2-digit"
          }),
        })

      }else {
        database.update('tasks', id, {
          title: task.title,
          description: task.description,
          completed_at: false,
          created_at: task.created_at,
          update_at: new Date().toLocaleString("pt-BR", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit",
            second: "2-digit"
          }),
        })
      }
      return res.writeHead(204).end()
  },
} 
];
