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
  const command = `./start-prototype.sh ${prototype.id}`;
  return `
    <div class="prototype-card" data-id="${prototype.id}" onclick="window.open('${prototype.url}', '_blank')">
      <div class="card-header">
        <h3 class="card-title">${prototype.name}</h3>
        <p class="card-port">Port: ${prototype.port}</p>
      </div>
      <p class="card-description">${prototype.description}</p>
      <p class="card-author">By ${prototype.author}</p>
      <div class="card-command" onclick="event.stopPropagation(); copyToClipboard('${command}', event)">
        <span class="command-text">${command}</span>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M5.33333 5.33333V3.33333C5.33333 2.59695 5.93029 2 6.66667 2H12.6667C13.403 2 14 2.59695 14 3.33333V9.33333C14 10.0697 13.403 10.6667 12.6667 10.6667H10.6667M3.33333 5.33333H9.33333C10.0697 5.33333 10.6667 5.93029 10.6667 6.66667V12.6667C10.6667 13.403 10.0697 14 9.33333 14H3.33333C2.59695 14 2 13.403 2 12.6667V6.66667C2 5.93029 2.59695 5.33333 3.33333 5.33333Z" stroke="#646464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="copy-tooltip">Copied!</span>
      </div>
    </div>
  `;
}

// Render prototypes
async function renderPrototypes() {
  const container = document.getElementById('prototypes');
  
  // Show loading state
  container.innerHTML = '<div class="loading">Loading prototypes...</div>';
  
  // Load data
  const data = await loadPrototypes();
  
  // Update the cd command with dynamic path
  updateCdCommand(data.metadata?.projectPath);
  
  // Check if we have prototypes
  if (data.prototypes.length === 0) {
    container.innerHTML = '<div class="loading">No prototypes yet. Create one with ./create-prototype.sh</div>';
    return;
  }
  
  // Render prototype cards
  container.innerHTML = data.prototypes
    .map(prototype => createPrototypeCard(prototype))
    .join('');
}

// Update the cd command with dynamic project path
function updateCdCommand(projectPath) {
  const cdCommandBox = document.getElementById('cdCommand');
  const cdCommandText = document.getElementById('cdCommandText');
  
  if (cdCommandBox && cdCommandText && projectPath) {
    const command = `cd ${projectPath}`;
    cdCommandBox.dataset.command = command;
    cdCommandText.textContent = command;
  }
}

// Copy to clipboard function with tooltip
function copyToClipboard(text, event) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard:', text);
    
    // Show tooltip
    const tooltip = event.currentTarget.querySelector('.copy-tooltip');
    if (tooltip) {
      tooltip.classList.add('show');
      setTimeout(() => {
        tooltip.classList.remove('show');
      }, 1500);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Accordion toggle function
function toggleAccordion() {
  const accordion = document.querySelector('.instructions-accordion');
  const content = document.getElementById('accordionContent');
  const icon = document.querySelector('.accordion-icon');
  
  accordion.classList.toggle('open');
}

// Make functions available globally
window.copyToClipboard = copyToClipboard;
window.toggleAccordion = toggleAccordion;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderPrototypes();
});
