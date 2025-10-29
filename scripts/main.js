// ==========================================================
// 1. INICIALIZACIÓN DE LIBRERÍAS EXTERNAS (EmailJS)
// NOTA: La librería de EmailJS debe cargarse en el HTML antes que este script.
// ==========================================================
emailjs.init('o4OMvgTA8pdstK10t');

// ==========================================================
// 2. FUNCIONES DE AYUDA (Formulario y EmailJS)
// ==========================================================

function getServiceLabel(serviceValue) {
    const serviceLabels = {
        'air-duct': 'Furnace and Air Duct Cleaning',
        'dryer-vent': 'Dryer Vent Cleaning',
        'carpet': 'Carpet Cleaning',
        'other': 'Other Cleaning (please specify)'
    };
    return serviceLabels[serviceValue] || serviceValue || 'Not specified';
}

function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading(button) {
    button.innerHTML = 'Sending...';
    button.disabled = true;
    button.style.opacity = '0.7';
}

function hideLoading(button) {
    button.innerHTML = 'Submit';
    button.disabled = false;
    button.style.opacity = '1';
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        // Validación básica
        if (field.offsetParent !== null && !field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ef4444';
        } else {
            field.style.borderColor = '#e8efff';
        }
    });

    return isValid;
}

function collectFormData(form) {
    const formData = new FormData(form);
    const selectedService = formData.get('service');

    let emailContent = `
<h2>New Quote Request - GoFlow Services</h2>

<h3>Client Information:</h3>
<p><strong>Name:</strong> ${formData.get('firstName')} ${formData.get('lastName')}</p>
<p><strong>Email:</strong> ${formData.get('email')}</p>
<p><strong>Address:</strong> ${formData.get('address')}</p>
<p><strong>Customer Phone:</strong> ${formData.get('phone') || 'Not specified'}</p>
<p><strong>Preferred Date:</strong> ${formData.get('carpet-date') ? formatDate(formData.get('carpet-date')) : 'Not specified'}</p>

<h3>Requested Service:</h3>
<p><strong>Service Type:</strong> ${getServiceLabel(selectedService)}</p>
`;

    if (selectedService === 'air-duct') {
        emailContent += `
<h3>Air Duct Cleaning Details:</h3>
<p><strong>Would you also like dryer vent cleaning?</strong> ${formData.get('dryer-vent-option') || 'Not specified'}</p>
<p><strong>Building square footage:</strong> ${formData.get('squareFootage') || 'Not specified'} sq ft</p>
<p><strong>Number of vents:</strong> ${formData.get('num-vents') || 'Not specified'}</p>
`;
    } else if (selectedService === 'carpet') {
        emailContent += `
<h3>Carpet Cleaning Details:</h3>
<p><strong>Areas/rooms needing cleaning:</strong><br>${formData.get('rooms') || 'Not specified'}</p>
<p><strong>Stains, pet issues, or specific concerns:</strong><br>${formData.get('stains') || 'None mentioned'}</p>
`;
    }

    emailContent += `
<h3>Additional Message:</h3>
<p>${formData.get('message') || 'No additional message'}</p>

<hr>
<p><em>This form was submitted from the GoFlow Services website</em></p>
<p><em>Submission date: ${new Date().toLocaleString()}</em></p>
`;

    return {
        to_email: 'allan@goflowservices.com',
        from_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        reply_to: formData.get('email'),
        subject: `New Quote - ${getServiceLabel(selectedService)} - ${formData.get('firstName')} ${formData.get('lastName')}`,
        message_html: emailContent,
        client_email: formData.get('email'),
        client_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        service_type: getServiceLabel(selectedService)
    };
}

// ==========================================================
// 3. LÓGICA DEL CARRUSEL (Solo para index.html)
// ==========================================================
const carouselInner = document.getElementById('carousel-inner');
const dots = document.querySelectorAll('.control-dot');
const totalSlides = dots.length;
let currentIndex = 0;
let autoPlayInterval;
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50;
const carouselContainer = document.querySelector('.carousel-container');

