export default function getUrlOrigin(url: string = '') {
  const [_protocol, _, host] = url.split('/');
  return `https://${host}`; // We don't want http; it will crash
}
