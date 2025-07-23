import { baseUrl } from './api.js';
import { renderSearchResults } from './search.js';
import { showAlert } from './popup.js';


// Thêm bình luận
export async function addComment(allData, data) {
  // Giới hạn PostID
  const isValidPostId = parseInt(data.postId);
  if (isNaN(isValidPostId) || isValidPostId < 1 || isValidPostId > 100) {
  await showAlert('Post ID không hợp lệ (chỉ từ 1 đến 100).');
  return;
}
//   fetch(`${baseUrl}/comments`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   })
//     .then(res => res.json())
//     .then(newComment => {
//       const commentData = allData.find(d => d.endpoint === 'comments');
//       if (commentData) {
//         const maxId = Math.max(...commentData.data.map(c => c.id));
//         newComment.id = maxId + 1;
//         commentData.data.unshift(newComment);
//       }

//       showAlert('Đã thêm bình luận!');
//       renderSearchResults(allData, 'comments');
//     })
//     .catch(err => {
//       console.error('Lỗi khi thêm bình luận:', err);
//       showAlert('Lỗi khi thêm bình luận');
//     });
// }
  try {
    const res = await fetch(`${baseUrl}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const newComment = await res.json();

    const commentData = allData.find(d => d.endpoint === 'comments');
    if (commentData) {
      const maxId = Math.max(...commentData.data.map(c => c.id));
      newComment.id = maxId + 1;
      commentData.data.unshift(newComment);
    }

    await showAlert('Đã thêm bình luận!');
    renderSearchResults(allData, 'comments');
  } catch (err) {
    console.error('Lỗi khi thêm bình luận:', err);
    await showAlert('Lỗi khi thêm bình luận');
  }
}

// Cập nhật bình luận
export async function updateComment(allData, data) {
  // Giới hạn PostID
  const isValidPostId = parseInt(data.postId);
 if (isNaN(isValidPostId) || isValidPostId < 1 || isValidPostId > 100) {
  await showAlert('Post ID không hợp lệ (chỉ từ 1 đến 100).');
  return;
}
  // fetch(`${baseUrl}/comments/${data.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(updatedComment => {
  //     const commentData = allData.find(d => d.endpoint === 'comments');
  //     if (commentData) {
  //       const index = commentData.data.findIndex(c => c.id === data.id);
  //       if (index !== -1) {
  //         commentData.data[index] = updatedComment;
  //       }
  //     }

  //     await showAlert('Đã cập nhật bình luận!');
  //     renderSearchResults(allData, 'comments');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi cập nhật bình luận:', err);
  //     await showAlert('Lỗi khi cập nhật bình luận');
  //   });

  try {
    const res = await fetch(`${baseUrl}/comments/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const updatedComment = await res.json();

    const commentData = allData.find(d => d.endpoint === 'comments');
    if (commentData) {
      const index = commentData.data.findIndex(c => c.id === data.id);
      if (index !== -1) {
        commentData.data[index] = updatedComment;
      }
    }

    await showAlert('Đã cập nhật bình luận!');
    renderSearchResults(allData, 'comments');
  } catch (err) {
    console.error('Lỗi khi cập nhật bình luận:', err);
    await showAlert('Lỗi khi cập nhật bình luận');
  }
}

// Xoá bình luận
export async function deleteComment(allData, id) {
  const commentId = parseInt(id);
  // fetch(`${baseUrl}/comments/${commentId}`, {
  //   method: 'DELETE'
  // })
  //   .then(() => {
  //     const commentData = allData.find(d => d.endpoint === 'comments');
  //     if (commentData) {
  //       commentData.data = commentData.data.filter(c => c.id !== commentId);
  //     }

  //     await showAlert(`Đã xoá bình luận có ID = ${commentId}`);
  //     renderSearchResults(allData, 'comments');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi xoá bình luận:', err);
  //     await showAlert('Lỗi khi xoá bình luận');
  //   });

  try {
    await fetch(`${baseUrl}/comments/${commentId}`, {
      method: 'DELETE'
    });

    const commentData = allData.find(d => d.endpoint === 'comments');
    if (commentData) {
      commentData.data = commentData.data.filter(c => c.id !== commentId);
    }

    await showAlert(`Đã xoá bình luận có ID = ${commentId}`);
    renderSearchResults(allData, 'comments');
  } catch (err) {
    console.error('Lỗi khi xoá bình luận:', err);
    await showAlert('Lỗi khi xoá bình luận');
  }
}
