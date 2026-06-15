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
    if (isSnapping) {
        e.preventDefault();
        return;
    }
    if (Math.abs(e.deltaY) < 40) return;
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
    // Проверяем, на каком слайде эта картинка
    const parentSlide = img.closest('.slide');
    const isSlide1 = parentSlide && parentSlide.getAttribute('data-slide') === '1';

    let alreadyClicked = false;  // флаг для слайда 1

    img.addEventListener('click', () => {
        // Если это слайд 1 и уже кликали — ничего не делаем
        if (isSlide1 && alreadyClicked) return;

        let state = Number(img.dataset.state || 0);
        const start = img.dataset.start || 'center';
        const end = img.dataset.end || 'center';

        if (state === 0) {
            img.style.objectPosition = end;
            img.dataset.state = 1;

            if (isSlide1) alreadyClicked = true;  // запоминаем для слайда 1
        }
        else {
            // Для слайда 1 — не даём вернуться назад
            if (!isSlide1) {
                img.style.objectPosition = start;
                img.dataset.state = 0;
            }
        }
    });
});

// ========== УЛУЧШЕННАЯ ЗУМ + ПАНОРАМА (слайд 0) + ЛЕШИЙ ==========
document.querySelectorAll('.zoom-scroll').forEach(img => {
    const slide = img.closest('.slide');
    if (slide.dataset.slide !== "0") return;

    const text0 = slide.querySelector('.text0');
    const text2 = slide.querySelector('.text2');
    const text3 = slide.querySelector('.text3');
    const leshy = slide.querySelector('.leshy');
    let leshyShown = false;

    img.addEventListener('click', () => {
        let state = Number(img.dataset.state || 0);

        if (state === 0) {                    // Клик 1: зум
            img.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            img.style.transformOrigin = img.dataset.origin || 'left bottom';
            img.style.transform = `scale(${img.dataset.zoom || 1.2})`;
            img.dataset.state = 2;

            if (text0) text0.style.opacity = '0';
            if (text2) text2.style.opacity = '1';



        } else if (state === 2) {             // Клик 3: панорама + текст 3
            img.dataset.state = 3;

            if (text2) text2.style.opacity = '0';

            // Панорама
            img.style.transition = 'object-position 1.1s cubic-bezier(0.25, 0.1, 0.25, 1)';
            img.style.objectPosition = img.dataset.shift || '0%';

            setTimeout(() => {
                if (text3) text3.style.opacity = '1';
            }, 300);
// === ЛЕШИЙ — сначала появляется, потом двигается ===
            if (leshy && !leshyShown) {
                leshyShown = true;

                // Шаг 1: появление (через 1150ms после клика)
                setTimeout(() => {
                    slide.classList.add('leshy-active');

                    // Шаг 2: через 400ms после появления — движение
                    setTimeout(() => {
                        slide.classList.add('leshy-moving');
                    }, 60);
                }, 1100);
            }
        }
    });
});

    const slide3 = document.querySelector('.slide[data-slide="2"]');
    const overlayImg = slide3.querySelector('.overlay-image');
    const defaultText = slide3.querySelector('.text[data-default]');
    const altText = slide3.querySelector('.text-alternate');

let slide3Clicked = false;  // флаг, что клик уже был

slide3.addEventListener('click', () => {
    if (slide3Clicked) return;  // если уже кликали — ничего не делаем

    slide3Clicked = true;
    slide3.classList.add('clicked');   // только add, не toggle
    overlayImg.classList.add('show');   // только add

    defaultText.style.opacity = '0';
    altText.style.opacity = '1';
});
// === АНИМАЦИЯ ОТКРЫТИЯ КНИГИ НА ПЕРВОМ СЛАЙДЕ ===
const startSlide = document.querySelector('.slide[data-slide="start"]');
const book = document.getElementById('opening-book');

let bookAnimationDone = false;

if (startSlide && book) {
    const openBook = () => {
        if (bookAnimationDone) return;
        bookAnimationDone = true;
        book.classList.add('open');
    };

    // Запускаем анимацию
    setTimeout(openBook, 600);   // чуть раньше

    // Если пользователь уже начал скроллить — открываем мгновенно
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !bookAnimationDone) {
                openBook(); // принудительно завершаем анимацию
            }
        });
    }, { threshold: 0.8 });

    observer.observe(startSlide);

    // Клик по книге
    book.addEventListener('click', () => {
        book.style.transitionDuration = '0.9s';
        openBook();
    });
}

