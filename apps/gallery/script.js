/**
 * Gallery App Script
 * Dynamically loads and displays prototype cards
 */

// Load prototypes from JSON
async function loadPrototypes() {
  try {
    const response = await fetch('prototypes.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading prototypes:', error);
    return { prototypes: [], metadata: {} };
  }
}

// Create prototype card HTML
function createPrototypeCard(prototype) {
  const statusClass = prototype.status === 'active' ? 'active' : 'development';
  const statusIcon = prototype.status === 'active' ? '✓' : '🚧';
  
  return `
    <div class="prototype-card" data-id="${prototype.id}">
      <div class="prototype-header">
        <div class="prototype-icon">${prototype.icon}</div>
        <h3 class="prototype-title">${prototype.name}</h3>
      </div>
      
      <div class="prototype-framework">${prototype.framework}</div>
      
      <p class="prototype-description">${prototype.description}</p>
      
      <div class="prototype-meta">
        <div class="status-badge ${statusClass}">
          <span>${statusIcon}</span>
          <span>${prototype.status.charAt(0).toUpperCase() + prototype.status.slice(1)}</span>
        </div>
        <div class="meta-item">
          <span>👤</span>
          <span>${prototype.author}</span>
        </div>
        <div class="meta-item">
          <span>📅</span>
          <span>${formatDate(prototype.lastUpdated)}</span>
        </div>
      </div>
      
      <div class="prototype-actions">
        <a href="${prototype.url}" class="button button-primary" target="_blank" rel="noopener noreferrer">
          🚀 Launch Prototype
        </a>
        <button class="button button-secondary" onclick="showDetails('${prototype.id}')">
          ℹ️ Details
        </button>
      </div>
    </div>
  `;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Show prototype details (placeholder)
function showDetails(prototypeId) {
  alert(`Details for ${prototypeId} coming soon!\n\nYou can enhance this gallery by:\n- Adding detailed views\n- Embedding screenshots\n- Showing component documentation\n- Live component previews`);
}

// Render prototypes
async function renderPrototypes() {
  const container = document.getElementById('prototypes');
  
  // Show loading state
  container.innerHTML = '<div class="loading">Loading prototypes</div>';
  
  // Load data
  const data = await loadPrototypes();
  
  // Check if we have prototypes
  if (data.prototypes.length === 0) {
    container.innerHTML = `
      <div class="card">
        <h2>No prototypes yet</h2>
        <p>Start by adding your first prototype to the gallery!</p>
      </div>
    `;
    return;
  }
  
  // Render prototype cards
  container.innerHTML = data.prototypes
    .map(prototype => createPrototypeCard(prototype))
    .join('');
  
  // Update metadata
  if (data.metadata && data.metadata.lastUpdated) {
    document.getElementById('last-updated').textContent = formatDate(data.metadata.lastUpdated);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderPrototypes();
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any open modals (if implemented)
    }
  });
});

// Make showDetails available globally
window.showDetails = showDetails;

// Auto-refresh every 30 seconds to check for updates
setInterval(renderPrototypes, 30000);
