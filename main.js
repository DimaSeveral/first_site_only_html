// ========== МОДАЛЬНОЕ ОКНО ДЛЯ ИЗОБРАЖЕНИЙ ==========
document.addEventListener('DOMContentLoaded', function() {
    const imagePreviews = document.querySelectorAll('.img-preview');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (imageModal && modalImage) {
        // Инициализируем модальное окно Bootstrap
        const bsModal = new bootstrap.Modal(imageModal, {
            backdrop: true,
            keyboard: true,
            focus: true
        });
        
        // Флаг для отслеживания открытого состояния
        let isModalOpen = false;
        
        imagePreviews.forEach(preview => {
            preview.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const fullImage = this.getAttribute('data-full');
                if (fullImage) {
                    modalImage.src = fullImage;
                    modalImage.alt = this.alt || 'Изображение';
                    
                    // Убеждаемся, что модальное окно полностью закрыто перед открытием
                    if (isModalOpen) {
                        bsModal.hide();
                        setTimeout(() => {
                            bsModal.show();
                        }, 150);
                    } else {
                        bsModal.show();
                    }
                    
                    isModalOpen = true;
                }
            });
        });
        
        // Очищаем src и восстанавливаем фокус при закрытии
        imageModal.addEventListener('hidden.bs.modal', function() {
            modalImage.src = '';
            isModalOpen = false;
            
            // Снимаем блокировку прокрутки и восстанавливаем фокус
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            // Убираем оверлей, если он остался
            const modalsBackdrops = document.querySelectorAll('.modal-backdrop');
            modalsBackdrops.forEach(backdrop => {
                backdrop.remove();
            });
            
            // Возвращаем возможность взаимодействия со страницей
            document.body.style.pointerEvents = '';
            
            // Убираем фокус с модального окна
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
        });
        
        // Обработка ошибок загрузки изображения
        modalImage.addEventListener('error', function() {
            console.error('Ошибка загрузки изображения:', modalImage.src);
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"%3E%3Crect x="2" y="2" width="20" height="20"%3E%3C/rect%3E%3Cline x1="8" y1="8" x2="16" y2="16"%3E%3C/line%3E%3Cline x1="16" y1="8" x2="8" y2="16"%3E%3C/line%3E%3C/svg%3E';
            this.alt = 'Ошибка загрузки изображения';
        });
        
        // Закрытие по ESC (на всякий случай)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isModalOpen) {
                bsModal.hide();
            }
        });
    }
});
    
// ========== НАСТРОЙКА jQuery.fx.speeds ==========
// Определяем собственные скорости анимации
jQuery.fx.speeds._default = 400;  // скорость по умолчанию
jQuery.fx.speeds.slow = 600;       // медленная анимация
jQuery.fx.speeds.normal = 300;     // нормальная скорость
jQuery.fx.speeds.fast = 150;       // быстрая анимация
jQuery.fx.speeds.instant = 50;     // мгновенная анимация

// ========== Вспомогательная функция ==========
function updateEmptyListMessage() {
    const $items = $('#shoppingList li').not(':contains("Список пуст")');
    const $emptyMsg = $('#shoppingList li:contains("Список пуст")');
    
    if ($items.length === 0 && $emptyMsg.length === 0) {
        
        const $emptyMessage = $(
            '<li class="list-group-item text-muted text-center empty-list-msg">Список пуст</li>'
        ).css({opacity: 0});
        
        $('#shoppingList').append($emptyMessage);
        $emptyMessage.animate({opacity: 1}, 'fast');
        
    } else if ($items.length > 0 && $emptyMsg.length > 0) {
        // Используем .animate() для исчезновения
        $emptyMsg.animate({opacity: 0}, 'fast', function() {
            $(this).remove();
        });
    }
}

