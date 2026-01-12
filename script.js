// ==========================================
// EDPLIT ESPAÑA - JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // PRODUCT TABS FUNCTIONALITY
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productCategories = document.querySelectorAll('.product-category');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the category to show
            const category = button.getAttribute('data-category');

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Hide all categories
            productCategories.forEach(cat => cat.classList.remove('active'));

            // Show selected category
            const targetCategory = document.querySelector(`.product-category[data-category="${category}"]`);
            if (targetCategory) {
                targetCategory.classList.add('active');
            }
        });
    });

    // ==========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Get navbar height for offset
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;

                // Calculate position
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // FORM SUBMISSION
    // ==========================================
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Log form data (in production, this would send to a server)
            console.log('Form submitted:', data);

            // Show success message
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');

            // Reset form
            contactForm.reset();
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select all elements with the reveal class
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // MOBILE MENU (for future implementation)
    // ==========================================
    // This is a placeholder for mobile menu functionality
    // Initialize carousels
    initCarousels();

    // Initialize Lightbox
    initLightbox();
});

// Carousel Functionality
function initCarousels() {
    const carousels = document.querySelectorAll('.product-carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');

        // Only auto-rotate if there's more than one slide
        if (slides.length > 1) {
            let currentIndex = 0;

            setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel(track, currentIndex);
            }, 3000); // Rotate every 3 seconds
        }
    });
}

function updateCarousel(track, index) {
    track.style.transform = `translateX(-${index * 100}%)`;
}

// Lightbox Functionality
function initLightbox() {
    // Create Lightbox DOM if it doesn't exist
    if (!document.getElementById('lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <button class="close-btn">&times;</button>
            <img src="" alt="Zoomed Image">
        `;
        document.body.appendChild(lightbox);
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-btn');

    // Add click event to all carousel images
    document.querySelectorAll('.product-carousel img').forEach(img => {
        img.addEventListener('click', e => {
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            lightbox.classList.add('active');
        });
    });

    // Close functionality
    const closeLightbox = () => {
        lightbox.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Close on click outside image
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
