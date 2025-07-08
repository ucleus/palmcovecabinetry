// JavaScript for Legal Pages (Privacy Policy & Terms)

document.addEventListener('DOMContentLoaded', function() {
    // Set dates
    const currentDate = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
    // Update date elements
    const updateDate = document.getElementById('updateDate');
    const effectiveDate = document.getElementById('effectiveDate');
    
    if (updateDate) {
        updateDate.textContent = currentDate.toLocaleDateString('en-US', dateOptions);
    }
    
    if (effectiveDate) {
        effectiveDate.textContent = currentDate.toLocaleDateString('en-US', dateOptions);
    }
    
    // Set current year
    document.getElementById('currentYear').textContent = currentDate.getFullYear();
    
    // Mobile Navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translateY(8px)' : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translateY(-8px)' : 'none';
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state in navigation
                document.querySelectorAll('.legal-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Active section highlighting
    const sections = document.querySelectorAll('.legal-sections section');
    const navLinks = document.querySelectorAll('.legal-nav a');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-20% 0px -70% 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Animate sections on scroll
    const animateSections = () => {
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !section.classList.contains('animated')) {
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                    section.classList.add('animated');
                }, index * 100);
            }
        });
    };
    
    // Initial setup for animations
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
    });
    
    animateSections();
    window.addEventListener('scroll', animateSections);
    
    // Print functionality
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
        // Expand all sections for printing
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });
    
    // Copy link functionality
    const addCopyLinkButtons = () => {
        sections.forEach(section => {
            const heading = section.querySelector('h2');
            if (heading) {
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-link-btn';
                copyButton.innerHTML = '<i class="fas fa-link"></i>';
                copyButton.title = 'Copy link to this section';
                copyButton.style.cssText = `
                    margin-left: 1rem;
                    padding: 0.25rem 0.5rem;
                    background: transparent;
                    border: 1px solid var(--gray-300);
                    border-radius: var(--radius);
                    color: var(--gray-500);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.875rem;
                `;
                
                copyButton.addEventListener('click', function() {
                    const sectionId = section.getAttribute('id');
                    const url = window.location.origin + window.location.pathname + '#' + sectionId;
                    
                    navigator.clipboard.writeText(url).then(() => {
                        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        this.style.color = 'var(--success)';
                        this.style.borderColor = 'var(--success)';
                        
                        setTimeout(() => {
                            this.innerHTML = '<i class="fas fa-link"></i>';
                            this.style.color = 'var(--gray-500)';
                            this.style.borderColor = 'var(--gray-300)';
                        }, 2000);
                    });
                });
                
                heading.appendChild(copyButton);
            }
        });
    };
    
    addCopyLinkButtons();
});