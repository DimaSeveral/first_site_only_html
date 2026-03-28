/**
 * Устанавливает cookie
 * @param {string} name - Имя cookie
 * @param {string} value - Значение
 * @param {number} days - Срок хранения в днях
 */
function setCookie(name, value, days = 365) {
    if (!name || typeof name !== 'string') return false;
    const safeValue = String(value).replace(/[;,\s]/g, '_'); // Преобразуем в строку под синтаксис куки
    const expires = new Date(); // Текущая дата и время
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Миллисекунды
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(safeValue)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    return true;
}

/**
 * Получает значение cookie
 * @param {string} name - Имя cookie
 * @returns {string|null}
 */
function getCookie(name) {
    if (!name || typeof name !== 'string') return null;
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)" // ищем куки + экранируем + извлекаем значение
    ));
    return matches ? decodeURIComponent(matches[1]) : null; // Если нашли совпадение, то декодируем : возвращаем null
}

/**
 * Удаляет cookie
 * @param {string} name - Имя cookie
 */
function delCookie(name) {
    if (!name || typeof name !== 'string') return false;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    return true;
}

// ========== СОГЛАСИЕ НА COOKIE ==========

function hasCookieConsent() {
    return getCookie('cookie_consent') === 'accepted';
}

function acceptCookies() {
    return setCookie('cookie_consent', 'accepted', 365);
}

function rejectCookies() {
    ['site_theme', 'cookie_consent'].forEach(name => delCookie(name));
}


setCookie('username','Dima', 365)
// delCookie('username')