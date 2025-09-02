// ChamadoPro - Script Principal
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY'); // Substitua pela sua chave pública do EmailJS
    }

    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2000);
    }

    // Sistema de contador crescente para profissionais
    const proCounter = document.getElementById('pro-counter');
    if (proCounter) {
        // Obter o número atual do localStorage ou começar com 1037
        let currentCount = parseInt(localStorage.getItem('chamadopro_professionals_count')) || 1037;
        
        // Incrementar o contador a cada acesso
        currentCount++;
        
        // Salvar o novo número no localStorage
        localStorage.setItem('chamadopro_professionals_count', currentCount.toString());
        
        // Definir o valor final e começar do zero
        proCounter.setAttribute('data-target-final', currentCount.toString());
        proCounter.textContent = '0';
        proCounter.setAttribute('data-current', '0');
        
        // Iniciar animação imediatamente para o contador de profissionais
        setTimeout(() => {
            animateProCounter(proCounter, currentCount);
        }, 1000); // Delay para garantir que a página carregou completamente
    }

    // Função específica para animar o contador de profissionais
    const animateProCounter = (element, target) => {
        console.log('Iniciando animação do contador para:', target);
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 200));
        const speed = 15;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                console.log('Animação concluída:', target);
            }
            element.textContent = Math.floor(current);
        }, speed);
    };

    // Animações dos números das estatísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateNumbers = () => {
        statNumbers.forEach(stat => {
            // Pular o contador de profissionais (já animado separadamente)
            if (stat.id === 'pro-counter') {
                return;
            }
            
            const target = parseInt(stat.getAttribute('data-target') || stat.getAttribute('data-target-final'));
            const current = parseInt(stat.getAttribute('data-current') || 0);
            
            if (target && current < target) {
                const increment = target / 100;
                const speed = 20;
                
                const timer = setInterval(() => {
                    const newValue = Math.min(current + increment, target);
                    stat.setAttribute('data-current', newValue);
                    stat.textContent = Math.floor(newValue);
                    
                    if (newValue >= target) {
                        clearInterval(timer);
                        stat.textContent = target;
                    }
                }, speed);
            }
        });
    };

    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats-container')) {
                    animateNumbers();
                }
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.differential-item, .step-card, .form-container, .stats-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Formulários
    const clientForm = document.getElementById('client-form');
    const partnerForm = document.getElementById('partner-form');

    // Função para enviar email
    const sendEmail = (formData, templateId) => {
        if (typeof emailjs !== 'undefined') {
            emailjs.send('YOUR_SERVICE_ID', templateId, formData)
                .then(() => {
                    showAlert('Sucesso! Você será notificado sobre o lançamento.', 'success');
                })
                .catch(() => {
                    showAlert('Erro ao enviar. Tente novamente ou entre em contato conosco.', 'error');
                });
        } else {
            // Fallback - apenas mostrar mensagem de sucesso
            showAlert('Cadastro realizado! Você será notificado sobre o lançamento.', 'success');
        }
    };

    // Função para mostrar alertas
    const showAlert = (message, type = 'info') => {
        // Criar modal de alerta
        const modal = document.createElement('div');
        modal.className = `alert-modal ${type}`;
        modal.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <p>${message}</p>
                <button class="alert-close">OK</button>
            </div>
        `;
        
        // Estilos do modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const content = modal.querySelector('.alert-content');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        const closeBtn = modal.querySelector('.alert-close');
        closeBtn.style.cssText = `
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
            font-weight: 600;
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 10);
        
        // Fechar modal
        const closeModal = () => {
            modal.style.opacity = '0';
            content.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    };

    // Event listeners dos formulários
    if (clientForm) {
        clientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('client-name').value,
                email: document.getElementById('client-email').value,
                phone: document.getElementById('client-phone').value,
                type: 'Cliente'
            };
            
            // Validar campos
            if (!formData.name || !formData.email || !formData.phone) {
                showAlert('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showAlert('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Validar telefone
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(formData.phone)) {
                showAlert('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.', 'error');
                return;
            }
            
            sendEmail(formData, 'template_client');
            clientForm.reset();
        });
    }

    if (partnerForm) {
        partnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('partner-name').value,
                email: document.getElementById('partner-email').value,
                phone: document.getElementById('partner-phone').value,
                specialty: document.getElementById('partner-specialty').value,
                type: 'Profissional'
            };
            
            // Validar campos
            if (!formData.name || !formData.email || !formData.phone || !formData.specialty) {
                showAlert('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showAlert('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Validar telefone
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(formData.phone)) {
                showAlert('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.', 'error');
                return;
            }
            
            sendEmail(formData, 'template_partner');
            partnerForm.reset();
        });
    }

    // Máscara para telefone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            if (value.length >= 10) {
                value = value.slice(0, 10) + '-' + value.slice(10, 14);
            }
            e.target.value = value;
        });
    });

    // Smooth scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Adicionar efeito de hover nos cards
    const cards = document.querySelectorAll('.differential-item, .step-card, .form-container');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Modal de Serviços
    const servicesModal = document.getElementById('services-modal');
    const viewAllServicesBtn = document.getElementById('view-all-services');
    const closeServicesModal = document.querySelector('.close-services-modal');
    const missingServiceForm = document.getElementById('missing-service-form');

    // Abrir modal de serviços
    if (viewAllServicesBtn) {
        viewAllServicesBtn.addEventListener('click', () => {
            servicesModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        });
    }

    // Fechar modal de serviços
    const closeModal = () => {
        servicesModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll
    };

    if (closeServicesModal) {
        closeServicesModal.addEventListener('click', closeModal);
    }

    // Fechar modal clicando fora
    if (servicesModal) {
        servicesModal.addEventListener('click', (e) => {
            if (e.target === servicesModal) {
                closeModal();
            }
        });
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && servicesModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Formulário de serviço não encontrado
    if (missingServiceForm) {
        missingServiceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const serviceName = document.getElementById('missing-service').value;
            const serviceDesc = document.getElementById('missing-service-desc').value;
            
            if (!serviceName.trim()) {
                showAlert('Por favor, informe qual serviço você precisa.', 'error');
                return;
            }
            
            const formData = {
                service: serviceName,
                description: serviceDesc,
                type: 'Sugestão de serviço',
                timestamp: new Date().toISOString()
            };
            
            // Aqui você pode enviar para EmailJS ou outro serviço
            console.log('Sugestão de serviço:', formData);
            
            showAlert(`Obrigado pela sugestão! Recebemos sua ideia para "${serviceName}". Vamos considerar adicionar este serviço à nossa plataforma!`, 'success');
            
            missingServiceForm.reset();
            closeModal();
        });
    }

    // Funcionalidade de busca
    const searchInput = document.getElementById('services-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResultsCount = document.getElementById('search-results-count');
    const servicesCategories = document.getElementById('services-categories');
    const allServiceItems = document.querySelectorAll('.service-item');
    const allCategories = document.querySelectorAll('.service-category');

    let totalServices = allServiceItems.length;

    // Função para filtrar serviços
    const filterServices = (searchTerm) => {
        const term = searchTerm.toLowerCase().trim();
        let visibleCount = 0;
        let visibleCategories = 0;

        allCategories.forEach(category => {
            const categoryTitle = category.querySelector('h3').textContent.toLowerCase();
            const serviceItems = category.querySelectorAll('.service-item');
            let categoryHasVisibleItems = false;

            serviceItems.forEach(item => {
                const serviceText = item.textContent.toLowerCase();
                const isVisible = term === '' || serviceText.includes(term) || categoryTitle.includes(term);
                
                if (isVisible) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.3s ease forwards';
                    visibleCount++;
                    categoryHasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });

            // Mostrar/ocultar categoria baseado em itens visíveis
            if (categoryHasVisibleItems || term === '') {
                category.style.display = 'block';
                category.style.animation = 'fadeInUp 0.3s ease forwards';
                visibleCategories++;
            } else {
                category.style.display = 'none';
            }
        });

        // Atualizar contador de resultados
        if (term === '') {
            searchResultsCount.textContent = `${totalServices}+ serviços disponíveis`;
        } else {
            searchResultsCount.textContent = `${visibleCount} serviço${visibleCount !== 1 ? 's' : ''} encontrado${visibleCount !== 1 ? 's' : ''}`;
        }

        // Mostrar/ocultar botão de limpar
        if (term.length > 0) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    };

    // Event listeners para busca
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterServices(e.target.value);
        });

        // Busca em tempo real com debounce
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterServices(e.target.value);
            }, 300);
        });
    }

    // Botão de limpar busca
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterServices('');
            searchInput.focus();
        });
    }

    // Adicionar efeito de hover nos itens de serviço
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const serviceName = item.textContent;
            showAlert(`"${serviceName}" - Este é um dos serviços que estará disponível em nossa plataforma quando lançarmos!`, 'info');
        });
    });

    console.log('ChamadoPro - Site carregado com sucesso!');
});
