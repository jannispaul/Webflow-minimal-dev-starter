export function getUrlParameter(type) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(type);
}
