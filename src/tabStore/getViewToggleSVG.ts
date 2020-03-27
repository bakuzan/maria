export default function getViewToggleSVG(isGroupView: boolean) {
  return isGroupView
    ? `<svg 
  viewBox="0 0 24 24" 
  width="24" 
  height="24" 
  stroke="var(--primary-colour)" 
  stroke-width="1.5" 
  fill="none" 
  stroke-linecap="round" 
  stroke-linejoin="round">
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
</svg>`
    : `<svg 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    stroke="var(--primary-colour)" 
    stroke-width="1.5" 
    fill="none" 
    stroke-linecap="round" 
    stroke-linejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>`;
}
