import { ToasterType } from '@/types/ToasterType';
import { log } from '@/log';

export default function toaster(type: ToasterType, message: string) {
  const toast = document.createElement('div');
  toast.className = `maria maria-toast maria-toast--${type}`;
  toast.textContent = message;

  log(`Toast(Type: ${type}) => ${message}`);

  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 5000);
}
