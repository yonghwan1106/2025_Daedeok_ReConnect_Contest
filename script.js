// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initScrollAnimation();
    initNavigationHighlight();
    initInteractiveElements();
    initProgressBar();
    initTooltips();
    initMobileMenu();
    initSearchFeature();
    initPrintButton();
});

// Smooth scrolling functionality
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);

                // Update navigation active state
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Scroll animation for content blocks
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe content blocks
    const contentBlocks = document.querySelectorAll('.content-block');
    contentBlocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(30px)';
        block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(block);
    });
}

// Navigation highlight based on scroll position
function initNavigationHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;

            if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            updateActiveNavigation('#' + current);
        }
    });
}

// Update active navigation state
function updateActiveNavigation(targetId) {
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Interactive elements
function initInteractiveElements() {
    // Add click animations to cards
    const cards = document.querySelectorAll('.benchmark-card, .axis-card, .effect-card');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Add hover effect for better UX
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Animate stats on scroll
    const statNumbers = document.querySelectorAll('.stat-number, .stat-large');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Animate numbers when they come into view
function animateNumber(element) {
    const text = element.textContent;
    const numbers = text.match(/[\d,.-]+/);

    if (numbers) {
        const finalNumber = parseFloat(numbers[0].replace(/,/g, ''));
        if (!isNaN(finalNumber)) {
            let currentNumber = 0;
            const increment = finalNumber / 50;
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                }

                let displayNumber = Math.round(currentNumber);
                if (finalNumber >= 1000) {
                    displayNumber = displayNumber.toLocaleString();
                }

                element.textContent = text.replace(numbers[0], displayNumber + (text.includes('억') ? '' : ''));
            }, 50);
        }
    }
}

