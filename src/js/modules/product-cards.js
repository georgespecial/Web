export function initProductCards() {
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

    // Обработка кнопок "Быстрый просмотр"
    const viewButtons = document.querySelectorAll('.product-card__view');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.product-card');
            showQuickView(card);
        });
    });
}

function showQuickView(card) {
    const productImage = card.querySelector('.product-card__image img').src;
    const productTitle = card.querySelector('h3').textContent;
    const productPrice = card.querySelector('.product-card__price').textContent;
    const productTags = card.querySelector('.product-card__tags')?.innerHTML || '';

    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal__content">
            <button class="modal__close" type="button" aria-label="Закрыть">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${productImage}" alt="${productTitle}">
                    ${productTags}
                </div>
                <div class="modal-info">
                    <h3>${productTitle}</h3>
                    <div class="modal-price">${productPrice}</div>
                    <button class="button button--primary" type="button">Оставить заявку</button>
                </div>
            </div>
        </div>
    `;

    // Добавляем в DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Обработчики закрытия
    const closeBtn = modal.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => closeQuickView(modal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuickView(modal);
        }
    });

    // Обработчик кнопки "Оставить заявку"
    const submitButton = modal.querySelector('.button--primary');
    submitButton.addEventListener('click', () => {
        closeQuickView(modal);
        const requestModal = document.getElementById('requestModal');
        requestModal.classList.add('active');
    });
}

function closeQuickView(modal) {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
} 