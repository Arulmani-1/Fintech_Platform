/**
 * STACKLY - Main JavaScript
 * Handles component loading and global behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
});

async function loadComponents() {
    const components = [
        { id: 'navbar-placeholder', url: 'components/navbar.html', callback: initNavbar },
        { id: 'footer-placeholder', url: 'components/footer.html', callback: null },
        { id: 'preloader-placeholder', url: 'components/preloader.html', callback: null }
    ];

    const loadPromises = components.map(async (comp) => {
        const el = document.getElementById(comp.id);
        if (el) {
            try {
                const response = await fetch(comp.url);
                if (response.ok) {
                    const html = await response.text();
                    el.innerHTML = html;
                    // Replace placeholder tag with its inner content
                    const parent = el.parentNode;
                    while (el.firstChild) parent.insertBefore(el.firstChild, el);
                    parent.removeChild(el);
                    
                    if(comp.callback) comp.callback();
                }
            } catch (err) {
                console.error(`Failed to load component: ${comp.url}`, err);
            }
        }
    });

    await Promise.all(loadPromises);
    
    // Dispatch a custom event after all components are loaded so animations can init
    document.dispatchEvent(new Event('componentsLoaded'));
}

function initNavbar() {
    // Mobile menu toggle animation handled by Bootstrap, but we add custom classes
    const navbar = document.querySelector('.navbar');
    
    // Initial check
    updateNavbarState();

    window.addEventListener('scroll', () => {
        updateNavbarState();
    });

    function updateNavbarState() {
        if(window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active-link', 'text-white');
            link.classList.remove('text-white-50');
        } else {
            link.classList.remove('active-link', 'text-white');
            link.classList.add('text-white-50');
        }
    });

    // Handle body scroll lock when mobile menu is open
    const navbarCollapse = document.getElementById('navbarContent');
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
        });
        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        });
    }
}
