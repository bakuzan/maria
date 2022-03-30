export default function getUrlOrigin(url: string = '') {
  const [protocol, _, host] = url.split('/');
  return `${protocol}//${host}`;
}
