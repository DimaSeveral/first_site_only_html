document.addEventListener('DOMContentLoaded', function () {
    console.log('Инициализация формы заказа...');
    
    const form = document.getElementById('order-form');
    
    // Проверяем, есть ли форма на странице
    if (!form) {
        console.log('Форма заказа не найдена на этой странице');
        return;
    }
    
    console.log('Форма найдена, инициализируем валидацию');

    const submitBtn = document.getElementById('order-submit');
    
    // Проверяем существование всех необходимых элементов
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const citySelect = document.getElementById('city');
    const streetInput = document.getElementById('street');
    const houseInput = document.getElementById('house');
    const apartmentInput = document.getElementById('apartment');
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const commentTextarea = document.getElementById('delivery-comment');
    const personalDataCheck = document.getElementById('personal-data');
    const newsCheck = document.getElementById('news-check');
    
    // Проверяем, что все элементы найдены
    console.log('Найденные элементы:', {
        nameInput: !!nameInput,
        emailInput: !!emailInput,
        phoneInput: !!phoneInput,
        citySelect: !!citySelect,
        streetInput: !!streetInput,
        houseInput: !!houseInput,
        apartmentInput: !!apartmentInput,
        deliveryRadios: deliveryRadios.length,
        commentTextarea: !!commentTextarea,
        personalDataCheck: !!personalDataCheck,
        newsCheck: !!newsCheck
    });

    // Функция для форматирования номера
    function formatPhoneNumber(input) {
        // Удаляем всё кроме цифр
        let value = input.value.replace(/\D/g, '');
        
        // Ограничиваем длину до 11 цифр (для российских номеров)
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        // Форматируем для отображения (опционально)
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                let formatted = value[0] === '8' ? '8' : '+7';
                
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                }
                if (value.length >= 5) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length >= 10) {
                    formatted += '-' + value.substring(9, 11);
                }
                input.value = formatted;
            } else {
                // Если первая цифра не 7 или 8, просто показываем цифры
                input.value = value;
            }
        } else {
            input.value = '';
        }
        
        return value; // возвращаем только цифры для валидации
    }

    // Обработчик для поля телефона
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const digitsOnly = formatPhoneNumber(this);
            
            // Валидация: проверяем что есть 11 цифр
            if (digitsOnly.length === 11) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                if (digitsOnly.length > 0) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            }
            
            updateButtonState();
        });
        
        // Запрещаем ввод букв
        phoneInput.addEventListener('keydown', function(e) {
            // Разрешаем: цифры, Backspace, Delete, Tab, Escape, Enter, стрелки
            if (e.key.length === 1 && !/[0-9]/.test(e.key) && 
                e.key !== 'Backspace' && e.key !== 'Delete' && 
                e.key !== 'Tab' && e.key !== 'Escape' && 
                e.key !== 'Enter' && !e.key.startsWith('Arrow')) {
                e.preventDefault();
            }
        });
        
        // Запрещаем вставку не-цифр
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const digitsOnly = pastedText.replace(/\D/g, '').slice(0, 11);
            
            // Вставляем отформатированные цифры
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const currentValue = this.value.replace(/\D/g, '');
            const newValue = currentValue.substring(0, start) + digitsOnly + currentValue.substring(end);
            
            this.value = newValue;
            formatPhoneNumber(this);
            updateButtonState();
        });
    }

    // Простая функция валидации
    function validateForm() {
        let isValid = true;
        
        // Проверка имени
        if (nameInput) {
            if (nameInput.value.trim() === '') {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('is-invalid');
                nameInput.classList.add('is-valid');
            }
        }
        
        // Проверка email
        if (emailInput) {
            const email = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '' || !emailPattern.test(email)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }
        }
        
        // Проверка телефона (должно быть 11 цифр)
        if (phoneInput) {
            const phoneDigits = phoneInput.value.replace(/\D/g, '');
            if (phoneDigits.length !== 11) {
                phoneInput.classList.add('is-invalid');
                isValid = false;
            } else {
                phoneInput.classList.remove('is-invalid');
                phoneInput.classList.add('is-valid');
            }
        }
        
        // Проверка города
        if (citySelect) {
            if (citySelect.value === '') {
                citySelect.classList.add('is-invalid');
                isValid = false;
            } else {
                citySelect.classList.remove('is-invalid');
                citySelect.classList.add('is-valid');
            }
        }
        
        // Проверка улицы
        if (streetInput) {
            if (streetInput.value.trim() === '') {
                streetInput.classList.add('is-invalid');
                isValid = false;
            } else {
                streetInput.classList.remove('is-invalid');
                streetInput.classList.add('is-valid');
            }
        }
        
        // Проверка дома
        if (houseInput) {
            if (houseInput.value.trim() === '') {
                houseInput.classList.add('is-invalid');
                isValid = false;
            } else {
                houseInput.classList.remove('is-invalid');
                houseInput.classList.add('is-valid');
            }
        }
        
        // Проверка способа доставки
        const deliverySelected = document.querySelector('input[name="delivery"]:checked');
        if (!deliverySelected) {
            deliveryRadios.forEach(radio => {
                radio.classList.add('is-invalid');
            });
            isValid = false;
        } else {
            deliveryRadios.forEach(radio => {
                radio.classList.remove('is-invalid');
            });
        }
        
        // Проверка согласия
        if (personalDataCheck && !personalDataCheck.checked) {
            personalDataCheck.classList.add('is-invalid');
            isValid = false;
        } else if (personalDataCheck) {
            personalDataCheck.classList.remove('is-invalid');
            personalDataCheck.classList.add('is-valid');
        }
        
        return isValid;
    }

    // Изменять стиль submit-кнопки в зависимости от заполненности формы
    function updateButtonState() {
        if (!submitBtn) return;
        
        const isValid = validateForm();
        
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-success');
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Оформить заказ';
            console.log('Форма валидна, кнопка активна');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove('btn-success');
            submitBtn.classList.add('btn-secondary');
            submitBtn.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Заполните обязательные поля';
            console.log('Форма невалидна, кнопка неактивна');
        }
    }

    
    // Добавить зависимости между элементами (дом и кв)
    if (houseInput && apartmentInput) {
        houseInput.addEventListener('input', function() {
            if (houseInput.value.trim().length > 0) {
                apartmentInput.disabled = false;
                apartmentInput.classList.remove('bg-light');
            } else {
                apartmentInput.disabled = true;
                apartmentInput.value = '';
                apartmentInput.classList.add('bg-light');
            }
            updateButtonState();
        });
    }

    // Зависимость: Новости активны только если заполнен Email
    if (emailInput && newsCheck) {
        emailInput.addEventListener('input', function() {
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
            if (emailValid) {
                newsCheck.disabled = false;
                newsCheck.classList.remove('bg-light');
            } else {
                newsCheck.disabled = true;
                newsCheck.checked = false;
                newsCheck.classList.add('bg-light');
            }
            updateButtonState();
        });
    }

    // Зависимость: Комментарий активен только при доставке Курьером
    if (deliveryRadios.length > 0 && commentTextarea) {
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const courierRadio = document.getElementById('delivery-courier');
                if (courierRadio && courierRadio.checked) {
                    commentTextarea.disabled = false;
                    commentTextarea.classList.remove('bg-light');
                } else {
                    commentTextarea.disabled = true;
                    commentTextarea.value = '';
                    commentTextarea.classList.add('bg-light');
                }
                updateButtonState();
            });
        });
    }

    // Добавляем обработчики для всех полей
    const allInputs = [
        nameInput, emailInput, citySelect, 
        streetInput, houseInput, apartmentInput, personalDataCheck
    ];
    
    allInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', updateButtonState);
            input.addEventListener('change', updateButtonState);
            input.addEventListener('blur', updateButtonState);
        }
    });

    // Добавляем обработчики для radio
    deliveryRadios.forEach(radio => {
        if (radio) {
            radio.addEventListener('change', updateButtonState);
        }
    });

    // --- Обработка отправки формы ---
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Попытка отправки формы');
        
        if (!validateForm()) {
            console.log('Форма не прошла валидацию');
            
            // Подсвечиваем все незаполненные обязательные поля
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value && !field.disabled && field.type !== 'checkbox') {
                    field.classList.add('is-invalid');
                }
                if (field.type === 'checkbox' && !field.checked) {
                    field.classList.add('is-invalid');
                }
            });
            
            alert('Пожалуйста, заполните все обязательные поля правильно');
            return;
        }

        // По нажатию submit-кнопки собирать данные с формы в один объект и выводить в консоль.
        const formData = new FormData(form);
        const dataObject = {};
        
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });
        
        dataObject['timestamp'] = new Date().toISOString();

        console.log(' Заказ успешно оформлен!');
        console.log(' Данные заказа:', dataObject);
        
        // Показываем номер телефона только цифрами для проверки
        const phoneDigits = phoneInput.value.replace(/\D/g, '');
        console.log(' Телефон (только цифры):', phoneDigits);
        
        // Простое уведомление
        alert(`Спасибо за заказ, ${dataObject.name || 'покупатель'}! Данные отправлены в консоль.`);
    });

    // Первоначальная проверка
    setTimeout(updateButtonState, 100);
    console.log('Валидация формы инициализирована');
});

 function setTheme(theme) {
            const body = document.body;
            const lightBtn = document.getElementById('lightThemeBtn');
            const darkBtn = document.getElementById('darkThemeBtn');
            
            if (theme === 'dark') {
                body.classList.add('dark-theme');
                if (lightBtn && darkBtn) {
                    lightBtn.classList.remove('btn-light');
                    lightBtn.classList.add('btn-outline-light');
                    darkBtn.classList.remove('btn-dark');
                    darkBtn.classList.add('btn-success');
                }
            } else {
                body.classList.remove('dark-theme');
                if (lightBtn && darkBtn) {
                    lightBtn.classList.remove('btn-outline-light');
                    lightBtn.classList.add('btn-light');
                    darkBtn.classList.remove('btn-success');
                    darkBtn.classList.add('btn-dark');
                }
            }
            
            localStorage.setItem('site-theme', theme);
        }
        
        // Загрузка сохраненной темы
        window.onload = function() {
            const saved = localStorage.getItem('site-theme');
            if (saved === 'dark') {
                setTheme('dark');
            }
        };


