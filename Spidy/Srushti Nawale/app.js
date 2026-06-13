document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Preloader Logic
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 600);
        });
        
        // Backup timeout in case window load event doesn't fire immediately
        setTimeout(() => {
            if (document.body.contains(preloader)) {
                preloader.classList.add('fade-out');
                setTimeout(() => preloader.remove(), 600);
            }
        }, 3000);
    }

    /* ==========================================================================
       2. Sticky Navigation Header
       ========================================================================== */
    const header = document.getElementById('main-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    /* ==========================================================================
       3. Theme Toggle (Light / Dark Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const htmlEl = document.documentElement;

    // Check existing preference or system default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    const toggleTheme = () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    /* ==========================================================================
       4. Mobile Nav Overlay Menu
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileCollabBtn = document.querySelector('.btn-mobile-collab');

    const toggleMobileMenu = () => {
        mobileToggle.classList.toggle('active');
        mobileOverlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    const closeMobileMenu = () => {
        mobileToggle.classList.remove('active');
        mobileOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    if (mobileCollabBtn) mobileCollabBtn.addEventListener('click', closeMobileMenu);

    /* ==========================================================================
       5. Scroll Reveal Animation (Vanilla JS GSAP replica)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal, section, .reel-card, .portfolio-item');
    
    // Add base transition classes dynamically
    revealElements.forEach((el) => {
        if (!el.classList.contains('scroll-reveal')) {
            el.classList.add('scroll-reveal');
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       6. Stats Animate Counters
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = stat.getAttribute('data-decimal') === 'true';
            const duration = 2000; // 2 seconds animation
            const startTime = performance.now();

            const updateNumber = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                let currentVal = easeProgress * target;

                if (isDecimal) {
                    stat.textContent = currentVal.toFixed(1) + '%';
                } else {
                    // Format output with K for larger counts
                    const rounded = Math.floor(currentVal);
                    if (rounded >= 1000) {
                        stat.textContent = (rounded / 1000).toFixed(rounded >= 100000 ? 0 : 1) + 'K+';
                    } else {
                        stat.textContent = rounded + '+';
                    }
                }

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    // Ensure final values are clean
                    if (isDecimal) {
                        stat.textContent = target.toFixed(1) + '%';
                    } else {
                        if (target >= 1000) {
                            stat.textContent = (target / 1000).toFixed(target >= 100000 ? 0 : 1) + 'K+';
                        } else {
                            stat.textContent = target + '+';
                        }
                    }
                }
            };
            requestAnimationFrame(updateNumber);
        });
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animatedStats) {
                animatedStats = true;
                animateCounters();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       7. Campaign Videos Mute/Unmute Controls (Autoplay Sound toggle)
       ========================================================================== */
    const videoCards = document.querySelectorAll('.reel-card');
    
    videoCards.forEach(card => {
        const video = card.querySelector('.reel-video');
        const soundBtn = card.querySelector('.video-sound-toggle');
        
        if (video && soundBtn) {
            soundBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid other triggers
                if (video.muted) {
                    video.muted = false;
                    soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                } else {
                    video.muted = true;
                    soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                }
            });

            // Tap/Click video card itself to play/pause
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }
    });

    /* ==========================================================================
       8. Instagram Story Highlights Viewer Modal
       ========================================================================== */
    const storiesData = {
        fashion: {
            image: 'images/srushti_hero.jpg',
            text: '👗 Curating minimal, classic street wear profiles. Focus on texture pairings and neutral aesthetics.',
            duration: 5000
        },
        lifestyle: {
            image: 'images/srushti_about.jpg',
            text: '✨ Documenting cozy Pune coffee spots & visual flatlays. Aesthetic details that celebrate daily simple rituals.',
            duration: 5000
        },
        travel: {
            image: 'images/srushti_hero.jpg',
            text: '✈️ Highlighting design-forward stays, sunset wanderings, and boutique hotels in India.',
            duration: 5000
        },
        collabs: {
            image: 'images/srushti_about.jpg',
            text: '🤝 Partnering with luxury apparel brands. Blending organic stories with high click-through engagement.',
            duration: 5000
        },
        bts: {
            image: 'images/srushti_hero.jpg',
            text: '🎬 Behind the scenes: Storyboarding shoots, scripting reels content, and editing aesthetics templates.',
            duration: 5000
        }
    };

    const highlightItems = document.querySelectorAll('.highlight-item');
    const storyModal = document.getElementById('story-modal');
    const storyClose = document.getElementById('story-close');
    const storyImg = document.getElementById('story-img');
    const storyText = document.getElementById('story-text');
    const progressBar = document.getElementById('story-progress-bar');
    const storyPrev = document.getElementById('story-prev-btn');
    const storyNext = document.getElementById('story-next-btn');

    let storyKeys = Object.keys(storiesData);
    let currentStoryIndex = 0;
    let storyTimer = null;
    let storyProgressInterval = null;
    let storyStartTime = 0;
    let storyElapsed = 0;
    let isStoryPaused = false;

    const openStoryModal = (key) => {
        currentStoryIndex = storyKeys.indexOf(key);
        storyModal.classList.add('open');
        document.body.classList.add('no-scroll');
        loadStory(currentStoryIndex);
    };

    const loadStory = (index) => {
        clearInterval(storyProgressInterval);
        clearTimeout(storyTimer);
        storyElapsed = 0;
        isStoryPaused = false;
        
        const key = storyKeys[index];
        const data = storiesData[key];
        
        if (data) {
            storyImg.src = data.image;
            storyText.textContent = data.text;
            progressBar.style.width = '0%';
            
            storyStartTime = Date.now();
            startStoryAnimation(data.duration);
        }
    };

    const startStoryAnimation = (duration) => {
        const totalSteps = 100;
        const stepTime = duration / totalSteps;
        
        storyProgressInterval = setInterval(() => {
            if (!isStoryPaused) {
                storyElapsed += stepTime;
                const progressPct = Math.min((storyElapsed / duration) * 100, 100);
                progressBar.style.width = `${progressPct}%`;
                
                if (storyElapsed >= duration) {
                    clearInterval(storyProgressInterval);
                    advanceStory();
                }
            }
        }, stepTime);
    };

    const advanceStory = () => {
        if (currentStoryIndex < storyKeys.length - 1) {
            currentStoryIndex++;
            loadStory(currentStoryIndex);
        } else {
            closeStoryModal();
        }
    };

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            currentStoryIndex--;
            loadStory(currentStoryIndex);
        }
    };

    const closeStoryModal = () => {
        storyModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
        clearInterval(storyProgressInterval);
        clearTimeout(storyTimer);
        progressBar.style.width = '0%';
    };

    // Story click bindings
    highlightItems.forEach(item => {
        item.addEventListener('click', () => {
            const highlightKey = item.getAttribute('data-highlight');
            openStoryModal(highlightKey);
        });
    });

    if (storyClose) storyClose.addEventListener('click', closeStoryModal);
    if (storyNext) storyNext.addEventListener('click', advanceStory);
    if (storyPrev) storyPrev.addEventListener('click', prevStory);

    // Tap/Hold to pause story highlight, release to resume
    const storyContainer = document.querySelector('.story-modal-container');
    if (storyContainer) {
        const pauseStory = () => { isStoryPaused = true; };
        const resumeStory = () => { isStoryPaused = false; };
        storyContainer.addEventListener('mousedown', pauseStory);
        storyContainer.addEventListener('mouseup', resumeStory);
        storyContainer.addEventListener('touchstart', pauseStory);
        storyContainer.addEventListener('touchend', resumeStory);
    }

    // Modal backdrops click closes them
    storyModal.addEventListener('click', (e) => {
        if (e.target === storyModal) closeStoryModal();
    });

    /* ==========================================================================
       9. Portfolio Filtering & Lightbox Gallery
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Filtering Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategories = item.className;
                if (filterValue === 'all' || itemCategories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox modal variables
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let visiblePortfolioItems = [];
    let currentLightboxIndex = 0;

    const openLightbox = (index) => {
        visiblePortfolioItems = Array.from(portfolioItems).filter(item => item.style.display !== 'none');
        currentLightboxIndex = visiblePortfolioItems.indexOf(visiblePortfolioItems[index] || visiblePortfolioItems[0]);
        
        lightboxModal.classList.add('open');
        document.body.classList.add('no-scroll');
        loadLightboxItem(currentLightboxIndex);
    };

    const loadLightboxItem = (index) => {
        const item = visiblePortfolioItems[index];
        if (item) {
            const src = item.getAttribute('data-src');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            const category = item.querySelector('.category').textContent;

            lightboxImg.src = src;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            lightboxCategory.textContent = category;
        }
    };

    const prevLightbox = () => {
        if (currentLightboxIndex > 0) {
            currentLightboxIndex--;
            loadLightboxItem(currentLightboxIndex);
        } else {
            currentLightboxIndex = visiblePortfolioItems.length - 1;
            loadLightboxItem(currentLightboxIndex);
        }
    };

    const nextLightbox = () => {
        if (currentLightboxIndex < visiblePortfolioItems.length - 1) {
            currentLightboxIndex++;
            loadLightboxItem(currentLightboxIndex);
        } else {
            currentLightboxIndex = 0;
            loadLightboxItem(currentLightboxIndex);
        }
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Update items first in case filter changed
            visiblePortfolioItems = Array.from(portfolioItems).filter(item => item.style.display !== 'none');
            const relativeIndex = visiblePortfolioItems.indexOf(item);
            openLightbox(relativeIndex);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    // Keyboard support for modals
    document.addEventListener('keydown', (e) => {
        if (storyModal.classList.contains('open')) {
            if (e.key === 'Escape') closeStoryModal();
            if (e.key === 'ArrowRight') advanceStory();
            if (e.key === 'ArrowLeft') prevStory();
        }
        if (lightboxModal.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
        }
    });

    /* ==========================================================================
       10. Testimonials Premium Slider
       ========================================================================== */
    const sliderTrack = document.getElementById('testimonials-slider-track');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('slider-dots');

    let slideIndex = 0;

    const updateSlider = () => {
        if (!sliderTrack) return;
        sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            if (idx === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const nextSlide = () => {
        slideIndex = (slideIndex + 1) % testimonials.length;
        updateSlider();
    };

    const prevSlide = () => {
        slideIndex = (slideIndex - 1 + testimonials.length) % testimonials.length;
        updateSlider();
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Generate testimonial slide dots dynamically
    if (dotsContainer && testimonials.length > 0) {
        dotsContainer.innerHTML = '';
        testimonials.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                slideIndex = idx;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Auto slide testimonials every 8 seconds
    let testimonialInterval = setInterval(nextSlide, 8000);
    const stopAutoSlide = () => clearInterval(testimonialInterval);
    
    if (sliderTrack) {
        sliderTrack.addEventListener('mouseenter', stopAutoSlide);
        sliderTrack.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(nextSlide, 8000);
        });
    }

    /* ==========================================================================
       11. Contact Form Submission Handling
       ========================================================================== */
    const collabForm = document.getElementById('collab-form');
    const successModal = document.getElementById('success-modal');
    const successCloseBtn = document.getElementById('success-close-btn');

    if (collabForm) {
        collabForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission
            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending CampaignProposal...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show Success Modal
                if (successModal) {
                    successModal.classList.add('open');
                    document.body.classList.add('no-scroll');
                }
                
                collabForm.reset();
            }, 1500);
        });
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    }

    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }
});
