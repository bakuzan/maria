import { ContentScriptFunction } from '@/utils/executeContentModule';
import addSeries from './shared/addSeries';
import openSeriesInErza from './shared/openSeriesInErza';

export default async function activateErzaSeries(
  successorScript: ContentScriptFunction
) {
  const scriptName = successorScript.replace(/"/g, ''); // For some reason quotes are being added...
  if (scriptName === 'openSeriesInErza') {
    await openSeriesInErza();
    return;
  }

  addSeries(async () => await openSeriesInErza());
}
