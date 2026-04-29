

    // 2. ОБРАБОТКА ВЕРТИКАЛЬНОЙ НАВИГАЦИИ (скролл по слайдам с плавным переходом, как в оригинале)
    const slides = document.querySelectorAll('.slide');
    let isScrolling = false;
    let scrollTimeout = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.45 }); // чуть меньше 0.5 для более раннего переключения

    slides.forEach(slide => {
        observer.observe(slide);
    });

    // Скролл с привязкой к слайдам (как в исходном коде, но улучшено для телефонов)
    function handleWheel(e) {
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        // Определяем текущий слайд (на основе видимости верхней части)
        let currentSlideIndex = -1;
        for (let i = 0; i < slides.length; i++) {
            const rect = slides[i].getBoundingClientRect();
            // Если слайд находится в верхней половине экрана или его верхняя часть видна
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSlideIndex = i;
                break;
            }
        }
        if (currentSlideIndex === -1) return;

        const delta = e.deltaY || (e.detail ? e.detail : 0);
        let targetIndex = currentSlideIndex;
        if (delta > 0 && currentSlideIndex < slides.length - 1) {
            targetIndex = currentSlideIndex + 1;
        } else if (delta < 0 && currentSlideIndex > 0) {
            targetIndex = currentSlideIndex - 1;
        } else {
            return;
        }

        // Предотвращаем резкий скролл при срабатывании
        e.preventDefault();
        isScrolling = true;

        slides[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 700);
    }

    // Привязываем событие колесика мыши и тач-панели
    window.addEventListener('wheel', handleWheel, { passive: false });
    // Для тач-устройств: используем touchmove для блокировки во время анимации?
    // Но пользователь может скроллить пальцем – обычно браузер сам делает плавно.
    // Добавим легкую защиту от перескока во время isScrolling
    // window.addEventListener('touchmove', function(e) {
    //     if (isScrolling) {
    //         e.preventDefault();
    //     }
    // }, { passive: false });

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

    document.querySelectorAll('.zoom-scroll').forEach(img => {
        const slide = img.closest('.slide');
        if (slide.dataset.slide !== "0") return;   // только для первого слайда

        const text0 = slide.querySelector('.text0');
        const text1 = slide.querySelector('.text1');
        const text2 = slide.querySelector('.text2');
        const text3 = slide.querySelector('.text3');

        img.addEventListener('click', () => {
            let state = Number(img.dataset.state || 0);

            if (state === 0) {                    // Клик 1: зум + текст 1
                img.style.transformOrigin = img.dataset.origin || 'left bottom';
                img.style.transform = `scale(${img.dataset.zoom || 1.2})`;
                img.dataset.state = 1;

                text0.style.opacity = '0';
                text1.style.opacity = '1';
            }
            else if (state === 1) {               // Клик 2: только смена текста на 2
                img.dataset.state = 2;

                text1.style.opacity = '0';
                text2.style.opacity = '1';
            }
            else if (state === 2) {               // Клик 3: исчезает текст 2 + запускается горизонтальная панорама
                img.dataset.state = 3;

                text2.style.opacity = '0';

                // Плавный горизонтальный скролл (панорама)
                img.style.transition = 'object-position 1.1s ease-in-out';
                img.style.objectPosition = img.dataset.shift || '25%';   // или 'right', '30%' и т.д.

                // === Главное изменение ===
                // Показываем текст "Там чудеса..." сразу после начала панорамы
                setTimeout(() => {
                    if (text3) text3.style.opacity = '1';
                }, 400);   // небольшая задержка, чтобы текст появился во время движения изображения
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