if (carouselInner) {
    /** Mueve el carrusel a la diapositiva específica y actualiza los indicadores. */
    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        const transformValue = `translateX(-${currentIndex * 25}%)`;
        carouselInner.style.transform = transformValue;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        resetAutoPlay();
    }

    /** Muestra la siguiente diapositiva. */
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    /** Muestra la diapositiva anterior. */
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    /** Inicia el intervalo de auto-play. */
    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 4000);
    }

    /** Detiene y reinicia el intervalo de auto-play. */
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    /** Determina la dirección del swipe y ejecuta la navegación. */
    function handleSwipe() {
        const distance = touchEndX - touchStartX;
        if (distance > swipeThreshold) {
            prevSlide(); // Swipe hacia la derecha
        } else if (distance < -swipeThreshold) {
            nextSlide(); // Swipe hacia la izquierda
        }
    }

    // Manejo de eventos (Touch/Mouse)
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoPlayInterval);
        }, false);

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            resetAutoPlay();
        }, false);

        carouselContainer.addEventListener('mousedown', (e) => {
            touchStartX = e.screenX;
            clearInterval(autoPlayInterval);
        });

        carouselContainer.addEventListener('mouseup', (e) => {
            touchEndX = e.screenX;
            handleSwipe();
            resetAutoPlay();
        });
    }

    // Inicialización del Carrusel y puntos de control
    document.addEventListener('DOMContentLoaded', () => {
        goToSlide(0);
        startAutoPlay();

        dots.forEach(dot => {
            dot.addEventListener('click', (event) => {
                const index = parseInt(event.target.getAttribute('data-index'));
                if (!isNaN(index)) {
                    goToSlide(index);
                }
            });
        });
    });
}


// ==========================================================
// 4. FUNCIONALIDAD COMPARTIDA (Navegación y Acordeón)
// ==========================================================

// Toggle de Dropdown Menu
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownContainer = document.querySelector('.dropdown');

if (dropdownToggle && dropdownContainer) {
    // Para desktop - hover y click
    dropdownToggle.addEventListener('click', (event) => {
        // Solo funciona en desktop (cuando el menú móvil NO está activo)
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu.classList.contains('mobile-active')) {
            event.preventDefault();
            dropdownContainer.classList.toggle('active');
        }
    });

    // Cerrar dropdown al hacer click fuera (solo desktop)
    document.addEventListener('click', (event) => {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu.classList.contains('mobile-active')) {
            if (!dropdownContainer.contains(event.target)) {
                dropdownContainer.classList.remove('active');
            }
        }
    });
    
    // Hover para desktop
    if (window.innerWidth > 768) {
        dropdownContainer.addEventListener('mouseenter', () => {
            dropdownContainer.classList.add('active');
        });
        
        dropdownContainer.addEventListener('mouseleave', () => {
            dropdownContainer.classList.remove('active');
        });
    }
}

// Smooth scrolling
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

// Acordeón/FAQ
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const accordionContent = header.nextElementSibling;
        const icon = header.querySelector('.accordion-icon');

        // Oculta todos los demás acordeones abiertos
        document.querySelectorAll('.accordion-item.active').forEach(item => {
            if (item !== accordionItem) {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
                item.querySelector('.accordion-icon').textContent = '+';
            }
        });

        // Alterna el acordeón actual
        accordionItem.classList.toggle('active');
        if (accordionItem.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            icon.textContent = '–';
        } else {
            accordionContent.style.maxHeight = null;
            icon.textContent = '+';
        }
    });
});


// ==========================================================
// 5. LÓGICA DE TESTIMONIOS (Solo para index.html)
// ==========================================================
const testimonials = [
    { name: "Name name", text: "Training programs can bring you a major exciting experience of learning through online! You never face any negative experience and enjoy your online learning at Corona Awesome. Jon, on the top advertising a Course available Available online learning." },
    { name: "Maria Garcia", text: "GoFlow Cleaning transformed our office completely! Their attention to detail and professional service exceeded all our expectations. Highly recommended!" },
    { name: "John Smith", text: "Best cleaning service in Saskatoon. They're reliable, thorough, and always leave our home spotless. Worth every penny!" },
    { name: "Sarah Johnson", text: "Professional carpet cleaning service that actually works! Our carpets look brand new after their treatment." },
    { name: "Lisa Chen", text: "Air duct cleaning made such a difference in our home's air quality. The team was knowledgeable and efficient." }
];

let currentTestimonial = 0;
const testimonialSection = document.querySelector('.testimonial-name');

if (testimonialSection) {
    function updateTestimonial(index) {
        const testimonial = testimonials[index];
        document.querySelector('.testimonial-name').textContent = testimonial.name;
        document.querySelector('.testimonial-text').textContent = testimonial.text;

        document.querySelectorAll('.avatar').forEach((avatar, i) => {
            avatar.classList.toggle('active', i === index);
        });
    }

    document.querySelector('.nav-arrow.prev').addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        updateTestimonial(currentTestimonial);
    });

    document.querySelector('.nav-arrow.next').addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial(currentTestimonial);
    });

    document.querySelectorAll('.avatar').forEach((avatar, index) => {
        avatar.addEventListener('click', () => {
            currentTestimonial = index;
            updateTestimonial(currentTestimonial);
        });
    });
}


