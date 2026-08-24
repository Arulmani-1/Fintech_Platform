/**
 * STACKLY - Animations JavaScript
 * Core GSAP and AOS integrations
 */

document.addEventListener('componentsLoaded', initAnimations);

// If no components loader used (e.g., viewing files directly), try initializing anyway
if (document.readyState === 'complete') {
    setTimeout(initAnimations, 500);
} else {
    window.addEventListener('load', () => setTimeout(initAnimations, 500));
}

let animationsInitialized = false;

function initAnimations() {
    if (animationsInitialized) return;
    animationsInitialized = true;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: false,
            offset: 100
        });
    }

    initPreloader();
    initMouseParallax();
    initScrollAnimations();
    initMagneticButtons();
}

function initPreloader() {
    const preloader = document.querySelector('.preloader-container');
    if (!preloader) return;

    // Use a timeline to ensure exactly 2s duration
    const tl = gsap.timeline({
        onComplete: () => {
            // Close immediately when 100% is reached (0s duration fade)
            gsap.set(preloader, { opacity: 0 });
            preloader.remove();
            document.dispatchEvent(new Event('preloaderFinished'));
            
            // Handle redirect if on index.html
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                window.location.href = 'home.html';
            }
        }
    });

    let progressObj = { val: 0 };

    tl.to('.preloader-progress-fill', {
        width: "100%",
        duration: 2,
        ease: "none"
    }, 0)
    .to('.preloader-percentage-container', {
        left: "100%",
        duration: 2,
        ease: "none"
    }, 0)
    .to(progressObj, {
        val: 100,
        duration: 2,
        ease: "none",
        onUpdate: function() {
            const counter = document.querySelector('.preloader-percentage');
            if (counter) counter.innerText = Math.round(progressObj.val) + "%";
        }
    }, 0);
}

function initMouseParallax() {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        document.querySelectorAll('.parallax-layer-1').forEach(layer => {
            layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
        document.querySelectorAll('.parallax-layer-2').forEach(layer => {
            layer.style.transform = `translateX(${x * 2}px) translateY(${y * 2}px)`;
        });
        document.querySelectorAll('.parallax-layer-3').forEach(layer => {
            layer.style.transform = `translateX(${-x}px) translateY(${-y}px)`;
        });
    });
}

function initScrollAnimations() {
    // Reveal Images with masking
    const revealImages = document.querySelectorAll('.image-reveal');
    revealImages.forEach(container => {
        const image = container.querySelector('img');
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 80%"
            }
        });
        
        tl.set(container, { autoAlpha: 1 });
        tl.from(container, 1.5, {
            xPercent: -100,
            ease: Power2.out
        });
        tl.from(image, 1.5, {
            xPercent: 100,
            scale: 1.3,
            delay: -1.5,
            ease: Power2.out
        });
    });

    // Counters
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            onEnter: () => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const prefix = counter.getAttribute('data-prefix') || '';
                const suffix = counter.getAttribute('data-suffix') || '';
                
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    ease: "power3.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        counter.innerHTML = prefix + Math.round(this.targets()[0].innerHTML) + suffix;
                    }
                });
            },
            once: true
        });
    });

    // Skill Progress Bars
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        ScrollTrigger.create({
            trigger: bar,
            start: "top 90%",
            onEnter: () => {
                const width = bar.getAttribute('data-width');
                gsap.to(bar, {
                    width: width,
                    duration: 1.5,
                    ease: "power3.out"
                });
            },
            once: true
        });
    });
}

function initMagneticButtons() {
    // Magnetic animation removed as per user request to keep buttons fixed.
}
