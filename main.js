const endpoints = ['posts', 'comments', 'albums', 'photos', 'todos', 'users'];
const baseUrl = 'https://jsonplaceholder.typicode.com';
const output = document.getElementById('output');
const searchInput = document.getElementById('searchInput');

const allData = []; // Lưu toàn bộ dữ liệu API

// Gọi API từng endpoint
endpoints.forEach(endpoint => {
  fetch(`${baseUrl}/${endpoint}`)
    .then(res => res.json())
    .then(data => {
      allData.push({ endpoint, data });

      // Nếu có từ khoá thì render lại
      if (searchInput.value.trim()) {
        renderSearchResults();
      }
    })
    .catch(err => {
      console.error(` Lỗi gọi API ${endpoint}:`, err);
    });
});

// Hiển thị kết quả tìm kiếm
function renderSearchResults() {
  const keyword = searchInput.value.toLowerCase();
  output.innerHTML = '';

  allData.forEach(({ endpoint, data }) => {
    const filtered = data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(keyword)
    );

    if (filtered.length > 0) {
      const section = document.createElement('section');
      section.innerHTML = `
        <h2>${endpoint.toUpperCase()} (kết quả: ${filtered.length})</h2>
        ${filtered.map(item =>
          `<pre>${JSON.stringify(item, null, 2)}</pre>`
        ).join('')}
      `;
      output.appendChild(section);
    }
  });
}

// Kích hoạt tìm kiếm realtime
searchInput.addEventListener('input', renderSearchResults);


//     CRUD bài viết (posts)


// Thêm bài viết
function createPost() {
  const title = document.getElementById('postTitle').value.trim();
  const body = document.getElementById('postBody').value.trim();
  const userId = parseInt(document.getElementById('userId').value.trim());

  if (!title || !body || isNaN(userId) || userId <= 0) {
    alert('Vui lòng nhập đầy đủ và hợp lệ thông tin');
    return;
  }

  fetch(`${baseUrl}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      body,
      userId
    })
  })
    .then(res => res.json())
    .then(newPost => {
      alert('Đã thêm bài viết!');
      console.log('Phản hồi POST:', newPost);
      const postData = allData.find(d => d.endpoint === 'posts');
      if (postData) {
        postData.data.unshift(newPost); // thêm vào giao diện
      }
      renderSearchResults();
    })
    .catch(err => alert('Lỗi khi thêm bài viết'));
}

function updatePost() {
  const idInput = document.getElementById('postId').value.trim();
  const title = document.getElementById('postTitle').value.trim();
  const body = document.getElementById('postBody').value.trim();
  const userIdInput = document.getElementById('userId').value.trim();

  const postId = parseInt(idInput);
  const userId = parseInt(userIdInput);

  if (!postId || isNaN(postId)) {
    alert('Vui lòng nhập ID bài viết hợp lệ để sửa.');
    return;
  }

  if (!title || !body || isNaN(userId)) {
    alert('Vui lòng điền đầy đủ tiêu đề, nội dung và userId.');
    return;
  }

  fetch(`${baseUrl}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: postId,
      title,
      body,
      userId
    })
  })
    .then(res => res.json())
    .then(updatedPost => {
      alert('Đã cập nhật bài viết!');
      console.log('Phản hồi PUT:', updatedPost);
      const postData = allData.find(d => d.endpoint === 'posts');
      if (postData) {
        const index = postData.data.findIndex(p => p.id === postId);
        if (index !== -1) {
          postData.data[index] = updatedPost;
        }
      }
      renderSearchResults();
    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi cập nhật bài viết');
    });
}

function deletePost() {
  const idInput = document.getElementById('postId').value.trim();
  const postId = parseInt(idInput);

  if (!postId || isNaN(postId)) {
    alert('Vui lòng nhập ID hợp lệ để xoá.');
    return;
  }

  fetch(`${baseUrl}/posts/${postId}`, {
    method: 'DELETE'
  })
    .then(() => {
      alert(`Đã xoá bài viết có ID = ${postId}`);
      const postData = allData.find(d => d.endpoint === 'posts');
      if (postData) {
        postData.data = postData.data.filter(p => p.id !== postId);
      }
      renderSearchResults();
    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi xoá bài viết');
    });
}



