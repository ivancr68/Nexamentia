// =====================================================
// NEXAMENTIA - INTERACTIVE JAVASCRIPT
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // 3. Particles Background Implementation
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        particlesContainer.appendChild(particle);
    }

    // 4. Counter Animation for Social Proof
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    };

    // Intersection Observer for Statistics
    const statsSection = document.querySelector('.social-proof');
    const observerOptions = { threshold: 0.5 };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) statsObserver.observe(statsSection);

    // 5. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Service Card Interaction
    const cards = document.querySelectorAll('.service-card-flip');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.querySelector('.service-card-inner').classList.toggle('flipped');
        });
    });
});

// =====================================================
// CONTACT FORM HANDLING
// =====================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value,
            privacyAccepted: document.getElementById('privacy').checked,
            submittedAt: new Date().toISOString(),
            source: 'NexamentIA Landing Page'
        };

        if (!formData.privacyAccepted) {
            alert('Debes aceptar la Política de Privacidad para continuar.');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando... <div class="btn-loader"></div>';

            const response = await fetch('https://n8n.nexamentia.com/webhook/91648174-cfaa-4926-8943-5afb994be45b', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
                contactForm.reset();
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
}

// =====================================================
// PRIVACY POLICY MODAL
// =====================================================
const privacyModal = document.getElementById('privacyModal');
const privacyPolicyLink = document.getElementById('privacyPolicyLink');
const closeModalBtn = document.getElementById('closeModal');
const acceptPrivacyBtn = document.getElementById('acceptPrivacy');

if (privacyModal && privacyPolicyLink) {
    privacyPolicyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
        privacyModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeModalBtn.addEventListener('click', closeModal);
    acceptPrivacyBtn.addEventListener('click', closeModal);
    
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) closeModal();
    });
}
