// Popup script to trigger regrouping of tabs

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('regroup');
  if (!button) return;

  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'regroup' });
  });
});