// CRUD comments
function addComment() {
  const postId = parseInt(document.getElementById('commentPostId').value.trim());
  const name = document.getElementById('commentName').value.trim();
  const email = document.getElementById('commentEmail').value.trim();
  const body = document.getElementById('commentBody').value.trim();

  if (!postId || !name || !email || !body) {
    alert('Vui lòng nhập đầy đủ thông tin bình luận.');
    return;
  }

  const payload = { postId, name, email, body };

  fetch(`${baseUrl}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(newComment => {
      alert('Đã thêm bình luận!');
      console.log('Phản hồi POST:', newComment);
      const commentData = allData.find(d => d.endpoint === 'comments');
      if (commentData) {
        commentData.data.unshift(newComment);
      }
      renderSearchResults();
    })
    .catch(err => alert('Lỗi khi thêm bình luận'));
}

function updateComment() {
  const commentId = parseInt(document.getElementById('commentId').value.trim());
  const postId = parseInt(document.getElementById('commentPostId').value.trim());
  const name = document.getElementById('commentName').value.trim();
  const email = document.getElementById('commentEmail').value.trim();
  const body = document.getElementById('commentBody').value.trim();

  if (!commentId || !postId || !name || !email || !body) {
    alert('Vui lòng nhập đầy đủ thông tin để cập nhật bình luận.');
    return;
  }

  const payload = { id: commentId, postId, name, email, body };

  fetch(`${baseUrl}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(updatedComment => {
      alert('Đã cập nhật bình luận!');
      console.log('Phản hồi PUT:', updatedComment);
      const commentData = allData.find(d => d.endpoint === 'comments');
      if (commentData) {
        const index = commentData.data.findIndex(c => c.id === commentId);
        if (index !== -1) {
          commentData.data[index] = updatedComment;
        }
      }
      renderSearchResults();
    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi cập nhật bình luận');
    });
}

function deleteComment() {
  const commentId = parseInt(document.getElementById('commentId').value.trim());

  if (!commentId || isNaN(commentId)) {
    alert('Vui lòng nhập ID bình luận hợp lệ để xoá.');
    return;
  }

  fetch(`${baseUrl}/comments/${commentId}`, {
    method: 'DELETE'
  })
    .then(() => {
      alert(`Đã xoá bình luận có ID = ${commentId}`);
      const commentData = allData.find(d => d.endpoint === 'comments');
      if (commentData) {
        commentData.data = commentData.data.filter(c => c.id !== commentId);
      }
      renderSearchResults();
    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi xoá bình luận');
    });
}


// CRUD cho Users
function addUser() {
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const website = document.getElementById('userWebsite').value.trim();

  if (!name || !email || !phone || !website) {
    alert('Vui lòng điền đầy đủ thông tin người dùng.');
    return;
  }

  const payload = { name, email, phone, website };

  fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(newUser => {
      alert('Đã thêm người dùng!');
      console.log('Phản hồi POST:', newUser);
      const userData = allData.find(d => d.endpoint === 'users');
      if (userData) {
        userData.data.unshift(newUser);
      }
      renderSearchResults();
    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi thêm người dùng');
    });
}

function updateUser() {
  const userId = parseInt(document.getElementById('userIdInput').value.trim());
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const website = document.getElementById('userWebsite').value.trim();

  if (!userId || !name || !email || !phone || !website) {
    alert('Vui lòng nhập đầy đủ thông tin để cập nhật người dùng.');
    return;
  }

  const payload = { id: userId, name, email, phone, website };

  fetch(`${baseUrl}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(updatedUser => {
      alert('Đã cập nhật người dùng!');
      console.log('Phản hồi PUT:', updatedUser);
      const userData = allData.find(d => d.endpoint === 'users');
      if (userData) {
        const index = userData.data.findIndex(u => u.id === userId);
        if (index !== -1) {
          userData.data[index] = updatedUser;
        }
      }
      renderSearchResults();
    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi cập nhật người dùng');
    });
}

function deleteUser() {
  const userId = parseInt(document.getElementById('userIdInput').value.trim());

  if (!userId || isNaN(userId)) {
    alert('Vui lòng nhập ID hợp lệ để xoá.');
    return;
  }

  fetch(`${baseUrl}/users/${userId}`, {
    method: 'DELETE'
  })
    .then(() => {
      alert(`Đã xoá người dùng có ID = ${userId}`);
      const userData = allData.find(d => d.endpoint === 'users');
      if (userData) {
        userData.data = userData.data.filter(u => u.id !== userId);
      }
      renderSearchResults();
    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi xoá người dùng');
    });
}