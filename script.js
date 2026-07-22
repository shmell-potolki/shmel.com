// ==========================================
// НАСТРОЙКИ СЕРВИСОВ
// ==========================================

// 1. Telegram
const TELEGRAM_BOT_TOKEN = '8715225901:AAE50S2kjECmAMamGRYv1V5tKnIlV8xDmF8';
const TELEGRAM_CHAT_ID = '1880444600';

// 2. ВКонтакте (Два получателя)
const VK_GROUP_TOKEN = 'vk1.a.QEFXsAHkjFn8SwQCic7rK0oioeL9zA_m-ouJ27I42SrKat5d5yb8a5gTY8FvEqMfA5dxO2IeYv3Rim_sI8oIq97Cx1-pAHMsHkROCaIGX3DtX16KP-myZcXpmQS-bbB09l1Wf5H8Mjg_dzgU6lHXdE2INAwYgiiJRTcQF6C3ZmMnyJ_wVWME_bQqxc5SK5FZkwIOTDkPzAenpS6GTzVO6A';

const VK_USER_ID_1 = '654560713';   // Первый ID
const VK_USER_ID_2 = '25801123';    // Второй ID

// ==========================================
// УПРАВЛЕНИЕ ОКНОМ БЛАГОДАРНОСТИ
// ==========================================

function showThankyouModal() {
    const modal = document.getElementById("thankyouModal");
    if (modal) modal.classList.add("active");
}

function closeThankyouModal() {
    const modal = document.getElementById("thankyouModal");
    if (modal) modal.classList.remove("active");
}

// ==========================================
// ОТПРАВКА ЗАЯВОК (TELEGRAM + VK ДЛЯ 2 ПОЛЬЗОВАТЕЛЕЙ)
// ==========================================

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[type="tel"]');

    const name = nameInput ? nameInput.value : 'Не указано';
    const phone = phoneInput ? phoneInput.value : 'Не указано';

    // 1. Отправка в Telegram
    const telegramMessage = `🐝 <b>Новая заявка с сайта «Шмель»!</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Телефон:</b> ${phone}`;
    
    const telegramPromise = fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'HTML'
        })
    });

    // 2. Отправка ВКонтакте двум адресатам
    const textMessage = `🐝 Новая заявка с сайта «Шмель»!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}`;
    
    const sendVkMessage = (userId) => {
        if (!userId) return Promise.resolve();
        const randomId = Math.floor(Math.random() * 1000000000);
        const vkUrl = `https://api.vk.com/method/messages.send?user_id=${userId}&message=${encodeURIComponent(textMessage)}&random_id=${randomId}&access_token=${VK_GROUP_TOKEN}&v=5.131`;
        return fetch(vkUrl, { mode: 'no-cors' });
    };

    const vkPromise1 = sendVkMessage(VK_USER_ID_1);
    const vkPromise2 = sendVkMessage(VK_USER_ID_2);

    // Выполнение всех отправок
    Promise.allSettled([telegramPromise, vkPromise1, vkPromise2])
        .then(() => {
            showThankyouModal();
            form.reset();
        })
        .catch((error) => {
            console.error('Ошибка отправки:', error);
            showThankyouModal();
            form.reset();
        });
}

// ==========================================
// ДОПОЛНИТЕЛЬНЫЕ СКРИПТЫ
// ==========================================

// Переключение закладок в каталоге
function showCatalog(type) {
    let materials = document.getElementById("materials-list");
    let colors = document.getElementById("colors-list");
    let btnMaterials = document.getElementById("btn-materials");
    let btnColors = document.getElementById("btn-colors");

    if (type === "materials") {
        if (materials) materials.style.display = "grid";
        if (colors) colors.style.display = "none";
        if (btnMaterials) btnMaterials.classList.add("active");
        if (btnColors) btnColors.classList.remove("active");
    }

    if (type === "colors") {
        if (materials) materials.style.display = "none";
        if (colors) colors.style.display = "grid";
        if (btnColors) btnColors.classList.add("active");
        if (btnMaterials) btnMaterials.classList.remove("active");
    }
}

// Маска для номера телефона (+7)
document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phoneInput");

    if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
            let input = e.target.value.replace(/\D/g, "");
            
            if (input.startsWith("7") || input.startsWith("8")) {
                input = input.substring(1);
            }
            
            let formatted = "+7 ";
            if (input.length > 0) formatted += "(" + input.substring(0, 3);
            if (input.length >= 3) formatted += ") " + input.substring(3, 6);
            if (input.length >= 6) formatted += "-" + input.substring(6, 8);
            if (input.length >= 8) formatted += "-" + input.substring(8, 10);
            
            e.target.value = formatted;
        });
    }
});
// ==========================================
// АНИМАЦИЯ ПРИ СКРОЛЛЕ (Intersection Observer)
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15, // Порог появления (15% элемента в кадре)
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });
});
// Закрытие меню соцсетей при клике вне его области
document.addEventListener('click', function(e) {
    const socialDetails = document.querySelector('.social-box details');
    if (socialDetails && socialDetails.hasAttribute('open')) {
        if (!socialDetails.contains(e.target)) {
            socialDetails.removeAttribute('open');
        }
    }
});
