import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  List,
//   useTheme,
  Container,
  Stack,
  AppBar,
  Toolbar,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  deleteTodo,
  startEdit,
  cancelEdit,
  changeEdit,
  saveEdit,
  toggleComplete,
} from "../store/TodoSlice";

import ThemeToggle from "../components/ThemeToggle";
import TodoItem from "../components/TodoItem";

const TodoApp = () => {
//   const theme = useTheme();
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleAdd = useCallback(() => {
    if (newTodo.trim()) {
      dispatch(addTodo({ text: newTodo, priority, deadline }));
      setNewTodo("");
      setPriority("Medium");
      setDeadline("");
    }
  }, [newTodo, priority, deadline, dispatch]);

  const handleToggle = useCallback(
    (id) => {
      dispatch(toggleComplete(id));
      setTimeout(() => {
        const todo = todos.find((t) => t.id === id);
        if (todo && todo.completed) {
          dispatch(deleteTodo(id));
        }
      }, 1000);
    },
    [dispatch, todos]
  );

  const handleEdit = useCallback(
    (id) => {
      dispatch(startEdit(id));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id) => {
      dispatch(deleteTodo(id));
    },
    [dispatch]
  );

  const handleChangeEdit = useCallback(
    (id, field, value) => {
      dispatch(changeEdit({ id, field, value }));
    },
    [dispatch]
  );

  const handleSave = useCallback(
    (id) => {
      dispatch(saveEdit({ id }));
    },
    [dispatch]
  );

  const handleCancel = useCallback(
    (id) => {
      dispatch(cancelEdit(id));
    },
    [dispatch]
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Card sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                fullWidth
                variant="outlined"
                label="New Task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <TextField
                select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
              <TextField
                label="Deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button onClick={handleAdd} variant="contained">
                Add
              </Button>
            </Box>

            <List>
              {todos.map((todo) => (
                <Box key={todo.id} display="flex" alignItems="center">
                  <TodoItem
                    todo={todo}
                    onEdit={() => handleEdit(todo.id)}
                    onDelete={() => handleDelete(todo.id)}
                    onChangeEdit={(id, field, value) =>
                      handleChangeEdit(id, field, value)
                    }
                    onSave={() => handleSave(todo.id)}
                    onCancel={() => handleCancel(todo.id)}
                    onToggle={() => handleToggle(todo.id)}
                  />
                </Box>
              ))}
            </List>
          </Stack>
        </Card>
      </Container>
    </>
  );
};

export default TodoApp;
