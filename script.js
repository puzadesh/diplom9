// === УЛУЧШЕННЫЙ SCROLL-SNAP ДЛЯ КОЛЁСИКА И ТАЧПАДА ===
let scrollTimeout = null;
let isSnapping = false;

const slidesContainer = document.querySelector('.slides-container');
const slides = Array.from(document.querySelectorAll('.slide'));

function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;

    isSnapping = true;
    slides[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    // Снимаем флаг после завершения анимации
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isSnapping = false;
    }, 900); // чуть больше длительности smooth
}

slidesContainer.addEventListener('wheel', (e) => {
    // Если уже идёт принудительная анимация — игнорируем
    if (isSnapping) {
        e.preventDefault();
        return;
    }

    // Небольшие движения (типично для тачпада) — даём браузеру самому обработать
    if (Math.abs(e.deltaY) < 40) return;

    // Для более сильных движений (колёсико мыши) — помогаем
    e.preventDefault();

    const currentIndex = Math.round(slidesContainer.scrollTop / window.innerHeight);
    let nextIndex = currentIndex;

    if (e.deltaY > 0) {
        nextIndex = Math.min(currentIndex + 1, slides.length - 1);
    } else {
        nextIndex = Math.max(currentIndex - 1, 0);
    }

    if (nextIndex !== currentIndex) {
        goToSlide(nextIndex);
    }
}, { passive: false });

    document.querySelectorAll('.zoomable').forEach(img => {

        img.addEventListener('click', () => {

            let state = Number(img.dataset.state || 0);
            const zoom = img.dataset.zoom || 1.5;
            const origin = img.dataset.origin || 'center';

            if (state === 0) {
                img.style.transformOrigin = origin;
                img.style.transform = `scale(${zoom})`;
                img.dataset.state = 1;

            }
            else {
                img.style.transform = '';
                img.dataset.state = 0;
            }

        });

    });
    document.querySelectorAll('.scrollable').forEach(img => {

        img.addEventListener('click', () => {

            let state = Number(img.dataset.state || 0);
            const start = img.dataset.start || 'center';
            const end = img.dataset.end || 'center';

            if (state === 0) {
                img.style.objectPosition = end;
                img.dataset.state = 1;
            }
            else {
                img.style.objectPosition = start;
                img.dataset.state = 0;
            }

        });

    });

// ========== УЛУЧШЕННАЯ ЗУМ + ПАНОРАМА (слайд 0) ==========
document.querySelectorAll('.zoom-scroll').forEach(img => {
    const slide = img.closest('.slide');
    if (slide.dataset.slide !== "0") return;

    const text0 = slide.querySelector('.text0');
    const text1 = slide.querySelector('.text1');
    const text2 = slide.querySelector('.text2');
    const text3 = slide.querySelector('.text3');

    img.addEventListener('click', () => {
        let state = Number(img.dataset.state || 0);

        if (state === 0) {                    // Клик 1: зум
            img.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            img.style.transformOrigin = img.dataset.origin || 'left bottom';
            img.style.transform = `scale(${img.dataset.zoom || 1.2})`;
            img.dataset.state = 1;

            if (text0) text0.style.opacity = '0';
            if (text1) text1.style.opacity = '1';

        } else if (state === 1) {             // Клик 2: текст 2
            img.dataset.state = 2;
            if (text1) text1.style.opacity = '0';
            if (text2) text2.style.opacity = '1';

        } else if (state === 2) {             // Клик 3: панорама + текст 3
            img.dataset.state = 3;

            if (text2) text2.style.opacity = '0';

            // Панорама — делаем максимально плавно
            img.style.transition = 'object-position 1.1s cubic-bezier(0.25, 0.1, 0.25, 1)';
            img.style.objectPosition = img.dataset.shift || '25%';

            setTimeout(() => {
                if (text3) text3.style.opacity = '1';
            }, 300);
        }
    });
});
    const slide3 = document.querySelector('.slide[data-slide="2"]');
    const overlayImg = slide3.querySelector('.overlay-image');
    const defaultText = slide3.querySelector('.text[data-default]');
    const altText = slide3.querySelector('.text-alternate');

    slide3.addEventListener('click', () => {
        const isActive = !slide3.classList.contains('clicked');
        slide3.classList.toggle('clicked');
        overlayImg.classList.toggle('show', isActive);

        if (isActive) {
            defaultText.style.opacity = '0';
            altText.style.opacity = '1';
        } else {
            defaultText.style.opacity = '1';
            altText.style.opacity = '0';
        }
    });

    // === АНИМАЦИЯ ОТКРЫТИЯ КНИГИ НА ПЕРВОМ СЛАЙДЕ ===
    const startSlide = document.querySelector('.slide[data-slide="start"]');
    const book = document.getElementById('opening-book');

    if (startSlide && book) {
        // Запускаем анимацию через небольшую задержку после загрузки
        setTimeout(() => {
            book.classList.add('open');
        }, 800);

        // Опционально: если пользователь кликнет по книге — ускорить анимацию
        book.addEventListener('click', () => {
            book.style.transitionDuration = '1.1s';
            book.classList.add('open');
        });
    }

// ========== СЛАЙД 4 (data-slide="3"): ТЕКСТ + ОБМЕН РАЗМЫТИЯ ==========
const slide4 = document.querySelector('.slide[data-slide="3"]');

if (slide4) {
    let isClicked = false;
    const defaultText4 = slide4.querySelector('.text[data-default]');
    const altText4 = slide4.querySelector('.text-alternate');

    slide4.addEventListener('click', () => {
        if (!isClicked) {
            slide4.classList.add('clicked');
            // Меняем текст
            if (defaultText4) defaultText4.style.opacity = '0';
            if (altText4) altText4.style.opacity = '1';
            isClicked = true;
        } else {
            slide4.classList.remove('clicked');
            // Возвращаем текст
            if (defaultText4) defaultText4.style.opacity = '1';
            if (altText4) altText4.style.opacity = '0';
            isClicked = false;
        }
    });
}

// ========== ПОСЛЕДНИЙ СЛАЙД — КНИГА ==========
const lastSlide = document.querySelector('.slide[data-slide="11"]');
const finalImage = lastSlide ? lastSlide.querySelector('.final-image') : null;
const finalBook = lastSlide ? lastSlide.querySelector('#final-book') : null;

if (lastSlide && finalImage && finalBook) {
    let isClicked = false;

    lastSlide.addEventListener('click', (e) => {
        // Предотвращаем всплытие, если клик был по книге
        if (e.target.closest('.book-final')) return;

        isClicked = !isClicked;

        if (isClicked) {
            lastSlide.classList.add('clicked');
            finalBook.style.transitionDelay = '80ms';
        } else {
            lastSlide.classList.remove('clicked');
            finalBook.style.transitionDelay = '0ms';
        }
    });
}