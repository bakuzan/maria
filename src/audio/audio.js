window.resizeTo(0, 0);
window.onload = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const audio = new Audio(urlParams.get('src'));
  audio.addEventListener('ended', () => window.close());
  audio.play();
};
