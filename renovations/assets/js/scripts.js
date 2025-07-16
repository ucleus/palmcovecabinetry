// Main JavaScript for Renovation Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translateY(8px)' : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translateY(-8px)' : 'none';
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // AOS-like Animation on Scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-aos]');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('aos-animate');
            }
        });
    };

    // Initial check and scroll listener
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Testimonials Slider
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Form Handling
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function() {
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    });

    // Form Validation
    const inputs = contactForm.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const parent = field.parentElement;
        
        // Remove previous error messages
        const existingError = parent.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        let isValid = true;
        let errorMessage = '';
        
        if (!value) {
            errorMessage = 'This field is required';
            isValid = false;
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        } else if (field.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }
        
        if (!isValid) {
            field.style.borderColor = 'var(--error)';
            const error = document.createElement('span');
            error.className = 'error-message';
            error.style.cssText = 'color: var(--error); font-size: 0.875rem; margin-top: 0.25rem; display: block;';
            error.textContent = errorMessage;
            parent.appendChild(error);
        } else {
            field.style.borderColor = 'var(--success)';
        }
        
        return isValid;
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
            color: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Counter Animation
    const counters = document.querySelectorAll('.stat h3');
    const speed = 200;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const count = +counter.textContent.replace(/\D/g, '');
                const inc = target / speed;
                
                if (count < target) {
                    const newCount = Math.ceil(count + inc);
                    counter.textContent = counter.textContent.includes('+') ? newCount + '+' : 
                                         counter.textContent.includes('%') ? newCount + '%' : newCount;
                    setTimeout(updateCount, 1);
                } else {
                    counter.textContent = counter.textContent;
                }
            };
            
            // Reset counter
            const originalText = counter.textContent;
            const isPercentage = originalText.includes('%');
            const hasPlus = originalText.includes('+');
            counter.textContent = '0' + (isPercentage ? '%' : '') + (hasPlus ? '+' : '');
            
            // Start animation when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counter.textContent = originalText;
                        updateCount();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    };
    
    animateCounters();

    // Service Card Hover Effects
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            icon.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Process Step Animation
    const processSteps = document.querySelectorAll('.process-step');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-50px)';
        step.style.transition = 'all 0.8s ease';
        stepObserver.observe(step);
    });

    // Parallax Effect for Hero Image
    const heroImage = document.querySelector('.hero-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    // Dynamic Copyright Year
    const copyrightYear = new Date().getFullYear();
    document.querySelectorAll('#currentYear').forEach(element => {
        element.textContent = copyrightYear;
    });

    // Lazy Loading Images
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});