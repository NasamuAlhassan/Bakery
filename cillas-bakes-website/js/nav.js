/* js/nav.js
   Small accessible toggler for the Liquid-Glass nav.
   - Toggles .open on header
   - Updates aria-expanded
   - Closes on outside click, Escape key, and on resize >= 768px
*/

(function(){
  // Find the header container
  const header = document.querySelector('.nav-acrylic');
  if(!header) return; // nothing to do if nav isn't present

  const toggle = header.querySelector('.nav-toggle');
  const menu = header.querySelector('#primaryNav');

  // Set open/closed state
  function setOpen(open){
    if(open){
      header.classList.add('open');
      if(toggle) toggle.setAttribute('aria-expanded','true');
      // move focus into panel for keyboard users
      const first = menu && menu.querySelector('.nav-item');
      if(first) first.focus();
    } else {
      header.classList.remove('open');
      if(toggle) toggle.setAttribute('aria-expanded','false');
      if(toggle) toggle.focus();
    }
  }

  if(!toggle) return;

  // Toggle handler
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = header.classList.contains('open');
    setOpen(!isOpen);
  });

  // Close when clicking outside the header/panel
  document.addEventListener('click', (e) => {
    if(!header.classList.contains('open')) return;
    if(header.contains(e.target)) return; // inside header => ignore
    setOpen(false);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') setOpen(false);
  });

  // Reset on resize to desktop
  window.addEventListener('resize', () => {
    if(window.innerWidth >= 768) setOpen(false);
  });

  // Keyboard toggle (Enter / Space) for accessibility
  toggle.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      setOpen(!header.classList.contains('open'));
    }
  });
})();
