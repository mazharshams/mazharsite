document.addEventListener('DOMContentLoaded', () => {

    // --- NAVIGATION SCROLL EFFECT ---
    const header = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.6rem 1.8rem';
            header.style.background = 'rgba(10, 10, 12, 0.9)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.padding = '0.8rem 2rem';
            header.style.background = 'rgba(10, 10, 12, 0.7)';
            header.style.boxShadow = 'none';
        }
    });

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const threshold = 150;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < window.innerHeight - threshold) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger for components already in view

    // --- SMOOTH SCROLLING FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for sticky nav
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- BUTTON HOVER EFFECTS ---
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });

    // --- LOGO HOVER EFFECT ---
    const logo = document.querySelector('.logo');
    logo.addEventListener('mouseenter', () => {
        logo.innerHTML = 'MAZHAR SHAMS<span>.</span>';
    });
    logo.addEventListener('mouseleave', () => {
        logo.innerHTML = 'MS<span>.</span>';
    });

});
