// ChamadoPro - JavaScript Interativo
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SMOOTH SCROLLING =====
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação de scroll aos elementos
    const animatedElements = document.querySelectorAll('.differential-item, .step-card, .form-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== FORM HANDLING =====
    const clientForm = document.getElementById('client-form');
    const partnerForm = document.getElementById('partner-form');

    // Função para mostrar loading no botão
    function showButtonLoading(button) {
        const originalText = button.textContent;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        return originalText;
    }

    // Função para restaurar botão
    function restoreButton(button, originalText) {
        button.disabled = false;
        button.textContent = originalText;
    }

    // Função para mostrar notificação
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Validação de formulário
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                input.style.borderColor = 'rgba(23, 162, 184, 0.2)';
            }
        });
        
        return isValid;
    }

    // Envio do formulário de cliente
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            const submitButton = this.querySelector('.btn-submit');
            const originalText = showButtonLoading(submitButton);
            
            // Simular envio (substituir por integração real)
            setTimeout(() => {
                restoreButton(submitButton, originalText);
                showNotification('Cadastro realizado com sucesso! Você será avisado sobre o lançamento.');
                this.reset();
            }, 2000);
        });
    }

    // Envio do formulário de parceiro
    if (partnerForm) {
        partnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            const submitButton = this.querySelector('.btn-submit');
            const originalText = showButtonLoading(submitButton);
            
            // Simular envio (substituir por integração real)
            setTimeout(() => {
                restoreButton(submitButton, originalText);
                showNotification('Cadastro de parceiro realizado com sucesso! Entraremos em contato em breve.');
                this.reset();
            }, 2000);
        });
    }

    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // ===== COUNTER ANIMATION =====
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // ===== AUTO-INCREMENTING COUNTER =====
    function initializeAutoCounter() {
        const professionalCounter = document.querySelector('.stat-number[data-target="1032"]');
        if (!professionalCounter) return;

        // Carregar contador salvo no localStorage ou usar valor inicial
        let currentCount = parseInt(localStorage.getItem('chamadopro_professionals') || '1032');
        let lastUpdate = parseInt(localStorage.getItem('chamadopro_last_update') || Date.now());
        
        // Calcular incremento baseado no tempo decorrido (1 profissional a cada 2 horas)
        const hoursElapsed = (Date.now() - lastUpdate) / (1000 * 60 * 60);
        const incrementFromTime = Math.floor(hoursElapsed / 2);
        
        // Incremento por acesso (1 por visita)
        const accessCount = parseInt(localStorage.getItem('chamadopro_access_count') || '0') + 1;
        localStorage.setItem('chamadopro_access_count', accessCount.toString());
        
        // Atualizar contador
        currentCount += incrementFromTime + 1; // +1 para o acesso atual
        
        // Salvar novo estado
        localStorage.setItem('chamadopro_professionals', currentCount.toString());
        localStorage.setItem('chamadopro_last_update', Date.now().toString());
        
        // Atualizar elemento
        professionalCounter.dataset.current = currentCount;
        professionalCounter.dataset.target = currentCount;
        
        // Animar para o novo valor
        animateCounter(professionalCounter, currentCount, 1500);
        
        console.log(`🚀 Profissionais cadastrados: ${currentCount} (+${incrementFromTime + 1})`);
    }

    // Animar contadores quando visíveis
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const current = parseInt(entry.target.dataset.current || target);
                
                if (entry.target.dataset.target === "1032") {
                    // Para o contador de profissionais, usar o sistema automático
                    initializeAutoCounter();
                } else {
                    // Para outros contadores, animação normal
                    animateCounter(entry.target, target);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ===== TYPING EFFECT =====
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Aplicar efeito de digitação ao título principal
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }

    // ===== MOBILE MENU (removido) =====
    function createMobileMenu() {
        // Menu mobile removido para evitar elementos isolados
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    // Lazy loading para imagens (quando adicionadas)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== EASTER EGG =====
    let clickCount = 0;
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                showNotification('🎉 Você descobriu o easter egg! Obrigado por explorar nosso site!', 'success');
                clickCount = 0;
            }
        });
    }

    // ===== LOADING SCREEN =====
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 800);
            }, 2000); // Mostrar loading por 2 segundos
        }
    }

    // ===== INITIALIZATION =====
    createMobileMenu();
    hideLoadingScreen();
    
    // Adicionar estilos para notificações
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            border-left: 4px solid #27ae60;
        }
        
        .notification-error {
            border-left-color: #e74c3c;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-content i {
            color: #27ae60;
        }
        
        .notification-error .notification-content i {
            color: #e74c3c;
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                transform: translateY(-100px);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(notificationStyles);

    console.log('🚀 ChamadoPro carregado com sucesso!');
});
