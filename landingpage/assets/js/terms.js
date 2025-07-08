// Terms of Service Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set effective date
    const effectiveDate = document.getElementById('effectiveDate');
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    effectiveDate.textContent = currentDate.toLocaleDateString('en-US', options);

    // Set current year in footer
    document.querySelector('.current-year').textContent = new Date().getFullYear();

    // Smooth scrolling for table of contents
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for section animations
    const sections = document.querySelectorAll('.terms-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate list items when section becomes visible
                const listItems = entry.target.querySelectorAll('.animated-list li');
                listItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Active section highlighting in table of contents
    const tocObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocLink = document.querySelector(`.table-of-contents a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                if (tocLink) tocLink.classList.add('active');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => {
        tocObserver.observe(section);
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Warranty cards interaction
    const warrantyCards = document.querySelectorAll('.warranty-card');
    
    warrantyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const message = `Learn more about our ${title} warranty coverage by contacting us.`;
            
            if (confirm(message + '\n\nWould you like to call us now?')) {
                window.location.href = 'tel:+15551234567';
            }
        });
    });

    // Add ripple effect to buttons and links
    const rippleElements = document.querySelectorAll('.nav-cta, .btn-primary');
    
    rippleElements.forEach(elem => {
        elem.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Print functionality
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });

    // Accessibility: Escape key to go back to home
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const confirmLeave = confirm('Do you want to go back to the homepage?');
            if (confirmLeave) {
                window.location.href = '/';
            }
        }
    });

    // Add smooth reveal for contact info
    const contactInfo = document.querySelector('.contact-info');
    
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s ease forwards';
            }
        });
    }, { threshold: 0.5 });
    
    if (contactInfo) {
        contactObserver.observe(contactInfo);
    }

    // Add hover effect to table of contents
    const tocItems = document.querySelectorAll('.table-of-contents li');
    
    tocItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const link = this.querySelector('a');
            if (link && !link.classList.contains('active')) {
                link.style.paddingLeft = '16px';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const link = this.querySelector('a');
            if (link && !link.classList.contains('active')) {
                link.style.paddingLeft = '12px';
            }
        });
    });

    // Animate hero content on load
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add tooltip to warranty cards
    warrantyCards.forEach(card => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Click for more information';
        tooltip.style.cssText = `
            position: absolute;
            background: var(--primary);
            color: var(--white);
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
        `;
        
        card.style.position = 'relative';
        card.appendChild(tooltip);
        
        card.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
});