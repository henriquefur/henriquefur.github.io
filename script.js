document.addEventListener('DOMContentLoaded', () => {
  const projects = Array.from(document.querySelectorAll('.project'));

  const suppressHover = () => {
    if (!document.body) return;
    document.body.classList.add('suppress-hover');
    const clear = () => {
      document.body.classList.remove('suppress-hover');
      window.removeEventListener('mousemove', clear, true);
      window.removeEventListener('pointermove', clear, true);
      window.removeEventListener('touchstart', clear, true);
    };
    window.addEventListener('mousemove', clear, true);
    window.addEventListener('pointermove', clear, true);
    window.addEventListener('touchstart', clear, true);
    // Fallback: clear after a short delay just in case
    setTimeout(() => {
      if (document.body.classList.contains('suppress-hover')) {
        clear();
      }
    }, 1200);
  };

  const blurFocusedProject = () => {
    const active = document.activeElement;
    if (!active) return;
    let project = null;
    if (active.classList && active.classList.contains('project')) {
      project = active;
    } else if (typeof active.closest === 'function') {
      project = active.closest('.project');
    }
    if (project && typeof project.blur === 'function') {
      project.blur();
    }
  };

  // In case the page was restored from bfcache or refocused
  window.addEventListener('pageshow', blurFocusedProject);
  window.addEventListener('focus', blurFocusedProject);
  window.addEventListener('pageshow', suppressHover);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') suppressHover();
  });

  projects.forEach((card) => {
    const link = (card.dataset && card.dataset.link) ? card.dataset.link.trim() : '';
    if (!link) return;

    // Enhance accessibility
    card.classList.add('clickable');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');

    const header = card.querySelector('h3');
    if (header && !card.hasAttribute('aria-label')) {
      card.setAttribute('aria-label', header.textContent.trim());
    }

    const go = () => {
      if (link && link !== '#') {
        window.open(link, '_blank', 'noopener');
        // Clear focus highlight when returning to the page
        setTimeout(() => {
          if (typeof card.blur === 'function') card.blur();
        }, 0);
        // Also suppress hover highlight until the user moves the mouse
        suppressHover();
      }
    };

    // Click anywhere on the card except on inner links/buttons
    card.addEventListener('click', (evt) => {
      const clickedLink = evt.target.closest('a, button');
      if (clickedLink) return; // respect inner interactive elements
      go();
    });

    // Keyboard support
    card.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        go();
      }
    });
  });
});
