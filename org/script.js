// Language Toggle Functionality
let currentLang = 'en';

const langToggle = document.getElementById('langToggle');
const translatableElements = document.querySelectorAll('[data-en][data-zh]');

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';

    // Update button text
    langToggle.textContent = currentLang === 'en' ? '中文' : 'English';

    // Update all translatable elements
    translatableElements.forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', currentLang);
}

langToggle.addEventListener('click', toggleLanguage);

// Load saved language preference
const savedLang = localStorage.getItem('preferredLanguage');
if (savedLang && savedLang !== currentLang) {
    toggleLanguage();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Animate tech bars
            if (entry.target.classList.contains('tech-item')) {
                const bar = entry.target.querySelector('.tech-bar-fill');
                if (bar) {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateOnScroll = document.querySelectorAll('.stat-card, .timeline-item, .tech-item, .tech-category');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Code typing animation
const codeElement = document.querySelector('.code-content code');
if (codeElement) {
    const codeText = codeElement.textContent;
    codeElement.textContent = '';
    let i = 0;

    function typeCode() {
        if (i < codeText.length) {
            codeElement.textContent += codeText.charAt(i);
            i++;
            setTimeout(typeCode, 30);
        }
    }

    // Start typing animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeCode, 500);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const hero = document.querySelector('.hero');
    if (hero) {
        heroObserver.observe(hero);
    }
}

// Cursor effect on hero section
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = hero;

        const xPos = (clientX / offsetWidth - 0.5) * 20;
        const yPos = (clientY / offsetHeight - 0.5) * 20;

        const codeWindow = document.querySelector('.code-window');
        if (codeWindow) {
            codeWindow.style.transform = `perspective(1000px) rotateY(${xPos}deg) rotateX(${-yPos}deg)`;
        }
    });

    hero.addEventListener('mouseleave', () => {
        const codeWindow = document.querySelector('.code-window');
        if (codeWindow) {
            codeWindow.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        }
    });
}

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Particle background effect (optional, lightweight)
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: rgba(59, 130, 246, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
    `;
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 15000);
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.5;
        }
        90% {
            opacity: 0.5;
        }
        50% {
            transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
            opacity: 1;
        }
    }

    .nav-link.active {
        color: var(--primary);
    }
`;
document.head.appendChild(style);

// Create particles periodically (reduced frequency for performance)
setInterval(createParticle, 3000);

// Add hover effect to stat cards
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.05)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add hover effect to timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const marker = this.querySelector('.timeline-marker');
        if (marker) {
            marker.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        }
    });

    item.addEventListener('mouseleave', function() {
        const marker = this.querySelector('.timeline-marker');
        if (marker) {
            marker.style.background = 'var(--primary)';
        }
    });
});

// Log page load
console.log('%c👋 Welcome to Ben\'s Portfolio', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cBuilt with passion for clean code', 'font-size: 14px; color: #94a3b8;');
console.log('%cGitHub: https://github.com/yhattm', 'font-size: 12px; color: #8b5cf6;');
