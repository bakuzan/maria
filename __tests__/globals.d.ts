/// <reference types="jest" />
import type { MockzillaDeep } from 'mockzilla';
import type { Browser } from 'webextension-polyfill';

declare global {
  const mockBrowser: MockzillaDeep<Browser>;
}

export {};
