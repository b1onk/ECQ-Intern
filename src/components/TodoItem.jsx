import React, { memo, useEffect } from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  useTheme,
  Checkbox,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const TodoItem = ({
  todo,
  onEdit,
  onDelete,
  onChangeEdit,
  onSave,
  onCancel,
  onToggle,
}) => {
  const theme = useTheme();
  const bgColor = theme.palette.mode === "light" ? "#f1f5f9" : "#2a2e3a";

  useEffect(() => {
    if (todo.completed) {
      const timer = setTimeout(() => {
        onDelete(todo.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [todo.completed, onDelete, todo.id]);

  return (
    <ListItem
      sx={{
        mb: 1,
        bgcolor: bgColor,
        borderRadius: 2,
        px: 2,
        py: 1,
        alignItems: "start",
      }}
      secondaryAction={
        todo.isEditing ? (
          <>
            <IconButton onClick={() => onSave(todo.id)} color="success">
              <SaveIcon />
            </IconButton>
            <IconButton onClick={() => onCancel(todo.id)} color="error">
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={() => onEdit(todo.id)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(todo.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </>
        )
      }
    >
      <Box display="flex" alignItems="start" gap={1} width="100%">
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        {todo.isEditing ? (
          <Box sx={{ flex: 1 }}>
            <TextField
              value={todo.editText}
              onChange={(e) => onChangeEdit(todo.id, "text", e.target.value)}
              variant="standard"
              label="Task"
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              select
              label="Priority"
              value={todo.editPriority}
              onChange={(e) =>
                onChangeEdit(todo.id, "editPriority", e.target.value)
              }
              SelectProps={{ native: true }}
              fullWidth
              variant="standard"
              sx={{ mb: 1 }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </TextField>
            <TextField
              label="Deadline"
              type="date"
              value={todo.editDeadline}
              onChange={(e) =>
                onChangeEdit(todo.id, "editDeadline", e.target.value)
              }
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        ) : (
          <ListItemText
            primary={
              <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                {todo.text}
              </span>
            }
            secondary={`Priority: ${todo.priority} | Deadline: ${
              todo.deadline || "None"
            }`}
          />
        )}
      </Box>
    </ListItem>
  );
};

export default memo(TodoItem);
