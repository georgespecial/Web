import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function initSlider() {
    let swiper = null;

    function initMobileSlider() {
        if (window.innerWidth <= 768 && !swiper) {
            const productsContainer = document.querySelector('.products__container');
            
            // Создаем обертку для слайдера
            productsContainer.classList.add('swiper');
            const wrapper = document.createElement('div');
            wrapper.className = 'swiper-wrapper';
            
            // Собираем все карточки
            const cards = [...document.querySelectorAll('.product-card')];
            cards.forEach(card => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.appendChild(card.cloneNode(true));
                wrapper.appendChild(slide);
            });
            
            // Добавляем навигацию и пагинацию
            const pagination = document.createElement('div');
            pagination.className = 'swiper-pagination';
            
            // Очищаем контейнер и добавляем новые элементы
            productsContainer.innerHTML = '';
            productsContainer.appendChild(wrapper);
            productsContainer.appendChild(pagination);
            
            // Инициализируем Swiper
            swiper = new Swiper('.swiper', {
                modules: [Navigation, Pagination],
                slidesPerView: 1,
                spaceBetween: 16,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                breakpoints: {
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    }
                }
            });
        } else if (window.innerWidth > 768 && swiper) {
            swiper.destroy();
            swiper = null;
            resetProductsLayout();
        }
    }

    function resetProductsLayout() {
        const productsContainer = document.querySelector('.products__container');
        productsContainer.classList.remove('swiper');
        
        // Восстанавливаем оригинальную структуру
        const leftColumn = document.createElement('div');
        leftColumn.className = 'products__left-column';
        
        const rightColumn = document.createElement('div');
        rightColumn.className = 'products__right-column';
        
        const cards = [...document.querySelectorAll('.product-card')];
        cards.forEach((card, index) => {
            if (index === 0) {
                leftColumn.appendChild(card);
            } else {
                rightColumn.appendChild(card);
            }
        });
        
        productsContainer.innerHTML = '';
        productsContainer.appendChild(leftColumn);
        productsContainer.appendChild(rightColumn);
    }

    // Инициализация при загрузке и изменении размера окна
    initMobileSlider();
    window.addEventListener('resize', initMobileSlider);
} 