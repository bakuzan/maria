import { ContentScriptFunction } from '@/utils/executeContentModule';
import addSeries from './shared/addSeries';
import openSeriesInErza from './shared/openSeriesInErza';

export default async function activateErzaSeries(
  successorScript: ContentScriptFunction
) {
  if (successorScript === 'openSeriesInErza') {
    await openSeriesInErza();
    return;
  }

  addSeries(async () => await openSeriesInErza());
}
