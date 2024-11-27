export default async function checkAndPlayAudio() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const src = urlParams.get('src');

  if (src) {
    const audio = new Audio(src);
    audio.addEventListener('ended', () => (window.location.search = ''));
    await audio.play();
  }
}
