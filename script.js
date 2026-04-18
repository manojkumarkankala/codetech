// Portfolio data
const portfolioData = [{
        img: 'https://res.cloudinary.com/dptxuxhbm/image/upload/v1776041099/mmmobiles_loxnuo.png',
        title: 'MMMobiles Website',
        description: 'Modern mobile store website showcasing latest smartphones with clean UI and responsive design',
        link: 'https://mmmobiles-eight.vercel.app/'
    },
    {
        img: 'https://res.cloudinary.com/dptxuxhbm/image/upload/v1776041046/msinfotech_cctv_xhtseb.png',
        title: 'CC Camera Website',
        description: 'Professional CCTV and security camera website showcasing wired and wireless cameras with modern UI and responsive design',
        link: 'https://cccamera.ccbp.tech/'
    },
    {
        img: "https://res.cloudinary.com/dptxuxhbm/image/upload/v1776040933/fetilizers_clgeu6.png",
        title: 'Best Fertilizers Website',
        description: 'Agriculture-focused website providing high-quality fertilizers, crop nutrition solutions, and modern farming support for better yield',
        link: 'https://bestfertilizers.ccbp.tech/'
    },
    {
        img: 'https://res.cloudinary.com/dptxuxhbm/image/upload/v1776040699/anildhaba_v81gi0.png',
        title: 'Anil Dhaba Website',
        description: 'Authentic dhaba-style restaurant website showcasing spicy non-veg dishes with traditional flavors and modern responsive design',
        link: 'https://anil-dhaba.vercel.app/'
    },
    {
        img: 'https://res.cloudinary.com/dptxuxhbm/image/upload/v1776040984/fashion_hub_ttfsbl.png',
        title: 'Fashion Hub Website',
        description: 'Modern clothing store website showcasing trendy outfits, stylish collections, and responsive e-commerce design for a seamless shopping experience',
        link: 'https://fashion-hub-blond.vercel.app/'
    },
    {
        img: ' https://res.cloudinary.com/dptxuxhbm/image/upload/v1776181393/Screenshot_2026-04-14_211243_qfbllh.png',
        title: 'SNK DAIRY Website',
        description: "We provide 100% pure, farm-fresh milk and traditional hand-churned ghee, delivered straight from our dairy to your doorstep",
        link: 'https://smk-dairy.vercel.app/'
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
    anchor.addEventListener('click', function(e) {
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
            <div class="portfolio-img" 
                 style="background-image: url('${item.img}')">
            </div>

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
        //alert('Thank you for your message! We will get back to you within 24 hours.');
        const whatsappNumber = "918341827908"; // change to your number

        // Create message
        const text = `Name: ${name}%0APhone: ${phone}%0AMessage: ${message}`;

        // WhatsApp URL
        const url = `https://wa.me/${whatsappNumber}?text=${text}`;

        // Open WhatsApp
        window.open(url, '_blank');

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
