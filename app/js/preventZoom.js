// avoid zooming when browsers ignore user-scalable=no meta tag
// special hack to prevent zoom-to-tabs gesture in safari
document.addEventListener('gesturestart', (e) => {
  e.preventDefault();
  document.body.style.zoom = 0.99;
});

document.addEventListener('gesturechange', (e) => {
  e.preventDefault();
  document.body.style.zoom = 0.99;
});

document.addEventListener('gestureend', (e) => {
  e.preventDefault();
  document.body.style.zoom = 0.99;
});
