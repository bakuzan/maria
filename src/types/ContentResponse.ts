import { BackgroundAction } from './BackgroundAction';

export interface ContentResponse extends BackgroundAction {
  success: boolean;
  data?: any;
}