// ========== СЛАЙД 3 (data-slide="3"): ТЕКСТ + РАЗМЫТИЕ + НАЛОЖЕНИЯ ==========
const slide4 = document.querySelector('.slide[data-slide="3"]');

if (slide4) {
    let clickCount = 0;
    const defaultText4 = slide4.querySelector('.text[data-default]');
    const altText4 = slide4.querySelector('.text-alternate');
    const thirdText = slide4.querySelector('.text-third');
    const overlayBlur = slide4.querySelector('.overlay-blur');      // slide4_2.png
    const overlayImage2 = slide4.querySelector('.overlay-image-2'); // slide4_3.png
    const overlayImage3 = slide4.querySelector('.overlay-image-3');

    // Начальное состояние
    defaultText4.style.opacity = '1';
    altText4.style.opacity = '0';
    if (thirdText) thirdText.style.opacity = '0';
    if (overlayImage2) overlayImage2.style.opacity = '0';
    if (overlayImage3) overlayImage3.style.opacity = '0';

    slide4.addEventListener('click', () => {
        clickCount++;

        if (clickCount === 1) {
            // Первый клик: меняем текст + размытие
            slide4.classList.add('clicked');
            defaultText4.style.opacity = '0';
            altText4.style.opacity = '1';
            if (overlayImage2) overlayImage2.style.opacity = '1';

        } else if (clickCount === 2) {

            defaultText4.style.opacity = '0';
            altText4.style.opacity = '0';

            if (thirdText) thirdText.style.opacity = '1';

            if (overlayBlur) overlayBlur.style.opacity = '0';
            if (overlayImage2) overlayImage2.style.opacity = '0';

            // Появляется slide4_4.png
            if (overlayImage3) overlayImage3.style.opacity = '1';
        }
    });
}


// ========== СЛАЙД 4 (data-slide="4"): ТЕКСТ + ПОЛЁТ БАБЫ-ЯГИ ==========
const slide5 = document.querySelector('.slide[data-slide="4"]');

if (slide5) {
    let hasFlown = false;
    const defaultText5 = slide5.querySelector('.text');
    const altText5 = slide5.querySelector('.text-alternate');
    const flyingStupa = slide5.querySelector('.flying-stupa');

    // Начальное состояние
    if (defaultText5) defaultText5.style.opacity = '1';
    if (altText5) altText5.style.opacity = '0';

    slide5.addEventListener('click', () => {
        if (!hasFlown) {
            // Меняем текст
            if (defaultText5) defaultText5.style.opacity = '0';
            if (altText5) altText5.style.opacity = '1';

            // Запускаем анимацию
            slide5.classList.add('flying');
            hasFlown = true;
        }
    });
}
// ========== ПОСЛЕДНИЙ СЛАЙД — КНИГА ОТКРЫВАЕТСЯ ПО КЛИКУ, ПОТОМ КНОПКА ==========
const lastSlide = document.querySelector('.slide[data-slide="11"]');
const closingBook = document.getElementById('closing-book');
const closingText = document.getElementById('closing-text');
const continueButton = document.getElementById('continue-button');

if (lastSlide && closingBook && closingText) {
    // Изначально книга ЗАКРЫТА (откинута)
    closingBook.classList.add('closed');
    closingBook.classList.remove('open');
    closingText.classList.remove('show');

    let isOpen = false;
    let buttonShown = false;

    lastSlide.addEventListener('click', () => {
        if (!isOpen) {
            // Открываем книгу
            closingBook.classList.remove('closed');
            closingBook.classList.add('open');
            isOpen = true;
        }

        // Через 1.5 секунды показываем кнопку
        setTimeout(() => {
            if (closingText && !buttonShown) {
                closingText.classList.add('show');
                buttonShown = true;
            }
        }, 1500);
    });

    // Обработчик клика по кнопке
    if (continueButton) {
        continueButton.addEventListener('click', (e) => {
            e.stopPropagation();  // чтобы клик не сработал на слайд
            // Здесь ссылка на продолжение
            // window.location.href = 'https://www.culture.ru/poems/5061/ruslan-i-lyudmila-poema';  // замените на нужную ссылку
            // Или можно открыть в новой вкладке:
            window.open('https://www.culture.ru/poems/5061/ruslan-i-lyudmila-poema', '_blank');
        });
    }
}



