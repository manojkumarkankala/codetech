// Portfolio data
const portfolioData = [
    {
        img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        title: 'MMMobiles Website',
        description: 'Modern mobile store website showcasing latest smartphones with clean UI and responsive design',
        link: 'https://mmmobiles-eight.vercel.app/'
    },
    {
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      title: 'CC Camera Website',
      description: 'Professional CCTV and security camera website showcasing wired and wireless cameras with modern UI and responsive design',
      link: 'https://cccamera.ccbp.tech/'
    },
    {
     img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
     title: 'Best Fertilizers Website',
     description: 'Agriculture-focused website providing high-quality fertilizers, crop nutrition solutions, and modern farming support for better yield',
     link: 'https://bestfertilizers.ccbp.tech/'
    },
   {
     img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
     title: 'Anil Dhaba Website',
     description: 'Authentic dhaba-style restaurant website showcasing spicy non-veg dishes with traditional flavors and modern responsive design',
     link: 'https://anil-dhaba.vercel.app/'
    }
];

// DOM Elements
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
const portfolioGrid = document.getElementById('portfolio-grid');
const contactForm = document.getElementById('contact-form');
const backToTop = document.getElementById('backToTop');
const fadeElements = document.querySelectorAll('.fade-in');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Load portfolio items
function loadPortfolio() {
    portfolioGrid.innerHTML = '';
    portfolioData.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.innerHTML = `
            <div class="portfolio-img" style="background-image: url('${item.img}')"></div>
            <div class="portfolio-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                 <a href="${item.link}" target="_blank" class="view-btn">
                    View Website
                </a>
            </div>
        `;
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Scroll animations
function handleScrollAnimations() {
    const triggerBottom = window.innerHeight * 0.85;
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.classList.add('visible');
        }
    });

    // Navbar background on scroll
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
    }

    // Back to top button
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

// Contact form handling
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    if (name && phone && message) {
        // Basic validation passed
        alert('Thank you for your message! We will get back to you within 24 hours.');
        contactForm.reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Back to top functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolio();
    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Initial call
});

// Navbar shrink on scroll for mobile
window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768 && window.scrollY > 100) {
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.padding = '1rem 0';
    }
});
window.addEventListener('popstate', function() {
    // Redirect to home page
    window.location.href = "index.html"; // change if your home page is different
});
