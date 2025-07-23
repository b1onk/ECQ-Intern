export const baseUrl = 'https://jsonplaceholder.typicode.com';

export const endpoints = ['posts', 'comments', 'albums', 'photos', 'todos', 'users'];

export async function fetchEndpoint(endpoint) {
  const res = await fetch(`${baseUrl}/${endpoint}`);
  if (!res.ok) throw new Error(`Lỗi fetch ${endpoint}`);
  return await res.json();
}

export async function fetchAllEndpoints() {
  const allData = [];
  for (const endpoint of endpoints) {
    try {
      const data = await fetchEndpoint(endpoint);
      allData.push({ endpoint, data });
    } catch (e) {
      console.error(e);
    }
  }
  return allData;
}