export default function toaster(type, message) {
  const toast = document.createElement('div');
  toast.className = `maria maria-toast maria-toast--${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}