document.addEventListener('DOMContentLoaded', function () {
    // Ссылки (все <a href="...">)
    const allLinks = document.querySelectorAll('a[href]');
    console.log(`🔗 Всего ссылок: ${allLinks.length}`);
    allLinks.forEach((link, i) => {
        console.log(`   ${i + 1}. URL: "${link.href}", текст: "${link.textContent.trim()}"`);
    });

    // Якоря (внутренние ссылки: <a href="#...">)
    const anchors = document.querySelectorAll('a[href^="#"]');
    console.log(`⚓ Якорные ссылки: ${anchors.length}`);
    anchors.forEach((anchor, i) => {
        console.log(`   ${i + 1}. Якорь: "${anchor.getAttribute('href')}" → цель: ${anchor.getAttribute('href')}`);
    });

    // Изображения
    const images = document.querySelectorAll('img');
    console.log(`🖼️ Изображений: ${images.length}`);
    images.forEach((img, i) => {
        console.log(`   ${i + 1}. src: "${img.src}", alt: "${img.alt}"`);
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // --- Событие клика по кнопкам оформления ---
    const orderButtons = document.querySelectorAll('button.btn-success, a[href="order.html"]');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log(' Клик по кнопке/ссылке:', e.target.textContent?.trim() || 'без текста');
        });
    });

    // --- Событие фокуса на полях формы ---
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            console.log(' Поле получило фокус:', e.target.placeholder || e.target.name || 'без имени');
        });
    });

    // --- Событие наведения на карточки ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log(' Наведение на карточку');
        });
        card.addEventListener('mouseleave', () => {
            console.log(' Уход с карточки');
        });
    });

    // --- Событие отправки формы (если есть) ---
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            console.log(' Форма отправлена (отменено для демо)');
            e.preventDefault(); // отменяем реальную отправку
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Массив изображений для анимации (используем те же, что у тебя)
    const imageSources = [
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1596273315327-5f059f4fea97?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    ];

    // Найдём целевую картинку (на index.html — это главная картинка магазина)
    const mainImage = document.getElementById('main-animated-image') || 
                      document.querySelector('.card-img-top'); // fallback

    if (mainImage) {
        let index = 0;
        setInterval(() => {
            index = (index + 1) % imageSources.length;
            mainImage.src = imageSources[index];
            console.log('🔄 Смена изображения:', imageSources[index]);
        }, 3000); // каждые 3 секунды
    }
});