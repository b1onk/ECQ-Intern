import { createSlice, nanoid } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: ({ text, priority, deadline }) => ({
        payload: {
          id: nanoid(),
          text,
          isEditing: false,
          editText: text,
          priority: priority || "Medium",
          editPriority: priority || "Medium",
          deadline: deadline || "",
          editDeadline: deadline || "",
          completed: false, 
        },
      }),
    },
    deleteTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    startEdit: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.isEditing = true;
        todo.editText = todo.text;
        todo.editPriority = todo.priority;
        todo.editDeadline = todo.deadline;
      }
    },
    cancelEdit: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.isEditing = false;
      }
    },
    changeEdit: (state, action) => {
      const { id, field, value } = action.payload;
      const todo = state.find((todo) => todo.id === id);
      if (todo) {
        todo[field] = value;
      }
    },
    saveEdit: (state, action) => {
      const { id } = action.payload;
      const todo = state.find((todo) => todo.id === id);
      if (todo) {
        todo.text = todo.editText;
        todo.priority = todo.editPriority;
        todo.deadline = todo.editDeadline;
        todo.isEditing = false;
      }
    },
    toggleComplete: (state, action) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});

export const {
  addTodo,
  deleteTodo,
  startEdit,
  cancelEdit,
  changeEdit,
  saveEdit,
  toggleComplete, 
} = todoSlice.actions;

export default todoSlice.reducer;
