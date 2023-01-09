import { ToasterType } from './types/ToasterType';
import { ContentScriptFunction } from './utils/executeContentModule';

interface MariaApi {
  activateErzaSeries(successorScript: ContentScriptFunction): Promise<void>;
  addHoverListeners<T extends Node>(node: T): void;
  addLinks(): Promise<void>;
  removeLinks(): void;
  toaster(type: ToasterType, message: string): void;
}

declare global {
  interface Window {
    __Maria__: MariaApi;
  }
}
