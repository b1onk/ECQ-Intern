import { baseUrl } from './api.js';
import { renderSearchResults } from './search.js';
import { showAlert } from './popup.js';


// Thêm ảnh mới
export async function addPhoto(allData, data) {

  const albumId = parseInt(data.albumId);
  if (isNaN(albumId) || albumId < 1 || albumId > 100) {
    await showAlert('Album ID không hợp lệ (chỉ từ 1 đến 100).');
    return;
  }

  // fetch(`${baseUrl}/photos`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(newPhoto => {
  //     alert('Đã thêm ảnh!');
  //     const photoData = allData.find(d => d.endpoint === 'photos');
  //     // Tăng thêm ID
  //     if (photoData) {
  //       const maxId = Math.max(...photoData.data.map(p => p.id));
  //       newPhoto.id = maxId + 1;
  //       photoData.data.unshift(newPhoto);
  //     }

  //     renderSearchResults(allData, 'photos');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi thêm ảnh:', err);
  //     alert('Lỗi khi thêm ảnh');
  //   });

  try {
    const res = await fetch(`${baseUrl}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const newPhoto = await res.json();

    const photoData = allData.find(d => d.endpoint === 'photos');
    if (photoData) {
      const maxId = Math.max(...photoData.data.map(p => p.id));
      newPhoto.id = maxId + 1;
      photoData.data.unshift(newPhoto);
    }

    await showAlert('Đã thêm ảnh!');
    renderSearchResults(allData, 'photos');
  } catch (err) {
    console.error('Lỗi khi thêm ảnh:', err);
    await showAlert('Lỗi khi thêm ảnh');
  }
}

// Cập nhật ảnh
export async function updatePhoto(allData, data) {

  const albumId = parseInt(data.albumId);
  if (isNaN(albumId) || albumId < 1 || albumId > 100) {
    await showAlert('Album ID không hợp lệ (chỉ từ 1 đến 100).');
    return;
  }

  // fetch(`${baseUrl}/photos/${data.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(updatedPhoto => {
  //     alert('Đã cập nhật ảnh!');
  //     const photoData = allData.find(d => d.endpoint === 'photos');
  //     if (photoData) {
  //       const index = photoData.data.findIndex(p => p.id === data.id);
  //       if (index !== -1) {
  //         photoData.data[index] = updatedPhoto;
  //       }
  //     }
  //     renderSearchResults(allData, 'photos');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi cập nhật ảnh:', err);
  //     alert('Lỗi khi cập nhật ảnh');
  //   });

  try {
    const res = await fetch(`${baseUrl}/photos/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const updatedPhoto = await res.json();

    const photoData = allData.find(d => d.endpoint === 'photos');
    if (photoData) {
      const index = photoData.data.findIndex(p => p.id === data.id);
      if (index !== -1) {
        photoData.data[index] = updatedPhoto;
      }
    }

    await showAlert('Đã cập nhật ảnh!');
    renderSearchResults(allData, 'photos');
  } catch (err) {
    console.error('Lỗi khi cập nhật ảnh:', err);
    await showAlert('Lỗi khi cập nhật ảnh');
  }
}

// Xoá ảnh
export async function deletePhoto(allData, id) {
 const photoId = parseInt(id);
  // fetch(`${baseUrl}/photos/${photoId}`, {
  //   method: 'DELETE'
  // })
  //   .then(() => {
  //     alert(`Đã xoá ảnh có ID = ${photoId}`);

  //     const photoData = allData.find(d => d.endpoint === 'photos');
  //     if (photoData) {
  //       photoData.data = photoData.data.filter(p => p.id !== photoId);
  //     }
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     alert('Lỗi khi xoá ảnh');
  //   });

  try {
    await fetch(`${baseUrl}/photos/${photoId}`, {
      method: 'DELETE'
    });

    const photoData = allData.find(d => d.endpoint === 'photos');
    if (photoData) {
      photoData.data = photoData.data.filter(p => p.id !== photoId);
    }

    await showAlert(`Đã xoá ảnh có ID = ${photoId}`);
    renderSearchResults(allData, 'photos');
  } catch (err) {
    console.error('Lỗi khi xoá ảnh:', err);
    await showAlert('Lỗi khi xoá ảnh');
  }
}


