import { baseUrl } from './api.js';
import { renderSearchResults } from './search.js';
import { showAlert } from './popup.js';

export async function addAlbum(allData, data) {
  // fetch(`${baseUrl}/albums`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(newAlbum => {
  //     alert('Đã thêm album!');
  //     const albumData = allData.find(d => d.endpoint === 'albums');
  //     // Tăng thêm ID 
  //     if (albumData) {
  //       const maxId = Math.max(...albumData.data.map(a => a.id));
  //       newAlbum.id = maxId + 1;
  //       albumData.data.unshift(newAlbum);
  //     }
  //     renderSearchResults(allData, 'albums');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi thêm album:', err);
  //     alert('Lỗi khi thêm album');
  //   });

    const isValidUserId = parseInt(data.userId);
  if (isNaN(isValidUserId) || isValidUserId < 1 || isValidUserId > 10) {
    await showAlert('User ID không hợp lệ (chỉ từ 1 đến 10).');
    return;
  }

  if (!data.title || data.title.trim() === '') {
    await showAlert('Tiêu đề (title) không được để trống.');
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const newAlbum = await res.json();

    const albumData = allData.find(d => d.endpoint === 'albums');
    if (albumData) {
      const maxId = Math.max(...albumData.data.map(a => a.id));
      newAlbum.id = maxId + 1;
      albumData.data.unshift(newAlbum);
    }

    await showAlert('Đã thêm album!');
    renderSearchResults(allData, 'albums');

  } catch (err) {
    console.error('Lỗi khi thêm album:', err);
    await showAlert('Lỗi khi thêm album');
  }
}

// Cập nhật album
export async function updateAlbum(allData, data) {
  // fetch(`${baseUrl}/albums/${data.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(updatedAlbum => {
  //     alert('Đã cập nhật album!');
  //     const albumData = allData.find(d => d.endpoint === 'albums');
  //     if (albumData) {
  //       const index = albumData.data.findIndex(a => a.id == data.id);
  //       if (index !== -1) {
  //         albumData.data[index] = updatedAlbum;
  //       }
  //     }
  //     renderSearchResults(allData, 'albums');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi cập nhật album:', err);
  //     alert('Lỗi khi cập nhật album');
  //   });

  const isValidUserId = parseInt(data.userId);
  if (isNaN(isValidUserId) || isValidUserId < 1 || isValidUserId > 10) {
    await showAlert('User ID không hợp lệ (chỉ từ 1 đến 10).');
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/albums/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const updatedAlbum = await res.json();

    const albumData = allData.find(d => d.endpoint === 'albums');
    if (albumData) {
      const index = albumData.data.findIndex(a => a.id == data.id);
      if (index !== -1) {
        albumData.data[index] = updatedAlbum;
      }
    }

    await showAlert('Đã cập nhật album!');
    renderSearchResults(allData, 'albums');

  } catch (err) {
    console.error('Lỗi khi cập nhật album:', err);
    await showAlert('Lỗi khi cập nhật album');
  }
}

// Xoá album
export async function deleteAlbum(allData, id) {

  // fetch(`${baseUrl}/albums/${albumId}`, {
  //   method: 'DELETE'
  // })
  //   .then(() => {
  //     alert(`Đã xoá album có ID = ${albumId}`);
  //     const albumData = allData.find(d => d.endpoint === 'albums');
  //     if (albumData) {
  //       albumData.data = albumData.data.filter(a => a.id !== albumId);
  //     }
  //     renderSearchResults(allData, 'albums');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi xoá album:', err);
  //     alert('Lỗi khi xoá album');
  //   });

  const albumId = parseInt(id);
  if (!albumId || isNaN(albumId)) {
    await showAlert('ID album không hợp lệ.');
    return;
  }

  try {
    await fetch(`${baseUrl}/albums/${albumId}`, {
      method: 'DELETE'
    });

    const albumData = allData.find(d => d.endpoint === 'albums');
    if (albumData) {
      albumData.data = albumData.data.filter(a => a.id !== albumId);
    }

    await showAlert(`Đã xoá album có ID = ${albumId}`);
    renderSearchResults(allData, 'albums');

  } catch (err) {
    console.error('Lỗi khi xoá album:', err);
    await showAlert('Lỗi khi xoá album');
  }

}
