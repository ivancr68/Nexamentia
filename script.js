// NEXAMENTIA - INTERACTIVE JAVASCRIPT
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Particles, Counters, Observer, Smooth Scroll... Full content reconstructed.
