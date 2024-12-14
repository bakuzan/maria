export default async function checkAndPlayAudio() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const src = urlParams.get('src');

  if (src) {
    const audio = new Audio(src);
    audio.addEventListener('ended', () => {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, document.title, url.toString());
    });
    await audio.play();
  }
}
