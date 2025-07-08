// Set current year
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Cookie Bar functionality
        const cookieBar = document.getElementById('cookieBar');
        const cookieAccept = document.getElementById('cookieAccept');
        const cookieSettings = document.getElementById('cookieSettings');
        const cookieModal = document.getElementById('cookieModal');
        const cookieModalClose = document.getElementById('cookieModalClose');
        const saveCookieSettings = document.getElementById('saveCookieSettings');

        // Check if cookies have been accepted
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBar.classList.add('show');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            localStorage.setItem('analyticsCookies', 'true');
            localStorage.setItem('marketingCookies', 'true');
            cookieBar.classList.remove('show');
        });

        cookieSettings.addEventListener('click', () => {
            showCookieModal();
        });

        function showCookieModal() {
            cookieModal.classList.add('active');
            setTimeout(() => {
                cookieModal.classList.add('show');
            }, 10);
            
            // Load saved preferences
            document.getElementById('analyticsCookies').checked = localStorage.getItem('analyticsCookies') === 'true';
            document.getElementById('marketingCookies').checked = localStorage.getItem('marketingCookies') === 'true';
        }

        function hideCookieModal() {
            cookieModal.classList.remove('show');
            setTimeout(() => {
                cookieModal.classList.remove('active');
            }, 300);
        }

        cookieModalClose.addEventListener('click', hideCookieModal);

        cookieModal.addEventListener('click', (e) => {
            if (e.target === cookieModal) {
                hideCookieModal();
            }
        });

        saveCookieSettings.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            localStorage.setItem('analyticsCookies', document.getElementById('analyticsCookies').checked);
            localStorage.setItem('marketingCookies', document.getElementById('marketingCookies').checked);
            cookieBar.classList.remove('show');
            hideCookieModal();
        });
 
 // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Form submission
        document.querySelector('.cta-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            alert(`Thank you! We'll contact you at ${email} within 24 hours.`);
            e.target.reset();
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s ease';
            observer.observe(section);
        });

// Modal functionality
        const modal = document.getElementById('emailModal');
        const modalClose = document.getElementById('modalClose');
        const modalForm = document.getElementById('modalForm');
        let modalShown = false;

        // Show modal after 5 seconds or on exit intent
        setTimeout(() => {
            if (!modalShown && !localStorage.getItem('modalDismissed')) {
                showModal();
            }
        }, 5000);

        // Exit intent detection
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !modalShown && !localStorage.getItem('modalDismissed')) {
                showModal();
            }
        });

        function showModal() {
            modalShown = true;
            modal.classList.add('active');
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }

        function hideModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 300);
        }

        modalClose.addEventListener('click', () => {
            hideModal();
            localStorage.setItem('modalDismissed', 'true');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
                localStorage.setItem('modalDismissed', 'true');
            }
        });

        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            alert(`Thank you! Your 10% discount code has been sent to ${email}`);
            hideModal();
            localStorage.setItem('modalDismissed', 'true');
            e.target.reset();
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submission
        document.querySelector('.cta-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            alert(`Thank you! We'll contact you at ${email} within 24 hours.`);
            e.target.reset();
        });