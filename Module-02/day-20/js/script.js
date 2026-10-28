const listElement = document.getElementById('list');
const statusElement = document.getElementById('status');
const refreshBtn = document.getElementById('refresh-btn');

const API_URL = 'https://dummyjson.com/recipes';

async function load() {
  statusElement.textContent = 'Loading dishes...';
  statusElement.className = 'status loading';
  listElement.innerHTML = '';
  refreshBtn.disabled = true;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch dishes (HTTP ${res.status})`);
    }

    const data = await res.json();
    
   
    const dishes = data.recipes;

    if (!dishes || dishes.length === 0) {
      throw new Error('No dishes found.');
    }

    renderList(dishes);

  } catch (error) {
    console.error('Fetch error:', error);
    statusElement.textContent = `Oops! Unable to load dishes. (${error.message})`;
    statusElement.className = 'status error';
  } finally {
    if (statusElement.classList.contains('loading')) {
      statusElement.textContent = '';
      statusElement.className = 'status';
    }
    refreshBtn.disabled = false;
  }
}

function renderList(items) {
  listElement.innerHTML = items
    .slice(0, 10)
    .map(
      (dish) => `
      <li class="dish-item">
        <img src="${dish.image}" alt="${dish.name}" />
        <span>${dish.name}</span>
      </li>
    `
    )
    .join('');
}

refreshBtn.addEventListener('click', load);
window.addEventListener('DOMContentLoaded', load);