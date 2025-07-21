import { baseUrl } from './api.js';
import { renderSearchResults } from './search.js';
import { showAlert } from './popup.js';


export async function addTodo(allData, data) {

  const { title, userId, completed } = data;

  if (!title || isNaN(userId) || userId < 1 || userId > 10) {
    await showAlert('Vui lòng nhập tiêu đề và User ID hợp lệ từ 1 đến 10.');
    return;
  }
  // fetch(`${baseUrl}/todos`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(newTodo => {
  //     alert('Đã thêm todo!');
  //     const todoData = allData.find(d => d.endpoint === 'todos');
      
  //     // Tăng thêm ID
  //     if (todoData) {
  //       const maxId = Math.max(...todoData.data.map(t => t.id));
  //       newTodo.id = maxId + 1;
  //       todoData.data.unshift(newTodo);
  //     }
  //     renderSearchResults(allData, 'todos');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi thêm todo:', err);
  //     alert('Lỗi khi thêm todo');
  //   });

   try {
    const res = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const newTodo = await res.json();
    const todoData = allData.find(d => d.endpoint === 'todos');
    if (todoData) {
      const maxId = Math.max(...todoData.data.map(t => t.id));
      newTodo.id = maxId + 1;
      todoData.data.unshift(newTodo);
    }

    await showAlert('Đã thêm todo!');
    renderSearchResults(allData, 'todos');
  } catch (err) {
    console.error('Lỗi khi thêm todo:', err);
    await showAlert('Lỗi khi thêm todo');
  }
}


// Cap nhat Todo
export async function updateTodo(allData, data) {
  const payload = {
    id: data.id,
    title: data.title,
    userId: data.userId,
    completed: data.completed === true || data.completed === 'true'
  };

  if (!payload.title || isNaN(payload.userId) || payload.userId < 1 || payload.userId > 10) {
    await showAlert('Vui lòng điền đầy đủ tiêu đề và userId từ 1 đến 10.');
    return;
  }

  // fetch(`${baseUrl}/todos/${data.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
  //   .then(res => res.json())
  //   .then(updatedTodo => {
  //     alert('Đã cập nhật todo!');
  //     const todoData = allData.find(d => d.endpoint === 'todos');
  //     if (todoData) {
  //       const index = todoData.data.findIndex(t => t.id === data.id);
  //       if (index !== -1) {
  //         todoData.data[index] = updatedTodo;
  //       }
  //     }
  //     renderSearchResults(allData, 'todos');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi cập nhật todo:', err);
  //     alert('Lỗi khi cập nhật todo');
  //   });

    try {
    const res = await fetch(`${baseUrl}/todos/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const updatedTodo = await res.json();
    const todoData = allData.find(d => d.endpoint === 'todos');
    if (todoData) {
      const index = todoData.data.findIndex(t => t.id === data.id);
      if (index !== -1) {
        todoData.data[index] = updatedTodo;
      }
    }

    await showAlert('Đã cập nhật todo!');
    renderSearchResults(allData, 'todos');
  } catch (err) {
    console.error('Lỗi khi cập nhật todo:', err);
    await showAlert('Lỗi khi cập nhật todo');
  }
}

// Xoa Todo 
export async function deleteTodo(allData, id) {
    const todoId = parseInt(id);

  // fetch(`${baseUrl}/todos/${todoId}`, {
  //   method: 'DELETE'
  // })
  //   .then(() => {
  //     alert(`Đã xoá todo có ID = ${todoId}`);
  //     const todoData = allData.find(d => d.endpoint === 'todos');
  //     if (todoData) {
  //       todoData.data = todoData.data.filter(t => t.id !== todoId);
  //     }
  //     renderSearchResults(allData, 'todos');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi xoá todo:', err);
  //     alert('Lỗi khi xoá todo');
  //   });

    try {
    await fetch(`${baseUrl}/todos/${todoId}`, {
      method: 'DELETE'
    });

    const todoData = allData.find(d => d.endpoint === 'todos');
    if (todoData) {
      todoData.data = todoData.data.filter(t => t.id !== todoId);
    }

    await showAlert(`Đã xoá todo có ID = ${todoId}`);
    renderSearchResults(allData, 'todos');
  } catch (err) {
    console.error('Lỗi khi xoá todo:', err);
    await showAlert('Lỗi khi xoá todo');
  }
}
