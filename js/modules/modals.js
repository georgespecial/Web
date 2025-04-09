const initModals = () => {
    const quickViewButtons = document.querySelectorAll('.button--quick-view');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseButton = document.querySelector('.modal__close-button');

    if (!modalOverlay || !modalCloseButton) {
        console.error('Modal elements not found');
        return;
    }

    const closeModal = () => {
        modalOverlay.classList.remove('is-active');
        document.body.style.overflow = '';
    };

    const openModal = () => {
        modalOverlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    };

    quickViewButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });

    modalCloseButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
};

export { initModals }; 