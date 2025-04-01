document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Mobile Navigation
    // ======================
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        });
    });
    
    // ======================
    // Smooth Scrolling
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            history.pushState(null, null, targetId);
        });
    });
    
    // ======================
    // Sticky Header
    // ======================
    const header = document.querySelector('header');
    const headerScrollHandler = function() {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };
    
    window.addEventListener('scroll', headerScrollHandler);
    headerScrollHandler();
    
    // ======================
    // Typing Animation
    // ======================
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        const words = ['Web Developer', 'Freelancer'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingTimeout;
        
        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingTimeout = setTimeout(type, 1000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingTimeout = setTimeout(type, 200);
            } else {
                typingTimeout = setTimeout(type, isDeleting ? 100 : 200);
            }
        };
        
        setTimeout(type, 1000);
    }
    
    // ======================
    // Projects Filter
    // ======================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // ======================
    // Skills Animation
    // ======================
    const skillItems = document.querySelectorAll('.skill-item');
    
    if (skillItems.length) {
        const animateSkills = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress');
                    const percent = entry.target.querySelector('.progress-bar span').textContent;
                    
                    progressBar.style.width = '0';
                    setTimeout(() => {
                        progressBar.style.width = percent;
                        progressBar.style.transition = 'width 1.5s ease';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const skillsObserver = new IntersectionObserver(animateSkills, {
            threshold: 0.5
        });
        
        skillItems.forEach(item => {
            skillsObserver.observe(item);
        });
    }
    
    // ======================
    // Contact Form
    // ======================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formElements = this.elements;
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            const formData = {
                name: formElements['name'].value.trim(),
                email: formElements['email'].value.trim(),
                subject: formElements['subject'].value.trim(),
                message: formElements['message'].value.trim()
            };
            
            // Simple validation
            if (!formData.name || !formData.email || !formData.message) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }
            
            if (!validateEmail(formData.email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                showAlert('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }, 1500);
        });
        
        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };
        
        const showAlert = (message, type) => {
            const alertBox = document.createElement('div');
            alertBox.className = `alert ${type}`;
            alertBox.textContent = message;
            
            contactForm.parentNode.insertBefore(alertBox, contactForm);
            
            setTimeout(() => {
                alertBox.classList.add('fade-out');
                setTimeout(() => {
                    alertBox.remove();
                }, 300);
            }, 5000);
        };
    }
    
    // ======================
    // CV Download Function
    // ======================
    const downloadCvBtn = document.querySelector('.btn-download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Path to the CV file (make sure this matches your file location)
            const cvPdfUrl = 'assets/Hamza_Ali_CV.pdf';
            
            // Create temporary download link
            const link = document.createElement('a');
            link.href = cvPdfUrl;
            link.download = 'Hamza_Ali_CV.pdf';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show confirmation
            alert('CV download started! Check your downloads folder.');
        });
    }
    
    // ======================
    // Set Current Year in Footer
    // ======================
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ======================
    // Active Section Highlighting
    // ======================
    const sections = document.querySelectorAll('section');
    if (sections.length) {
        const highlightNavLink = () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 200 && 
                    window.pageYOffset < sectionTop + sectionHeight - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink();
    }
});