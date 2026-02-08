/**
 * NEXAMENTIA INTERACTIVE SCRIPTS
 * Version: 2.5
 * Description: Core logic for landing page interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // NAVBAR SCROLL EFFECT
    // =====================================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =====================================================
    // MOBILE MENU TOGGLE
    // =====================================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinksContainer = document.getElementById('navLinks');

    mobileMenuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // =====================================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================================================
    // PARTICLES BACKGROUND SYSTEM
    // =====================================================
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random animation delay
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;

        particlesContainer.appendChild(particle);
    }

    // =====================================================
    // ANIMATED COUNTER FOR STATS
    // =====================================================
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.social-proof');
    let animated = false;

    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = Math.ceil(target / (duration / 16));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + (stat.textContent.includes('%') ? '%' : '+');
                    clearInterval(timer);
                } else {
                    stat.textContent = current;
                }
            }, 16);
        });
    };

    // Trigger stats animation when visible
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateStats();
                animated = true;
            }
        });
    }, observerOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // =====================================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // =====================================================
    const fadeElements = document.querySelectorAll('.service-card-flip, .process-step, .section-header');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // =====================================================
    // MOBILE TOUCH SUPPORT FOR FLIP CARDS
    // =====================================================
    const flipCards = document.querySelectorAll('.service-card-flip');
    flipCards.forEach(card => {
        card.addEventListener('touchstart', function () {
            this.classList.toggle('hover');
        }, { passive: true });
    });

    // =====================================================
    // CONTACT FORM HANDLING
    // =====================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Submit button loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // n8n Webhook Integration
                const response = await fetch('https://n8n.ivancr.com/webhook/nexamentia-lead', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...data,
                        source: 'NexamentIA Landing Page',
                        timestamp: new Date().toISOString()
                    })
                });

                if (response.ok) {
                    showFormFeedback('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Error en el servidor');
                }
            } catch (error) {
                console.error('Submission error:', error);
                showFormFeedback('Hubo un problema al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
            } finally {
                submitBtn.classList.remove('btn-loading');
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `form-feedback ${type}`;
        feedback.textContent = message;

        // Estilos dinámicos para el feedback
        feedback.style.position = 'fixed';
        feedback.style.bottom = '20px';
        feedback.style.right = '20px';
        feedback.style.padding = '16px 24px';
        feedback.style.borderRadius = '12px';
        feedback.style.backgroundColor = type === 'success' ? '#10b981' : '#f43f5e';
        feedback.style.color = 'white';
        feedback.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        feedback.style.zIndex = '100001';
        feedback.style.animation = 'slideIn 0.3s forwards';

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => feedback.remove(), 300);
        }, 5000);
    }

    // =====================================================
    // PRIVACY MODAL LOGIC
    // =====================================================
    const privacyModal = document.getElementById('privacyModal');
    const privacyLink = document.getElementById('privacyPolicyLink');
    const closeModal = document.getElementById('closeModal');
    const acceptPrivacy = document.getElementById('acceptPrivacy');

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeFunc = () => {
            privacyModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        closeModal.addEventListener('click', closeFunc);
        acceptPrivacy.addEventListener('click', closeFunc);

        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeFunc();
        });
    }

    // =====================================================
    // PARALLAX EFFECT HERO (Subtle)
    // =====================================================
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        const heroVisual = document.querySelector('.automation-core-container');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scroll * 0.15}px)`;
        }
    });

    // =====================================================
    // CURSOR GLOW (Desktop)
    // =====================================================
    if (window.innerWidth > 1024) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        // Estilos para el glow del cursor
        glow.style.width = '600px';
        glow.style.height = '600px';
        glow.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)';
        glow.style.borderRadius = '50%';
        glow.style.position = 'fixed';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '0';
        glow.style.transform = 'translate(-50%, -50%)';

        window.addEventListener('mousemove', (e) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });
    }

    // =====================================================
    // UTILITIES
    // =====================================================
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function () {
            let context = this, args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Resize handler to manage card flips on mobile
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth < 768) {
            // Mobile adjustments if needed
        }
    }));

    // Lazy load optimization
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // =====================================================
    // CONSOLE MESSAGE
    // =====================================================
    console.log('%cNexamentIA', 'color: #3B82F6; font-size: 24px; font-weight: bold;');
    console.log('%cTransformando negocios con IA', 'color: #60A5FA; font-size: 14px;');
    console.log('%cDesarrollado con ❤️ por NexamentIA', 'color: #A1A1AA; font-size: 12px;');

    // =====================================================
    // PERFORMANCE MONITORING (Development Only)
    // =====================================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`🚀 Page loaded in ${pageLoadTime}ms`);
            }, 0);
        });
    }
});
