import IMask from 'imask';

export function initForms() {
    const forms = document.querySelectorAll('.form');
    
    forms.forEach(form => {
        // Инициализация маски телефона
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            const maskOptions = {
                mask: '+{7} (000) 000-00-00'
            };
            IMask(phoneInput, maskOptions);
        }

        // Валидация формы
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = form.querySelector('#name');
            const phoneInput = form.querySelector('#phone');
            const agreementCheckbox = form.querySelector('#agreement');
            let isValid = true;

            // Проверка имени
            if (!validateName(nameInput)) {
                isValid = false;
            }

            // Проверка телефона
            if (!validatePhone(phoneInput)) {
                isValid = false;
            }

            // Проверка согласия
            if (!validateAgreement(agreementCheckbox)) {
                isValid = false;
            }

            // Если форма валидна - отправляем
            if (isValid) {
                submitForm(form);
            }
        });

        // Очистка ошибок при вводе
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form__group');
                if (group) {
                    group.classList.remove('error');
                }
            });
        });
    });
}

function validateName(input) {
    if (!input.value.trim()) {
        showError(input, 'Пожалуйста, введите ваше имя');
        return false;
    }
    return true;
}

function validatePhone(input) {
    const phoneValue = input.value.replace(/\D/g, '');
    if (phoneValue.length !== 11) {
        showError(input, 'Введите корректный номер телефона');
        return false;
    }
    return true;
}

function validateAgreement(checkbox) {
    if (!checkbox.checked) {
        showError(checkbox, 'Необходимо согласие на обработку данных');
        return false;
    }
    return true;
}

function showError(input, message) {
    const group = input.closest('.form__group') || input.closest('.form__checkbox');
    if (group) {
        group.classList.add('error');
        const errorElement = group.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

function submitForm(form) {
    // Здесь будет отправка формы на сервер
    // Пока просто показываем сообщение
    alert('Заявка успешно отправлена!');
    form.reset();
    
    // Закрываем модальное окно
    const modal = form.closest('.modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
} 