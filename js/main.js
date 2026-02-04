// ===================================
// Cursor-Following Butterflies
// ===================================
(function () {
    const BUTTERFLY_IMAGES = ['butterfly-pink', 'butterfly-orange'];
    const COUNT = 6;
    const CHASE_OFFSET_RANGE = 100;
    const STACK_SPREAD = 12;
    const CHASE_SMOOTHING = 0.04;
    const STACK_SMOOTHING = 0.10;
    const MOUSE_STILL_MS = 120;
    const SIZE_MIN = 24;
    const SIZE_MAX = 40;

    const flock = document.getElementById('butterfly-flock');
    if (!flock) return;

    let mouseX = 0;
    let mouseY = 0;
    let hasMouse = false;
    let lastMoveTime = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const butterflies = [];

    const IMAGE_SRC = {
        'butterfly-pink': 'images/butterfly-pink.png',
        'butterfly-orange': 'images/butterfly-orange.png'
    };

    function createButterflies() {
        for (let i = 0; i < COUNT; i++) {
            const variant = BUTTERFLY_IMAGES[Math.floor(Math.random() * BUTTERFLY_IMAGES.length)];
            const el = document.createElement('img');
            el.className = 'butterfly';
            el.src = IMAGE_SRC[variant];
            el.alt = '';
            const size = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            flock.appendChild(el);
            butterflies.push({
                el,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: 0,
                vy: 0,
                lastFlip: 1,
                chaseOffsetX: (Math.random() - 0.5) * 2 * CHASE_OFFSET_RANGE,
                chaseOffsetY: (Math.random() - 0.5) * 2 * CHASE_OFFSET_RANGE,
                stackOffsetX: (Math.random() - 0.5) * 2 * STACK_SPREAD,
                stackOffsetY: (Math.random() - 0.5) * 2 * STACK_SPREAD,
                scale: 0.8 + Math.random() * 0.4,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        lastMoveTime = Date.now();
        hasMouse = true;
    });

    window.addEventListener('resize', () => {
        butterflies.forEach((b) => {
            if (!hasMouse) {
                b.x = window.innerWidth / 2 + b.chaseOffsetX;
                b.y = window.innerHeight / 2 + b.chaseOffsetY;
            }
        });
    });

    function isMouseMoving() {
        return Date.now() - lastMoveTime < MOUSE_STILL_MS;
    }

    function animate() {
        const chasing = isMouseMoving();

        butterflies.forEach((b) => {
            let targetX, targetY, smoothing;

            if (chasing) {
                const t = Date.now() / 1000 + b.phase;
                const driftX = Math.sin(t) * 35 + Math.sin(t * 0.6) * 25;
                const driftY = Math.cos(t * 1.2) * 30 + Math.cos(t * 0.8) * 20;
                targetX = mouseX + b.chaseOffsetX + driftX;
                targetY = mouseY + b.chaseOffsetY + driftY;
                smoothing = CHASE_SMOOTHING;
            } else {
                const t = Date.now() / 1000 + b.phase;
                const flutterX = Math.sin(t * 1.2) * 6 + Math.sin(t * 0.5) * 4;
                const flutterY = Math.cos(t * 0.9) * 5 + Math.cos(t * 0.6) * 3;
                targetX = mouseX + b.stackOffsetX + flutterX;
                targetY = mouseY + b.stackOffsetY + flutterY;
                smoothing = STACK_SMOOTHING;
            }

            if (!hasMouse) {
                targetX = window.innerWidth / 2 + b.chaseOffsetX;
                targetY = window.innerHeight / 2 + b.chaseOffsetY;
            }

            b.vx += (targetX - b.x) * smoothing;
            b.vy += (targetY - b.y) * smoothing;
            if (chasing) {
                b.vx *= 0.75;
                b.vy *= 0.75;
            } else {
                b.vx *= 0.70;
                b.vy *= 0.70;
            }
            b.x += b.vx;
            b.y += b.vy;

            b.el.style.left = (b.x - b.el.offsetWidth / 2) + 'px';
            b.el.style.top = (b.y - b.el.offsetHeight / 2) + 'px';
            const FLIP_DEADZONE = 0.1;
            const flip = Math.abs(b.vx) < FLIP_DEADZONE ? b.lastFlip : (b.vx < 0 ? -1 : 1);
            b.lastFlip = flip;
            b.el.style.transform = `scaleX(${flip}) scale(${b.scale})`;
        });
        requestAnimationFrame(animate);
    }

    createButterflies();
    requestAnimationFrame(animate);
})();

// ===================================
// Smooth Scroll Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
});

// ===================================
// Mobile Navigation Toggle
// ===================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// ===================================
// Active Navigation on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 250; // Trigger earlier
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

window.addEventListener('scroll', updateActiveNav);

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================
// Scroll Animation (Fade In on View)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and timeline items
const animatedElements = document.querySelectorAll('.card, .timeline-item, .section-title');
animatedElements.forEach(el => {
    observer.observe(el);
});

// ===================================
// Parallax Effect for Hero Background
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// ===================================
// Dynamic Year in Footer
// ===================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('footer p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Lilly Liu. All rights reserved.`;
}

// ===================================
// Smooth Page Load Animation
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Add Hover Effect to Tech Tags
// ===================================
const techTags = document.querySelectorAll('.tech-tag');
techTags.forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.2s ease';
    });

    tag.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// ===================================
// Console Easter Egg
// ===================================
console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cLooking at the code? I like your style!', 'font-size: 14px; color: #8b5cf6;');
console.log('%cFeel free to reach out if you want to collaborate!', 'font-size: 14px; color: #06b6d4;');
