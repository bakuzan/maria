import { WebRequest } from 'webextension-polyfill';

export interface Redirect {
  id: string;
  fromPattern: string;
  toPattern: string;
}

export interface RedirectResult extends Redirect {
  redirectUrl: string;
}

export interface RedirectDetails
  extends Pick<WebRequest.OnBeforeRequestDetailsType, 'method' | 'url'> {
  type: string;
}
