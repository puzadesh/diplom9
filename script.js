

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
    window.addEventListener('touchmove', function(e) {
        if (isScrolling) {
            e.preventDefault();
        }
    }, { passive: false });


    document.querySelectorAll('.zoomable').forEach(img => {

        img.addEventListener('click', () => {

            let state = Number(img.dataset.state || 0);

            const zoom = img.dataset.zoom || 1.6;
            const origin = img.dataset.origin || 'center';
            const shift = img.dataset.shift || 'center';

            // 1 клик → zoom
            if (state === 0) {
                img.style.transformOrigin = origin;
                img.style.transform = `scale(${zoom})`;
                img.dataset.state = 1;
                return;
            }

            // 2 клик → смена кадра (ВОТ ОНО РЕШЕНИЕ)
            if (state === 1) {
                img.style.objectPosition = shift;
                img.dataset.state = 2;
                return;
            }

            // 3 клик → reset
            if (state === 2) {
                img.style.transform = '';
                img.style.objectPosition = '';
                img.dataset.state = 0;
            }

        });

    });


    console.log('Панорама готова, клик для движения вправо/влево');
