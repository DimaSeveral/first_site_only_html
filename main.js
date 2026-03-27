// ========== МОДАЛЬНОЕ ОКНО ДЛЯ ИЗОБРАЖЕНИЙ ==========
document.addEventListener('DOMContentLoaded', function() {
    const imagePreviews = document.querySelectorAll('.img-preview');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (imageModal) {
        // Инициализируем модальное окно Bootstrap
        const bsModal = new bootstrap.Modal(imageModal, {
            backdrop: true,
            keyboard: true,
            focus: true
        });
        
        imagePreviews.forEach(preview => {
            preview.addEventListener('click', function() {
                const fullImage = this.getAttribute('data-full');
                modalImage.src = fullImage;
                modalImage.alt = this.alt;
                
                // Показываем модальное окно
                bsModal.show();
            });
        });
        
        // Очищаем src при закрытии
        imageModal.addEventListener('hidden.bs.modal', function() {
            modalImage.src = '';
            // Снимаем фокус с модального окна
            document.activeElement.blur();
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
    //объект, определяющий свойства для анимации;
    //продолжительность анимации в миллисекундах;
    //функция обратного вызова, которая будет вызываться после окончания анимации.
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
                    ${itemName}
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

    // ========== Очистка списка с анимацией ==========
    // this - кнопки #clearListBtn $(this) = jQuery-объект для этой кнопки
    // $btn = переменная с этим jQuery-объектом
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


document.addEventListener('DOMContentLoaded', function() {
    const imagePreviews = document.querySelectorAll('.img-preview');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    imagePreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            const fullImage = this.getAttribute('data-full');
            modalImage.src = fullImage;
            modalImage.alt = this.alt;
            
            const modal = new bootstrap.Modal(imageModal);
            modal.show();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('[data-view]');
    const appContent = document.querySelector('#appContent');
    
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
});