// ========== Добавление товара с анимацией ==========
$('#addItemBtn').on('click', function() {
    const $input = $('#newItemInput');
    const itemName = $input.val().trim();
    
    if (itemName) {
        // Удаляем сообщение "Список пуст" с анимацией
        $('#shoppingList li.empty-list-msg').animate(
            {opacity: 0, height: 0}, 
            'fast', 
            function() {
                $(this).remove();
            }
        );
        
        // Создаем элемент
        const $newItem = $(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${escapeHtml(itemName)}
                <button class="btn btn-sm btn-danger remove-item">
                    <i class="bi bi-trash"></i>
                </button>
            </li>
        `).css({
            opacity: 0,
            height: 0,
            marginTop: 0
        });
        
        // Добавляем с анимацией через .animate()
        $('#shoppingList').append($newItem);
        $newItem.animate(
            {
                opacity: 1,
                height: 'show',
                marginTop: '5px'
            },
            'normal'
        );
        
        $input.val('');
        
        // Анимация кнопки через .animate()
        $(this).animate({scale: 1.1}, 'instant').animate({scale: 1}, 'fast');
        
        // Обработчик удаления с .animate()
        $newItem.find('.remove-item').on('click', function() {
            $(this).closest('li').animate(
                {
                    opacity: 0,
                    height: 0,
                    marginTop: 0,
                    marginBottom: 0
                },
                'fast',
                function() {
                    $(this).remove();
                    updateEmptyListMessage();
                }
            );
        });
        
    } else {
        // Анимация тряски input через .animate()
        $input.animate({marginLeft: '-10px'}, 'instant')
              .animate({marginLeft: '10px'}, 'instant')
              .animate({marginLeft: '-10px'}, 'instant')
              .animate({marginLeft: '0px'}, 'fast');
        $input.focus();
    }
});

// Функция для безопасного экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== Очистка списка с анимацией ==========
$('#clearListBtn').on('click', function() {
    const $btn = $(this);
    const $realItems = $('#shoppingList li').not('.empty-list-msg');
    
    if ($realItems.length === 0) {
        $btn.animate({marginLeft: '-5px'}, 'instant')
            .animate({marginLeft: '5px'}, 'instant')
            .animate({marginLeft: '-5px'}, 'instant')
            .animate({marginLeft: '0px'}, 100);
        return;
    }
    
    // Анимация кнопки "подпрыгивание" через .animate()
    $btn.animate({marginTop: '-3px'}, 'fast')
        .animate({marginTop: '0px'}, 'fast')
        .animate({marginTop: '-3px'}, 100)
        .animate({marginTop: '0px'}, 100);
    
    $realItems.each(function(index) {
        $(this).delay(index * 50).animate(
            {
                opacity: 0,
                height: 0,
                marginBottom: 0
            },
            'fast',
            function() {
                $(this).remove();
                // После последнего элемента показываем сообщение
                if (index === $realItems.length - 1) {
                    updateEmptyListMessage();
                }
            }
        );
    });
});

// ========== Делегирование события удаления ==========
$(document).on('click', '.remove-item', function() {
    $(this).closest('li').animate(
        {
            opacity: 0,
            width: 'hide'
        },
        'fast',
        function() {
            $(this).remove();
            updateEmptyListMessage();
        }
    );
});

// Инициализация
updateEmptyListMessage();

// ========== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ==========
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('[data-view]');
    const appContent = document.querySelector('#appContent');
    
    if (viewButtons.length && appContent) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                viewButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Добавляем активный класс нажатой кнопке
                this.classList.add('active');
                
                // Изменяем содержимое приложения
                const view = this.getAttribute('data-view');
                let content = '';
                
                switch(view) {
                    case 'home':
                        content = `
                            <h3 class="text-success">Добро пожаловать в Зоомагазин "Друзья животных"!</h3>
                            <p>Это пример однооконного приложения. Вы можете переключаться между вкладками, и содержимое будет динамически обновляться.</p>
                            <div class="alert alert-info mt-3">
                                <i class="bi bi-info-circle-fill me-2"></i>
                                Нажмите на вкладки выше для переключения
                            </div>
                        `;
                        break;
                    case 'products':
                        content = `
                            <h3 class="text-success">Наши товары</h3>
                            <p>В нашем зоомазине представлен широкий ассортимент товаров для ваших питомцев:</p>
                            <ul class="list-group mt-3">
                                <li class="list-group-item">Сухой и влажный корм для кошек и собак</li>
                                <li class="list-group-item">Игрушки для всех видов животных</li>
                                <li class="list-group-item">Ошейники, поводки и аксессуары</li>
                                <li class="list-group-item">Лежанки, миски и другие принадлежности</li>
                            </ul>
                        `;
                        break;
                    case 'about':
                        content = `
                            <h3 class="text-success">О нас</h3>
                            <p>Мы продаем товары для домашних животных уже много лет. У нас есть все необходимое для ваших питомцев.</p>
                            <p><strong>Наши преимущества:</strong> низкие цены, большой выбор, хорошее качество.</p>
                            <blockquote class="blockquote mt-3">
                                <p>«Лучший друг человека заслуживает лучшего питания!»</p>
                                <footer class="blockquote-footer">Наш девиз</footer>
                            </blockquote>
                        `;
                        break;
                }
                
                // Обновляем содержимое
                appContent.innerHTML = content;
            });
        });
    }
});

// ========== АВТОМАТИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ ИЗОБРАЖЕНИЙ "НАШ МАГАЗИН" ==========
document.addEventListener('DOMContentLoaded', function() {
    // Массив с путями к изображениям
    const shopImages = [
        '/images/shop1.jpg',
        '/images/shop2.jpg',
        '/images/shop3.jpg'
    ];
    
    let currentImageIndex = 0;
    let slideshowInterval;
    
    // Находим контейнер для изображений магазина
    const shopImageContainer = document.querySelector('#shopCarousel, .shop-images-container, [data-shop-slideshow]');
    
    // Если контейнер не найден, попробуем найти по альтернативным селекторам
    const fallbackContainer = document.querySelector('.shop-photos, .store-images, .gallery-container');
    const targetContainer = shopImageContainer || fallbackContainer;
    
    if (targetContainer) {
        // Создаем элемент для отображения текущего изображения
        const imgElement = document.createElement('img');
        imgElement.className = 'shop-slideshow-img img-fluid rounded shadow';
        imgElement.alt = 'Наш магазин';
        imgElement.style.width = '100%';
        imgElement.style.height = 'auto';
        imgElement.style.transition = 'opacity 0.5s ease-in-out';
        
        // Очищаем контейнер и добавляем изображение
        targetContainer.innerHTML = '';
        targetContainer.appendChild(imgElement);
        
        // Функция смены изображения
        function changeImage() {
            // Эффект затухания
            imgElement.style.opacity = '0';
            
            setTimeout(() => {
                currentImageIndex = (currentImageIndex + 1) % shopImages.length;
                imgElement.src = shopImages[currentImageIndex];
                imgElement.style.opacity = '1';
            }, 500);
        }
        
        // Загружаем первое изображение
        imgElement.src = shopImages[0];
        imgElement.style.opacity = '1';
        
        // Запускаем автоматическое переключение каждые 5 секунд
        slideshowInterval = setInterval(changeImage, 5000);
        
        // Добавляем кнопки навигации (опционально)
        const navButtons = document.createElement('div');
        navButtons.className = 'slideshow-controls mt-3 text-center';
        navButtons.innerHTML = `
            <button class="btn btn-sm btn-outline-primary me-2" id="prevShopImg">
                <i class="bi bi-chevron-left"></i> Предыдущее
            </button>
            <button class="btn btn-sm btn-outline-primary" id="nextShopImg">
                Следующее <i class="bi bi-chevron-right"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary ms-2" id="toggleShopSlideshow">
                <i class="bi bi-pause-fill"></i> Пауза
            </button>
        `;
        targetContainer.parentNode.insertBefore(navButtons, targetContainer.nextSibling);
        
        let isPlaying = true;
        
        // Кнопка "Предыдущее"
        document.getElementById('prevShopImg')?.addEventListener('click', () => {
            if (slideshowInterval) clearInterval(slideshowInterval);
            
            imgElement.style.opacity = '0';
            setTimeout(() => {
                currentImageIndex = (currentImageIndex - 1 + shopImages.length) % shopImages.length;
                imgElement.src = shopImages[currentImageIndex];
                imgElement.style.opacity = '1';
            }, 300);
            
            if (isPlaying) {
                slideshowInterval = setInterval(changeImage, 5000);
            }
        });
        
        // Кнопка "Следующее"
        document.getElementById('nextShopImg')?.addEventListener('click', () => {
            if (slideshowInterval) clearInterval(slideshowInterval);
            
            imgElement.style.opacity = '0';
            setTimeout(() => {
                currentImageIndex = (currentImageIndex + 1) % shopImages.length;
                imgElement.src = shopImages[currentImageIndex];
                imgElement.style.opacity = '1';
            }, 300);
            
            if (isPlaying) {
                slideshowInterval = setInterval(changeImage, 5000);
            }
        });
        
        // Кнопка "Пауза/Воспроизведение"
        document.getElementById('toggleShopSlideshow')?.addEventListener('click', function() {
            if (isPlaying) {
                clearInterval(slideshowInterval);
                this.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
                isPlaying = false;
            } else {
                slideshowInterval = setInterval(changeImage, 5000);
                this.innerHTML = '<i class="bi bi-pause-fill"></i> Пауза';
                isPlaying = true;
            }
        });
        
        // Остановка слайдшоу при наведении (опционально)
        imgElement.addEventListener('mouseenter', () => {
            if (isPlaying) {
                clearInterval(slideshowInterval);
            }
        });
        
        imgElement.addEventListener('mouseleave', () => {
            if (isPlaying) {
                slideshowInterval = setInterval(changeImage, 5000);
            }
        });
        
    } else {
        console.warn('Контейнер для слайдшоу изображений магазина не найден. Убедитесь, что на странице есть элемент с id="shopCarousel" или классом "shop-images-container".');
    }
});

// Получаем элементы
const banner = document.getElementById('cookie-consent-banner');
const rejectBtn = document.getElementById('cookie-reject-btn');
const acceptBtn = document.getElementById('cookie-accept-btn');

// Функция для скрытия банера
function hideBanner() {
    if (banner) {
        banner.style.display = 'none';
        // Или для плавного исчезновения:
        // banner.style.opacity = '0';
        // setTimeout(() => banner.style.display = 'none', 300);
    }
}

// Добавляем обработчики событий
if (rejectBtn) {
    rejectBtn.addEventListener('click', hideBanner);
}

if (acceptBtn) {
    acceptBtn.addEventListener('click', hideBanner);
}