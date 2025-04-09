// Импорты
import '../styles/main.scss';
import { initModals } from './modules/modals';
import { initForms } from './modules/forms';
import { initSlider } from './modules/slider';
import { initProductCards } from './modules/product-cards';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initModals();
    initForms();
    initSlider();
    initProductCards();
}); 