// Progress bar
function initProgressBar() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / windowHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Tooltips for complex terms
function initTooltips() {
    const tooltipData = {
        'PPP': '민관협력(Public-Private Partnership) 방식',
        'CAPEX': '자본지출(Capital Expenditure)',
        'OPEX': '운영지출(Operational Expenditure)',
        'GRDP': '지역내총생산(Gross Regional Domestic Product)',
        '액셀러레이터': '초기 스타트업의 성장을 가속화하는 프로그램',
        '코워킹': '공유 오피스 공간에서 함께 일하는 방식',
        '코리빙': '공유 주거 공간에서 함께 생활하는 방식'
    };

    // Find and wrap tooltip terms
    Object.keys(tooltipData).forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const walker = document.createTreeWalker(
            document.querySelector('.main-content'),
            NodeFilter.SHOW_TEXT
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (regex.test(node.textContent)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            const html = textNode.textContent.replace(regex, `<span class="tooltip-term" data-tooltip="${tooltipData[term]}">${term}</span>`);
            const wrapper = document.createElement('span');
            wrapper.innerHTML = html;
            parent.replaceChild(wrapper, textNode);
        });
    });

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10000;
        max-width: 250px;
    `;
    document.body.appendChild(tooltip);

    // Add tooltip styles for terms
    const style = document.createElement('style');
    style.textContent = `
        .tooltip-term {
            border-bottom: 1px dotted #3498db;
            cursor: help;
            color: #3498db;
        }
    `;
    document.head.appendChild(style);

    // Handle tooltip interactions
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('tooltip-term')) {
            const tooltipText = e.target.getAttribute('data-tooltip');
            tooltip.textContent = tooltipText;
            tooltip.style.opacity = '1';

            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 5) + 'px';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('tooltip-term')) {
            tooltip.style.opacity = '0';
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const nav = document.querySelector('.navigation');
    const navMenu = document.querySelector('.nav-menu');

    // Create mobile menu button
    const menuButton = document.createElement('button');
    menuButton.innerHTML = '☰';
    menuButton.className = 'mobile-menu-btn';
    menuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        padding: 10px;
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
    `;

    nav.querySelector('.nav-container').style.position = 'relative';
    nav.querySelector('.nav-container').appendChild(menuButton);

    // Add mobile styles
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block !important;
            }

            .nav-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #2c3e50;
                flex-direction: column;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }

            .nav-menu.active {
                display: flex;
            }

            .nav-menu li {
                flex: none;
            }
        }
    `;
    document.head.appendChild(mobileStyle);

    // Handle menu toggle
    menuButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuButton.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking a link
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navMenu.classList.remove('active');
            menuButton.innerHTML = '☰';
        }
    });
}

// Search functionality
function initSearchFeature() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        background: white;
        border-radius: 25px;
        padding: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '내용 검색...';
    searchInput.style.cssText = `
        border: none;
        outline: none;
        padding: 8px 15px;
        border-radius: 20px;
        width: 0;
        transition: width 0.3s ease;
        font-size: 14px;
    `;

    const searchButton = document.createElement('button');
    searchButton.innerHTML = '🔍';
    searchButton.style.cssText = `
        border: none;
        background: none;
        padding: 8px;
        cursor: pointer;
        font-size: 16px;
        border-radius: 50%;
    `;

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    document.body.appendChild(searchContainer);

    // Toggle search input
    searchButton.addEventListener('click', () => {
        if (searchInput.style.width === '0px' || searchInput.style.width === '') {
            searchInput.style.width = '200px';
            searchInput.focus();
        } else {
            searchInput.style.width = '0';
            clearHighlights();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            highlightText(query);
        } else {
            clearHighlights();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchInput.style.width = '0';
            clearHighlights();
        }
    });
}

// Highlight search results
function highlightText(query) {
    clearHighlights();

    const walker = document.createTreeWalker(
        document.querySelector('.main-content'),
        NodeFilter.SHOW_TEXT
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.toLowerCase().includes(query.toLowerCase())) {
            textNodes.push(node);
        }
    }

    textNodes.forEach(textNode => {
        const parent = textNode.parentNode;
        const regex = new RegExp(`(${query})`, 'gi');
        const html = textNode.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
        const wrapper = document.createElement('span');
        wrapper.innerHTML = html;
        parent.replaceChild(wrapper, textNode);
    });

    // Style highlights
    const style = document.createElement('style');
    style.id = 'search-highlight-style';
    style.textContent = `
        .search-highlight {
            background-color: yellow;
            font-weight: bold;
            padding: 2px 4px;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
}

// Clear search highlights
function clearHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });

    const style = document.getElementById('search-highlight-style');
    if (style) {
        style.remove();
    }
}

// Print functionality
function initPrintButton() {
    const printButton = document.createElement('button');
    printButton.innerHTML = '🖨️ 인쇄';
    printButton.className = 'print-btn';
    printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3498db;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    printButton.addEventListener('click', () => {
        window.print();
    });

    printButton.addEventListener('mouseenter', () => {
        printButton.style.background = '#2980b9';
        printButton.style.transform = 'translateY(-2px)';
    });

    printButton.addEventListener('mouseleave', () => {
        printButton.style.background = '#3498db';
        printButton.style.transform = 'translateY(0)';
    });

    document.body.appendChild(printButton);
}

// Back to top functionality
window.addEventListener('scroll', () => {
    const backToTopBtn = document.getElementById('back-to-top') || createBackToTopButton();

    if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
    }
});

function createBackToTopButton() {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '↑';
    button.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: #2c3e50;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        pointer-events: none;
    `;

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(button);
    return button;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Alt + number keys for quick navigation
    if (e.altKey) {
        const sections = ['motivation', 'project', 'budget', 'effects', 'conclusion'];
        const key = e.key;

        if (key >= '1' && key <= '5') {
            const sectionId = sections[parseInt(key) - 1];
            const section = document.getElementById(sectionId);
            if (section) {
                e.preventDefault();
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// Add CSS for active navigation state
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-menu a.active {
        background-color: #34495e;
        border-bottom-color: #3498db;
    }
`;
document.head.appendChild(navStyle);