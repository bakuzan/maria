import { ToasterType } from '@/types/ToasterType';

export default function toaster(type: ToasterType, message: string) {
  const toast = document.createElement('div');
  toast.className = `maria maria-toast maria-toast--${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}