// ==========================================================
// 6. LÓGICA DE FORMULARIOS, MENÚ MÓVIL Y SCROLLSPY
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
    

    // ========== 6.2. FORMULARIO DE COTIZACIÓN (EmailJS) ==========
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitButton = this.querySelector('.submit-btn');
            showLoading(submitButton);

            const templateParams = collectFormData(this);

            emailjs.send('service_t6wf9bu', 'template_6ux387g', templateParams)
                .then(function (response) {
                    console.log('Email sent successfully:', response);
                    alert('Thank you for your request! We will contact you within the next 24 hours.');
                    quoteForm.reset();
                    // Oculta los campos de detalle después del reset
                    const airDuctFields = document.querySelector('.air-duct-fields');
                    const carpetFields = document.querySelector('.carpet-fields');
                    if (airDuctFields) airDuctFields.style.display = 'none';
                    if (carpetFields) carpetFields.style.display = 'none';
                })
                .catch(function (error) {
                    console.error('Error sending email:', error);
                    alert('There was a problem sending your request. Please try again or contact us at (639) 994-7280.');
                })
                .finally(function () {
                    hideLoading(submitButton);
                });
        });
    }

    // ========== 6.3. MOSTRAR/OCULTAR CAMPOS POR SERVICIO ==========
    const serviceSelect = document.getElementById('service');
    const airDuctFields = document.querySelector('.air-duct-fields');
    const carpetFields = document.querySelector('.carpet-fields');

    if (serviceSelect) {
        function toggleFormFields() {
            const selectedService = serviceSelect.value;
            if (airDuctFields) airDuctFields.style.display = 'none';
            if (carpetFields) carpetFields.style.display = 'none';

            if (selectedService === 'air-duct' && airDuctFields) {
                airDuctFields.style.display = 'block';
            } else if (selectedService === 'carpet' && carpetFields) {
                carpetFields.style.display = 'block';
            }
        }
        serviceSelect.addEventListener('change', toggleFormFields);
        toggleFormFields();
    }

    // ========== 6.4. FORMULARIO DE CONTACTO GENÉRICO ==========
    const contactForm = document.querySelector('.contact-form');
    if (contactForm && contactForm.id !== 'quoteForm') {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            if (!data.firstName || !data.lastName || !data.email || !data.service || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            alert('Thank you for your message! We will get back to you within 24 hours.');
            this.reset();
        });
    }
});

// ==========================================================
// 7. LÓGICA DE NAVEGACIÓN ACTIVA (ScrollSpy)
// ==========================================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
        if (current === 'services' && link.getAttribute('href') === '#services') {
            link.classList.add('active');
        }
    });
});

// ==========================================================
// 8. MENÚ MÓVIL - FUNCIONALIDAD HAMBURGER
// ==========================================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const body = document.body;

if (mobileMenuToggle && navMenu) {
    // Función para abrir el menú
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        navMenu.classList.add('mobile-active');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.add('active');
        }
        body.style.overflow = 'hidden'; // Evita scroll del body
    }

    // Función para cerrar el menú
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('mobile-active');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
        }
        body.style.overflow = ''; // Restaura scroll del body
    }

    // Toggle del menú al hacer click en el botón hamburguesa
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains('mobile-active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Cerrar menú al hacer click en el overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Cerrar menú al hacer click en un enlace (excepto dropdown)
    const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Cerrar menú al hacer click en un item del dropdown
    const dropdownItems = navMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Manejar dropdown en móvil
    const dropdownToggleMobile = navMenu.querySelector('.dropdown-toggle');
    const dropdownMobile = navMenu.querySelector('.dropdown');

    if (dropdownToggleMobile && dropdownMobile) {
        dropdownToggleMobile.addEventListener('click', (e) => {
            // Solo funciona cuando el menú móvil está activo
            if (navMenu.classList.contains('mobile-active')) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle del dropdown
                dropdownMobile.classList.toggle('active');
                
                // Log para debug
                console.log('Dropdown toggled:', dropdownMobile.classList.contains('active'));
            }
        });
        
        // Prevenir que el click en el dropdown cierre el menú móvil
        dropdownMobile.addEventListener('click', (e) => {
            if (navMenu.classList.contains('mobile-active')) {
                e.stopPropagation();
            }
        });
    }

    // Cerrar menú móvil al cambiar a vista desktop (resize)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('mobile-active')) {
            closeMobileMenu();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card[data-url]');
    
    serviceCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            window.location.href = url;
        });
    });
});