import '../scss/main.scss';
import IMask from 'imask';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Инициализация слайдера для мобильной версии
const initMobileSlider = () => {
    if (window.innerWidth <= 768) {
        const swiper = new Swiper('.products__slider', {
            modules: [Navigation, Pagination],
            slidesPerView: 'auto',
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
};

// Модальные окна
const modals = {
    video: document.querySelector('.modal--video'),
    form: document.querySelector('.modal--form')
};

const openModal = (modal) => {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
};

const closeModal = (modal) => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (modal === modals.video) {
        const iframe = modal.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src; // Сброс видео
        }
    }
};

// Обработчики для модальных окон
document.querySelectorAll('.modal__close').forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Видео плеер
const videoButton = document.querySelector('.button--video');
videoButton.addEventListener('click', () => {
    const videoContainer = document.querySelector('#video-player');
    if (!videoContainer.querySelector('iframe')) {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/your-video-id';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        videoContainer.appendChild(iframe);
    }
    openModal(modals.video);
});

// Форма заявки
const form = document.querySelector('.form');
const nameInput = form.querySelector('#name');
const phoneInput = form.querySelector('#phone');

// Маска для телефона
const phoneMask = IMask(phoneInput, {
    mask: '+{7}(000)000-00-00'
});

// Валидация формы
const validateInput = (input) => {
    const errorElement = input.parentElement.querySelector('.form__error');
    if (!input.value.trim()) {
        input.classList.add('has-error');
        errorElement.classList.add('is-visible');
        return false;
    }
    input.classList.remove('has-error');
    errorElement.classList.remove('is-visible');
    return true;
};

// Обработка отправки формы
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameValid = validateInput(nameInput);
    const phoneValid = validateInput(phoneInput);
    const checkboxValid = form.querySelector('input[type="checkbox"]').checked;

    if (nameValid && phoneValid && checkboxValid) {
        // Здесь можно добавить отправку данных на сервер
        alert('Заявка успешно отправлена!');
        form.reset();
        closeModal(modals.form);
    }
});

// Открытие формы заявки
document.querySelectorAll('.button--primary').forEach(button => {
    button.addEventListener('click', () => {
        openModal(modals.form);
    });
});

// Hover эффекты для интерактивных элементов
document.querySelectorAll('.product-card__favorite, .product-card__view').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initMobileSlider();
});

// Обновление слайдера при изменении размера окна
window.addEventListener('resize', () => {
    initMobileSlider();
}); 