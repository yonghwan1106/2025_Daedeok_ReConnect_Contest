// Benchmarking Page Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initScrollAnimation();
    initNavigationHighlight();
    initInteractiveElements();
    initProgressBar();
    initComparativeCharts();
    initCaseStudyFilters();
    initTimelineAnimation();
    initMobileMenu();
    initSearchFeature();
    initPrintButton();
    initDataVisualization();
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

    // Handle back button navigation
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
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
    const contentBlocks = document.querySelectorAll('.content-block, .case-study, .international-case');
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
    const cards = document.querySelectorAll('.case-study, .international-case, .factor-item');

    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only animate if not clicking on a link
            if (!e.target.closest('a')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });

        // Add hover effect for better UX
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.01)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Animate stats on scroll
    const statNumbers = document.querySelectorAll('.stat-number, .analysis-number, .result-number, .metric-target');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                animateNumber(entry.target);
                entry.target.setAttribute('data-animated', 'true');
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
        const originalText = text;
        let finalNumber = parseFloat(numbers[0].replace(/,/g, ''));

        // Handle percentage
        if (text.includes('%')) {
            finalNumber = parseFloat(numbers[0]);
        }

        if (!isNaN(finalNumber)) {
            let currentNumber = 0;
            const increment = finalNumber / 60;
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                }

                let displayNumber = Math.round(currentNumber * 10) / 10;
                if (finalNumber >= 1000 && !text.includes('%')) {
                    displayNumber = Math.round(currentNumber).toLocaleString();
                }

                // Preserve original text format
                element.textContent = originalText.replace(numbers[0], displayNumber);
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
        background: linear-gradient(90deg, #667eea, #764ba2);
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

// Comparative charts for statistics
function initComparativeCharts() {
    const resultCards = document.querySelectorAll('.result-card');

    resultCards.forEach(card => {
        const before = card.querySelector('.result-before');
        const after = card.querySelector('.result-after');

        if (before && after) {
            card.addEventListener('mouseenter', function() {
                // Add visual emphasis on comparison
                before.style.transform = 'scale(0.9)';
                after.style.transform = 'scale(1.1)';
                after.style.color = '#e74c3c';
            });

            card.addEventListener('mouseleave', function() {
                before.style.transform = 'scale(1)';
                after.style.transform = 'scale(1)';
                after.style.color = '';
            });
        }
    });
}

// Case study filters
function initCaseStudyFilters() {
    // Create filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.cssText = `
        position: sticky;
        top: 70px;
        background: white;
        padding: 1rem;
        border-bottom: 1px solid #e9ecef;
        z-index: 500;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    `;

    const filterButtons = [
        { id: 'all', text: '전체', active: true },
        { id: 'domestic', text: '국내사례' },
        { id: 'international', text: '해외사례' },
        { id: 'success-factors', text: '성공요인' }
    ];

    filterButtons.forEach(filter => {
        const button = document.createElement('button');
        button.textContent = filter.text;
        button.className = `filter-btn ${filter.active ? 'active' : ''}`;
        button.setAttribute('data-filter', filter.id);
        button.style.cssText = `
            margin: 0 0.5rem;
            padding: 0.5rem 1rem;
            border: 2px solid #3498db;
            background: ${filter.active ? '#3498db' : 'white'};
            color: ${filter.active ? 'white' : '#3498db'};
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        `;

        button.addEventListener('click', () => filterCases(filter.id));
        filterContainer.appendChild(button);
    });

    // Insert filter after main navigation
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(filterContainer, mainContent.firstChild);
}

function filterCases(filterId) {
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        const isActive = btn.getAttribute('data-filter') === filterId;
        btn.style.background = isActive ? '#3498db' : 'white';
        btn.style.color = isActive ? 'white' : '#3498db';
    });

    // Show/hide sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        let shouldShow = filterId === 'all';

        if (filterId === 'domestic' && sectionId === 'domestic') shouldShow = true;
        if (filterId === 'international' && sectionId === 'international') shouldShow = true;
        if (filterId === 'success-factors' && (sectionId === 'success-factors' || sectionId === 'strategy')) shouldShow = true;

        // Always show overview and conclusion
        if (sectionId === 'overview' || sectionId === 'conclusion') shouldShow = true;

        section.style.display = shouldShow ? 'block' : 'none';
    });
}

// Timeline animation
function initTimelineAnimation() {
    const timelines = document.querySelectorAll('.timeline, .transformation-timeline, .response-timeline');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.timeline-item, .phase, .response-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 300);
                });
            }
        });
    }, { threshold: 0.3 });

    timelines.forEach(timeline => {
        const items = timeline.querySelectorAll('.timeline-item, .phase, .response-item');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        timelineObserver.observe(timeline);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const nav = document.querySelector('.navigation');
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');

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

    navContainer.style.position = 'relative';
    navContainer.appendChild(menuButton);

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
                z-index: 1000;
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
        top: 80px;
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
    searchInput.placeholder = '사례 검색...';
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
            filterBySearch(query);
        } else {
            clearHighlights();
            showAllSections();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchInput.style.width = '0';
            clearHighlights();
            showAllSections();
        }
    });
}

// Filter sections by search query
function filterBySearch(query) {
    const sections = document.querySelectorAll('.section');
    const lowerQuery = query.toLowerCase();

    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        const shouldShow = text.includes(lowerQuery) ||
                          section.getAttribute('id') === 'overview' ||
                          section.getAttribute('id') === 'conclusion';

        section.style.display = shouldShow ? 'block' : 'none';
    });
}

function showAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'block';
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
            background-color: #ffeb3b;
            font-weight: bold;
            padding: 2px 4px;
            border-radius: 3px;
            color: #333;
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
    printButton.innerHTML = '🖨️ 보고서 인쇄';
    printButton.className = 'print-btn';
    printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    printButton.addEventListener('click', () => {
        // Show all sections before printing
        showAllSections();
        clearHighlights();
        window.print();
    });

    printButton.addEventListener('mouseenter', () => {
        printButton.style.background = '#5a6fd8';
        printButton.style.transform = 'translateY(-2px)';
    });

    printButton.addEventListener('mouseleave', () => {
        printButton.style.background = '#667eea';
        printButton.style.transform = 'translateY(0)';
    });

    document.body.appendChild(printButton);
}

// Data visualization for key statistics
function initDataVisualization() {
    // Create visual comparison charts for key statistics
    const statItems = document.querySelectorAll('.analysis-item');

    statItems.forEach(item => {
        const number = item.querySelector('.analysis-number');
        if (number) {
            const value = parseInt(number.textContent);
            createMiniChart(item, value);
        }
    });

    // Create progress bars for funding breakdown
    const fundingItems = document.querySelectorAll('.funding-item');
    fundingItems.forEach(item => {
        const percentage = item.querySelector('.percentage');
        if (percentage) {
            const value = parseInt(percentage.textContent);
            createProgressBar(item, value);
        }
    });
}

function createMiniChart(container, value) {
    const chart = document.createElement('div');
    chart.style.cssText = `
        width: 100%;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        margin-top: 10px;
        overflow: hidden;
    `;

    const bar = document.createElement('div');
    bar.style.cssText = `
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
        width: 0%;
        transition: width 2s ease-in-out;
    `;

    chart.appendChild(bar);
    container.appendChild(chart);

    // Animate bar on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percentage = Math.min(value / 30 * 100, 100); // Scale for visualization
                bar.style.width = percentage + '%';
            }
        });
    });

    observer.observe(container);
}

function createProgressBar(container, percentage) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 100%;
        height: 6px;
        background-color: #ecf0f1;
        border-radius: 3px;
        margin-top: 8px;
        overflow: hidden;
    `;

    const progress = document.createElement('div');
    progress.style.cssText = `
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 3px;
        width: 0%;
        transition: width 1.5s ease-in-out;
    `;

    progressBar.appendChild(progress);
    container.appendChild(progressBar);

    // Animate progress on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    progress.style.width = percentage + '%';
                }, 500);
            }
        });
    });

    observer.observe(container);
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

    button.addEventListener('mouseenter', () => {
        button.style.background = '#34495e';
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.background = '#2c3e50';
        button.style.transform = 'scale(1)';
    });

    document.body.appendChild(button);
    return button;
}

// Keyboard shortcuts for navigation
document.addEventListener('keydown', (e) => {
    // Alt + number keys for quick navigation
    if (e.altKey) {
        const sections = ['overview', 'domestic', 'international', 'success-factors', 'strategy', 'conclusion'];
        const key = e.key;

        if (key >= '1' && key <= '6') {
            const sectionId = sections[parseInt(key) - 1];
            const section = document.getElementById(sectionId);
            if (section) {
                e.preventDefault();
                section.scrollIntoView({ behavior: 'smooth' });
                updateActiveNavigation('#' + sectionId);
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

    .filter-btn:hover {
        background: #2980b9 !important;
        color: white !important;
    }
`;
document.head.appendChild(navStyle);