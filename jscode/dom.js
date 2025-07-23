export const output = document.getElementById('output');
export const searchInput = document.getElementById('searchInput');

export function renderSection(title, items) {
  const section = document.createElement('section');
  section.innerHTML = `
    <h2>${title.toUpperCase()} (kết quả: ${items.length})</h2>
    ${items.map(item => `<pre>${JSON.stringify(item, null, 2)}</pre>`).join('')}
  `;
  output.appendChild(section);
}

