document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Scroll Reveal Animations --- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    /* --- Button Ripple Effect --- */
    const buttons = document.querySelectorAll('.ripple-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripple = document.createElement('span');
            ripple.classList.add('ripple-span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* --- Touch Fire Particle Effect --- */
    const canvas = document.getElementById('fire-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const colors = ['#FF4500', '#FF8C00', '#FFD700', '#D4AF37', '#FFF8DC']; // Fire / Gold variations

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const pointer = {
        x: undefined,
        y: undefined
    };

    // Update pointer on mouse move or touch
    window.addEventListener('mousemove', (event) => {
        pointer.x = event.x;
        pointer.y = event.y;
        addParticles(3);
    });

    window.addEventListener('touchmove', (event) => {
        pointer.x = event.touches[0].clientX;
        pointer.y = event.touches[0].clientY;
        addParticles(3);
    });

    // Handle touch/mouse release
    window.addEventListener('mouseout', () => { pointer.x = undefined; pointer.y = undefined; });
    window.addEventListener('touchend', () => { pointer.x = undefined; pointer.y = undefined; });

    class Particle {
        constructor() {
            this.x = pointer.x + (Math.random() * 20 - 10);
            this.y = pointer.y + (Math.random() * 20 - 10);
            // Fire floats upwards and slightly sideways
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * -2.5 - 0.5;
            this.size = Math.random() * 6 + 2; 
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 1; 
            this.decay = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size -= 0.1; 
            this.life -= this.decay;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(this.size, 0), 0, Math.PI * 2);
            // Cinematic gaussian blur glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = `rgba(${this.hexToRgb(this.color)}, ${this.life})`;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
        
        hexToRgb(hex) {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 
                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
                : '255, 255, 255';
        }
    }

    function addParticles(amount) {
        if(pointer.x !== undefined && pointer.y !== undefined) {
            for (let i = 0; i < amount; i++) {
                particlesArray.push(new Particle());
            }
        }
    }

    function animateParticles() {
        // Soft trail effect - clears canvas with slight opacity
        ctx.fillStyle = 'rgba(7, 7, 9, 0.2)'; // blend into dark background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.clearRect(0,0, canvas.width, canvas.height); // actually just clear it for a true transparent canvas over our nice CSS background

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Remove dead particles
            if (particlesArray[i].size <= 0.2 || particlesArray[i].life <= 0) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
});
