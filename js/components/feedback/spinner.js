/**
 * Zolto — js/components/feedback/spinner.js
 * Loading spinner / indicator using Font Awesome
 * Phase 4.
 */

/**
 * Creates a Font Awesome spinner element
 * @param {Object} options - Spinner options
 * @param {string} [options.size='24px'] - Size of the spinner
 * @param {string} [options.color='var(--primary)'] - Color of the spinner
 * @param {boolean} [options.spin=true] - Whether to animate the spinner
 * @returns {HTMLInputElement} The spinner element
 */
export function createSpinner(options = {}) {
  const { size = '24px', color = 'var(--primary)', spin = true } = options;
  
  const spinner = document.createElement('i');
  spinner.className = 'fa-solid fa-spinner';
  spinner.style.cssText = `font-size: ${size}; color: ${color};`;
  
  if (spin) {
    spinner.style.animation = 'spin 1s linear infinite';
  }
  
  return spinner;
}

/**
 * Shows a loading overlay with spinner
 * @param {string} [message='Loading...'] - Message to display
 */
export function showLoadingOverlay(message = 'Loading...') {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    const spinner = overlay.querySelector('.fa-spinner');
    const msgEl = overlay.querySelector('div:last-child');
    
    if (spinner && msgEl) {
      msgEl.textContent = message;
      overlay.style.display = 'flex';
    }
  }
}

/**
 * Hides the loading overlay
 */
export function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

