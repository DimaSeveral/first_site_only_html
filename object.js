// ========== РАБОТА С COOKIE ==========
function setCookie(name, value, days = 365) {
    if (!name || typeof name !== 'string') return false;
    const safeValue = String(value).replace(/[;,\s]/g, '_');
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(safeValue)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    return true;
}

function getCookie(name) {
    if (!name || typeof name !== 'string') return null;
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
}

function delCookie(name) {
    if (!name || typeof name !== 'string') return false;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    return true;
}

function hasCookieConsent() {
    return getCookie('cookie_consent') === 'accepted';
}

function acceptCookies() {
    return setCookie('cookie_consent', 'accepted', 365);
}

function rejectCookies() {
    ['site_theme', 'cookie_consent'].forEach(name => delCookie(name));
}

// ========== УПРАВЛЕНИЕ ТЕМОЙ ==========
function setTheme(theme) {
    const body = document.body;
    const lightBtn = document.getElementById('lightThemeBtn');
    const darkBtn = document.getElementById('darkThemeBtn');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.setAttribute('data-theme', 'dark');
        if (lightBtn) {
            lightBtn.classList.remove('btn-light');
            lightBtn.classList.add('btn-outline-light');
        }
        if (darkBtn) {
            darkBtn.classList.remove('btn-dark');
            darkBtn.classList.add('btn-success');
        }
    } else {
        body.classList.remove('dark-theme');
        body.setAttribute('data-theme', 'light');
        if (lightBtn) {
            lightBtn.classList.remove('btn-outline-light');
            lightBtn.classList.add('btn-light');
        }
        if (darkBtn) {
            darkBtn.classList.remove('btn-success');
            darkBtn.classList.add('btn-dark');
        }
    }
    
    // Сохраняем тему только если есть согласие
    if (hasCookieConsent()) {
        setCookie('site_theme', theme, 365);
    }
}

