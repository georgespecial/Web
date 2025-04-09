// Модальные окна
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация модальных окон
    const videoModal = document.getElementById('videoModal');
    const formModal = document.getElementById('formModal');
    const quickViewModal = document.querySelector('.modal-overlay');
    
    // Открытие видео
    const videoButton = document.querySelector('.button--video');
    if (videoButton) {
        videoButton.addEventListener('click', () => {
            // Открываем видео на YouTube в новой вкладке
            window.open('https://youtu.be/LFZ-ntPA5co?si=9xihPS8Uu6qxmeea', '_blank');
        });
    }

    // Открытие формы заявки
    function initializeOrderButtons() {
        const orderButtons = document.querySelectorAll('.button--primary');
        orderButtons.forEach(button => {
            // Проверяем, не находится ли кнопка внутри формы
            if (!button.closest('form')) {
                button.addEventListener('click', () => {
                    formModal.classList.add('is-active');
                    document.body.style.overflow = 'hidden';
                });
            }
        });
    }

    // Инициализируем кнопки при загрузке
    initializeOrderButtons();

    // Закрытие модальных окон
    const closeButtons = document.querySelectorAll('.modal__close, .modal__close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal') || button.closest('.modal-overlay');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Закрытие по клику вне контента
    [formModal, quickViewModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.is-active, .modal-overlay.is-active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    function closeModal(modal) {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    // Быстрый просмотр
    const viewButtons = document.querySelectorAll('.product-card__view');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-card__price').textContent;
            const productImage = productCard.querySelector('.product-card__image img').src;
            const productTags = Array.from(productCard.querySelectorAll('.tag'))
                .map(tag => tag.textContent);

            const modalProductInfo = document.querySelector('.modal__product-info');
            modalProductInfo.innerHTML = `
                <img src="${productImage}" alt="${productTitle}" style="width: 100%; height: auto; border-radius: 8px;">
                <div class="product-card__tags">
                    ${productTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <h3 style="margin: 16px 0; font-size: 20px;">${productTitle}</h3>
                <div class="product-card__price" style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">${productPrice}</div>
                <button class="button--primary" style="width: 100%;">Оставить заявку</button>
            `;

            // Добавляем информацию о продукте в форму
            const formModal = document.getElementById('formModal');
            if (formModal) {
                const form = formModal.querySelector('.form');
                if (form) {
                    form.setAttribute('data-product', `${productTitle} - ${productPrice}`);
                }
            }

            quickViewModal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            
            // Переинициализируем кнопки после добавления новой кнопки в модальное окно
            initializeOrderButtons();
        });
    });

    // Обработка кнопок "В избранное"
    const favoriteButtons = document.querySelectorAll('.product-card__favorite');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.classList.toggle('active');
            
            // Анимация для кнопки избранного
            if (button.classList.contains('active')) {
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    // Валидация формы
    const form = document.querySelector('.form');
    if (form) {
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;

            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Отправка...';

                const formData = {
                    name: form.querySelector('#name').value.trim(),
                    phone: form.querySelector('#phone').value.trim(),
                    productInfo: form.getAttribute('data-product') || 'Не указано'
                };

                try {
                    const response = await fetch('send_mail.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert('Спасибо! Ваша заявка успешно отправлена.');
                        form.reset();
                        const modal = form.closest('.modal');
                        if (modal) {
                            closeModal(modal);
                        }
                    } else {
                        throw new Error(result.error || 'Произошла ошибка при отправке заявки');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Отправить';
                }
            }
        });
    }

    // Маска телефона
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => phoneMask(input));
        input.addEventListener('focus', () => {
            if (!input.value) {
                input.value = '+7 (';
            }
        });
        input.addEventListener('blur', () => {
            if (input.value === '+7 (') {
                input.value = '';
            }
        });
    });
});

// Вспомогательные функции
function validateInput(input) {
    const errorElement = input.nextElementSibling;
    let isValid = true;

    if (input.type === 'checkbox') {
        isValid = input.checked;
    } else {
        isValid = input.value.trim() !== '';
    }

    if (!isValid) {
        input.classList.add('has-error');
        errorElement?.classList.add('is-visible');
    } else {
        input.classList.remove('has-error');
        errorElement?.classList.remove('is-visible');
    }

    return isValid;
}

function phoneMask(input) {
    const matrix = '+7 (___) ___-__-__';
    let i = 0;
    const def = matrix.replace(/\D/g, '');
    let val = input.value.replace(/\D/g, '');

    if (def.length >= val.length) val = def;

    input.value = matrix.replace(/./g, function(a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
    });
}

// Слайдер для мобильной версии
function initMobileSlider() {
    if (window.innerWidth <= 768) {
        const productsContainer = document.querySelector('.products');
        if (!productsContainer) return;

        const leftColumn = document.querySelector('.products__left-column');
        const rightColumn = document.querySelector('.products__right-column');
        if (!leftColumn || !rightColumn) return;
        
        // Создаем контейнер для слайдера
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'products__container';
        
        const slider = document.createElement('div');
        slider.className = 'products__slider';
        
        // Собираем все карточки
        const allCards = [...leftColumn.children, ...rightColumn.children];
        
        // Создаем слайды
        allCards.forEach(card => {
            const slide = document.createElement('div');
            slide.className = 'products__slide';
            slide.appendChild(card.cloneNode(true));
            slider.appendChild(slide);
        });
        
        // Создаем точки навигации
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-controls';
        
        for (let i = 0; i < allCards.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-slide', i);
            dotsContainer.appendChild(dot);
        }
        
        // Добавляем всё в DOM
        sliderContainer.appendChild(slider);
        productsContainer.innerHTML = '';
        productsContainer.appendChild(sliderContainer);
        productsContainer.appendChild(dotsContainer);
        
        // Обработчики для точек
        let currentSlide = 0;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                goToSlide(slideIndex);
            });
        });
        
        // Свайп для тачскринов
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentSlide < allCards.length - 1) {
                    goToSlide(currentSlide + 1);
                } else if (diff < 0 && currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                }
            }
        }
        
        function goToSlide(index) {
            slider.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }
    }
}

// Вызываем инициализацию слайдера при загрузке и изменении размера окна
window.addEventListener('load', initMobileSlider);
window.addEventListener('resize', initMobileSlider); 