// GO Drive Website JavaScript

document.addEventListener('DOMContentLoaded', function() {

    // --- QUERY SELECTORS ---
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.nav-mobile-menu');
    const bookingForm = document.getElementById('booking-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    const allButtons = document.querySelectorAll('button, .btn-contact');
    const allImages = document.querySelectorAll('img');
    const customerLogos = document.querySelectorAll('.customer-logo img');
    const heroCar = document.querySelector('.hero-car');
    const socialIcons = document.querySelectorAll('.social-icon[data-platform]');
    const sectionsToAnimate = document.querySelectorAll('section');
    const formInputs = document.querySelectorAll('.field-input, .newsletter-input');

    // --- CORE FUNCTIONALITY ---

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (mobileMenu && mobileMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const pickupLocation = document.getElementById('pickup-location').value;
            const pickupDate = document.getElementById('pickup-date').value;
            const returnDate = document.getElementById('return-date').value;

            if (!pickupLocation || !pickupDate) {
                alert('Please fill in all required fields.');
                return;
            }

            alert(`Booking request submitted!\nPickup: ${pickupLocation}\nDate: ${pickupDate}`);
            bookingForm.reset();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value.trim();

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            alert(`Thank you for subscribing! We'll send updates to ${email}.`);
            emailInput.value = '';
        });
    }

    // --- ANIMATIONS & EFFECTS ---

    window.addEventListener('scroll', function() {
        if (heroCar) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.4;
            heroCar.style.transform = `translateY(${rate}px)`;
        }
    });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                if (entry.target.classList.contains('facts')) {
                    const counters = entry.target.querySelectorAll('.fact-number[data-target]');
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.target, 10);
                        const suffix = counter.dataset.suffix || '';
                        counter.textContent = '0' + suffix; // Reset before animate
                        animateCounter(counter, target, 2000, suffix);
                    });
                }
            }
        });
    }, { threshold: 0.3 });

    sectionsToAnimate.forEach(section => {
        scrollObserver.observe(section);
    });

    customerLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => logo.style.transform = 'scale(1.05)');
        logo.addEventListener('mouseleave', () => logo.style.transform = 'scale(1)');
    });

    // --- UTILITY FUNCTIONS ---

    function animateCounter(element, target, duration = 2000, suffix = '') {
        let start = 0;
        const increment = target / (duration / 16);

        function update() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + suffix;
                requestAnimationFrame(update);
            } else {
                element.textContent = target + suffix;
            }
        }

        update();
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months are 0-based
    let dd = today.getDate();

    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    const formattedToday = `${yyyy}-${mm}-${dd}`;
    console.log(formattedToday);

    const now = new Date();
    const localISOTime = now.toISOString().slice(0, 16);
    document.getElementById('pickupDate').min = localISOTime;
    document.getElementById('returnDate').min = localISOTime;

    function formatDate(dateObj) {
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function formatTime(dateObj) {
        return dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // Save both dates
    document.querySelectorAll('.btn-continue').forEach(btn => {
        btn.addEventListener('click', () => {

            console.log("click");
            const container = event.currentTarget.closest('.booking-fields');
            const pickup = container.querySelector('.pickupDate').value;
            const ret = container.querySelector('.returnDate').value;
            if (pickup && ret) {
                const pickupDateObj = new Date(pickup);
                const returnDateObj = new Date(ret);

                localStorage.setItem('pickupDate', formatDate(pickupDateObj));
                localStorage.setItem('pickupTime', formatTime(pickupDateObj));
                localStorage.setItem('returnDate', formatDate(returnDateObj));
                localStorage.setItem('returnTime', formatTime(returnDateObj));
                window.location.href = "vehicles.html"; // Change to your target page
            } else {
                alert("Please select both dates.");
            }
        });
    });


    console.log('🚗 GO Drive website loaded successfully!');
});