function applySavedTheme() {
    const savedTheme = getCookie('site_theme');
    if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

// ========== СОГЛАСИЕ НА COOKIE ==========
function initCookieConsent() {
    const banner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const rejectBtn = document.getElementById('cookie-reject-btn');
    
    if (!banner) return;
    
    // Если согласие уже дано — скрываем баннер
    if (hasCookieConsent()) {
        banner.classList.remove('show');
        banner.style.display = 'none';
        document.body.classList.add('cookie-consent-given');
        document.body.classList.remove('cookie-pending');
        setTimeout(applySavedTheme, 100);
        return;
    }
    
    // Показываем баннер
    banner.classList.add('show');
    document.body.classList.add('cookie-pending');
    console.log('⏳ Ожидание согласия на cookie...');
    
    // Обработчик "Принять"
    if (acceptBtn) {
        acceptBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (acceptCookies()) {
                banner.classList.remove('show');
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 300);
                
                document.body.classList.remove('cookie-pending');
                document.body.classList.add('cookie-consent-given');
                
                setTimeout(() => {
                    applySavedTheme();
                }, 100);
                
                console.log(' Пользователь принял cookie');
            }
        }, { passive: false });
    }
    
    // Обработчик "Отклонить"
    if (rejectBtn) {
        rejectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            rejectCookies();
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
            
            document.body.classList.remove('cookie-pending');
            document.body.classList.add('cookie-consent-given');
            
            setTheme('light');
            console.log(' Пользователь отклонил cookie');
        }, { passive: false });
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', function () {
    // Сначала инициализируем согласие на cookie
    initCookieConsent();
    
    console.log('Инициализация формы заказа...');
    const form = document.getElementById('order-form');

    if (!form) {
        console.log('Форма заказа не найдена на этой странице');
        return;
    } 

    console.log('Форма найдена, инициализируем валидацию');

    const submitBtn = document.getElementById('order-submit');
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

    // Форматирование телефона
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                let formatted = value[0] === '8' ? '8' : '+7';
                if (value.length > 1) formatted += ' (' + value.substring(1, 4);
                if (value.length >= 5) formatted += ') ' + value.substring(4, 7);
                if (value.length >= 8) formatted += '-' + value.substring(7, 9);
                if (value.length >= 10) formatted += '-' + value.substring(9, 11);
                input.value = formatted;
            } else {
                input.value = value;
            }
        } else {
            input.value = '';
        }
        return value;
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const digitsOnly = formatPhoneNumber(this);
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
        
        phoneInput.addEventListener('keydown', function(e) {
            if (e.key.length === 1 && !/[0-9]/.test(e.key) && 
                e.key !== 'Backspace' && e.key !== 'Delete' && 
                e.key !== 'Tab' && e.key !== 'Escape' && 
                e.key !== 'Enter' && !e.key.startsWith('Arrow')) {
                e.preventDefault();
            }
        });
    }

    // Валидация
    function validateForm() {
        let isValid = true;
        
        if (nameInput && nameInput.value.trim() === '') {
            nameInput.classList.add('is-invalid');
            isValid = false;
        } else if (nameInput) {
            nameInput.classList.remove('is-invalid');
        }
        
        if (emailInput) {
            const email = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '' || !emailPattern.test(email)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }
        }
        
        if (phoneInput) {
            const phoneDigits = phoneInput.value.replace(/\D/g, '');
            if (phoneDigits.length !== 11) {
                phoneInput.classList.add('is-invalid');
                isValid = false;
            } else {
                phoneInput.classList.remove('is-invalid');
            }
        }
        
        if (citySelect && citySelect.value === '') {
            citySelect.classList.add('is-invalid');
            isValid = false;
        } else if (citySelect) {
            citySelect.classList.remove('is-invalid');
        }
        
        if (streetInput && streetInput.value.trim() === '') {
            streetInput.classList.add('is-invalid');
            isValid = false;
        } else if (streetInput) {
            streetInput.classList.remove('is-invalid');
        }
        
        if (houseInput && houseInput.value.trim() === '') {
            houseInput.classList.add('is-invalid');
            isValid = false;
        } else if (houseInput) {
            houseInput.classList.remove('is-invalid');
        }
        
        const deliverySelected = document.querySelector('input[name="delivery"]:checked');
        if (!deliverySelected) isValid = false;
        
        if (personalDataCheck && !personalDataCheck.checked) {
            isValid = false;
        }
        
        return isValid;
    }

    function updateButtonState() {
        if (!submitBtn) return;
        const isValid = validateForm();
        
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-success');
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Оформить заказ';
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove('btn-success');
            submitBtn.classList.add('btn-secondary');
            submitBtn.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Заполните обязательные поля';
        }
    }

    // Зависимости
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

    [nameInput, emailInput, citySelect, streetInput, houseInput, apartmentInput, personalDataCheck]
        .filter(Boolean).forEach(input => {
            ['input', 'change', 'blur'].forEach(ev => input.addEventListener(ev, updateButtonState));
        });
    
    deliveryRadios.forEach(radio => radio.addEventListener('change', updateButtonState));

    // Отправка формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        if (!validateForm()) {
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value && !field.disabled && field.type !== 'checkbox') {
                    field.classList.add('is-invalid');
                }
                if (field.type === 'checkbox' && !field.checked) {
                    field.classList.add('is-invalid');
                }
            });
            alert('Заполните обязательные поля');
            return;
        }

        const formData = new FormData(form);
        const dataObject = {};
        formData.forEach((value, key) => dataObject[key] = value);
        dataObject.timestamp = new Date().toISOString();

        console.log('✅ Заказ:', dataObject);
        alert(`Спасибо, ${dataObject.name || 'покупатель'}!`);
        form.reset();
        updateButtonState();
    });

    setTimeout(updateButtonState, 100);
});

// ========== АВТОСМЕНА ИЗОБРАЖЕНИЙ ==========
document.addEventListener('DOMContentLoaded', function () {
    const imageSources = [
        'https://ir.ozone.ru/s3/multimedia-1-s/c1000/7646540176.jpg',
        'https://avatars.mds.yandex.net/get-mpic/12140066/2a0000019016a1b2472010cf80c164ca0b9e/orig',
        'https://avatars.mds.yandex.net/get-mpic/16869486/2a0000019b9dd4534a576bee365e4664d3e2/orig'
    ];
    
    const mainImage = document.getElementById('main-animated-image') || 
                      document.querySelector('#products .card-img-top');
    
    if (mainImage) {
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % imageSources.length;
            mainImage.style.opacity = 0;
            setTimeout(() => {
                mainImage.src = imageSources[idx];
                mainImage.style.opacity = 1;
            }, 300);
        }, 3000);
    }
});

// ========== МОДАЛЬНОЕ ОКНО ==========
document.addEventListener('DOMContentLoaded', function() {
    const imagePreviews = document.querySelectorAll('.img-preview');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (imageModal && modalImage) {
        const bsModal = new bootstrap.Modal(imageModal);
        
        imagePreviews.forEach(preview => {
            preview.addEventListener('click', function() {
                const fullImage = this.getAttribute('data-full');
                if (fullImage) {
                    modalImage.src = fullImage;
                    modalImage.alt = this.alt || '';
                    bsModal.show();
                }
            });
        });
        
        imageModal.addEventListener('hidden.bs.modal', function() {
            modalImage.src = '';
        });
    }
});