export function renderSearchResults(allData, currentTab) {
  const keyword = searchInput.value.toLowerCase().trim();
  const dataset = allData.find(d => d.endpoint === currentTab);

  if (!dataset) return;

  const filtered = dataset.data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(keyword)
    )
  );

  const contentArea = document.getElementById('contentArea');
  if (filtered.length === 0) {
    contentArea.innerHTML = '<p>Không tìm thấy dữ liệu phù hợp.</p>';
    return;
  }

  const keys = Object.keys(filtered[0] || {}).slice(0, 4);
  let html = '<table><thead><tr>';
  keys.forEach(k => html += `<th>${k}</th>`);
  html += '<th>Hành động</th></tr></thead><tbody>';

  filtered.forEach(item => {
    html += '<tr>';
    keys.forEach(k => html += `<td>${item[k]}</td>`);
    html += `
      <td>
        <button class="editBtn" data-id="${item.id}">✏️</button>
        <button class="deleteBtn" data-id="${item.id}">🗑️</button>
      </td>
    </tr>`;
  });

  html += '</tbody></table>';
  contentArea.innerHTML = html;
}
