document.addEventListener('DOMContentLoaded', () => {
  // Navbar burger toggle
  const burger = document.querySelector('.navbar-burger');
  const target = document.getElementById(burger.dataset.target);

  burger.addEventListener('click', () => {
    // Toggle the "is-active" class on both the burger and the menu
    burger.classList.toggle('is-active');
    target.classList.toggle('is-active');
  });

  // Day/Night mode toggle with smooth transition
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const current = localStorage.getItem('theme') || 'dark';

  // Initialize theme
  root.dataset.theme = current;
  updateIcon(current);

  themeToggle.addEventListener('click', () => {
    const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';

    // Apply smooth transition
    root.classList.add('theme-transition');

    // Update theme
    root.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);

    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  });

  function updateIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'bi bi-moon-fill';
    } else {
      icon.className = 'bi bi-sun-fill';
    }
  }

  // Love buttons functionality
  const loveButtons = document.querySelectorAll('.love-button');
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

  loveButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const postId = btn.id.split('-')[2];

      try {
        const response = await fetch(`/post/${postId}/love/`, {
          method: 'POST',
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ post_id: postId })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
          // Update button display and counter
          btn.textContent = data.loved ? '❤️' : '🤍';

          const countElement = document.getElementById(`love-count-${postId}`);
          if (countElement) {
            countElement.textContent = data.new_love_count;

            // Add animation effect to the counter
            countElement.classList.add('love-count-updated');
            setTimeout(() => {
              countElement.classList.remove('love-count-updated');
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error updating love status:', error);
      }
    });
  });

  // Notification dismissal
  const deleteButtons = document.querySelectorAll('.notification .delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const notification = button.parentNode;
      notification.parentNode.removeChild(notification);
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add animation to cards on page load
  const cards = document.querySelectorAll('.blur-white');
  if (cards.length > 0) {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in-up');
      }, index * 100); // Stagger the animations
    });
  }
});