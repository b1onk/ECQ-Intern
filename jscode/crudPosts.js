import { baseUrl } from './api.js';
import { renderSearchResults } from './search.js';
import { showAlert } from './popup.js';


// Thêm bài viết
export async function createPost(allData, data) {
  
  const { title, body, userId } = data;
  if (!title || !body || isNaN(userId) || userId < 0 || userId > 100 )  {
    showAlert('Vui lòng nhập đầy đủ và hợp lệ thông tin');
    return;
  }

  // fetch(`${baseUrl}/posts`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(newPost => {
  //     const postData = allData.find(d => d.endpoint === 'posts');
  //     if (postData) {
  //       // Gán ID mới thủ công nếu cần
  //       const maxId = Math.max(...postData.data.map(p => p.id));
  //       newPost.id = maxId + 1;
  //       postData.data.unshift(newPost);
  //     }

  //     alert('Đã thêm bài viết!');
  //     renderSearchResults(allData, 'posts');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi thêm bài viết:', err);
  //     alert('Lỗi khi thêm bài viết');
  //   });

  try {
    const res = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const newPost = await res.json();
    const postData = allData.find(d => d.endpoint === 'posts');
    if (postData) {
      const maxId = Math.max(...postData.data.map(p => p.id));
      newPost.id = maxId + 1;
      postData.data.unshift(newPost);
    }

    await showAlert('Đã thêm bài viết!');
    renderSearchResults(allData, 'posts');
  } catch (err) {
    console.error('Lỗi khi thêm bài viết:', err);
    await showAlert('Lỗi khi thêm bài viết');
  }
}

// Cập nhật bài viết
export async function updatePost(allData,id, data) {
  
  const { title, body, userId } = data;
  if (!title || !body || isNaN(userId) || userId < 0 || userId > 100 )  {
    alert('Vui lòng nhập đầy đủ và hợp lệ thông tin');
    return;
  }

  // fetch(`${baseUrl}/posts/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(updatedPost => {
  //     const postData = allData.find(d => d.endpoint === 'posts');
  //     if (postData) {
  //       const index = postData.data.findIndex(p => p.id === id);
  //       if (index !== -1) {
  //         postData.data[index] = updatedPost;
  //       }
  //     }

  //     alert('Đã cập nhật bài viết!');
  //     renderSearchResults(allData, 'posts');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi cập nhật bài viết:', err);
  //     alert('Lỗi khi cập nhật bài viết');
  //   });

  try {
    const res = await fetch(`${baseUrl}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const updatedPost = await res.json();
    const postData = allData.find(d => d.endpoint === 'posts');
    if (postData) {
      const index = postData.data.findIndex(p => p.id === id);
      if (index !== -1) {
        postData.data[index] = updatedPost;
      }
    }

    await showAlert('Đã cập nhật bài viết!');
    renderSearchResults(allData, 'posts');
  } catch (err) {
    console.error('Lỗi khi cập nhật bài viết:', err);
    await showAlert('Lỗi khi cập nhật bài viết');
  }
}

// Xoá bài viết
export async function deletePost(allData, id) {
   const postId = parseInt(id);

  // fetch(`${baseUrl}/posts/${postId}`, {
  //   method: 'DELETE'
  // })
  //   .then(() => {
  //     const postData = allData.find(d => d.endpoint === 'posts');
  //     if (postData) {
  //       postData.data = postData.data.filter(p => p.id !== postId);
  //     }

  //     alert(`Đã xoá bài viết có ID = ${postId}`);
  //     renderSearchResults(allData, 'posts');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi xoá bài viết:', err);
  //     alert('Lỗi khi xoá bài viết');
  //   });

  try {
    await fetch(`${baseUrl}/posts/${postId}`, {
      method: 'DELETE'
    });

    const postData = allData.find(d => d.endpoint === 'posts');
    if (postData) {
      postData.data = postData.data.filter(p => p.id !== postId);
    }

    await showAlert(`Đã xoá bài viết có ID = ${postId}`);
    renderSearchResults(allData, 'posts');
  } catch (err) {
    console.error('Lỗi khi xoá bài viết:', err);
    await showAlert('Lỗi khi xoá bài viết');
  }
}
