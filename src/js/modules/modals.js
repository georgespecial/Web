export function initModals() {
    const requestModal = document.getElementById('requestModal');
    
    // Открытие видео на YouTube
    const videoButton = document.querySelector('.button--video');
    if (videoButton) {
        videoButton.addEventListener('click', () => {
            // Открываем видео на YouTube в новой вкладке
            window.open('https://youtu.be/LFZ-ntPA5co?si=9xihPS8Uu6qxmeea', '_blank');
        });
    }

    // Открытие формы заявки
    const submitButtons = document.querySelectorAll('.button--primary');
    submitButtons.forEach(button => {
        if (!button.closest('form')) {
            button.addEventListener('click', () => {
                openModal(requestModal);
            });
        }
    });

    // Закрытие модальных окон
    document.querySelectorAll('.modal__close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal);
        });
    });

    // Закрытие по клику вне контента
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
} 