document.addEventListener("DOMContentLoaded", () => {

    const bgAudio = document.getElementById("bgAudio");
    const audioToggle = document.getElementById("audioToggle");
    const audioSlider = document.getElementById("audioSlider");

    const updateAudioToggle = () => {
        if (!audioToggle || !bgAudio) return;

        const isMuted = bgAudio.muted || bgAudio.volume <= 0;
        audioToggle.textContent = isMuted ? "🔇" : "🔊";
        audioToggle.classList.toggle("is-muted", isMuted);
        audioToggle.setAttribute("aria-label", isMuted ? "Turn sound on" : "Turn sound off");

        if (audioSlider) {
            const volumeValue = Number.isFinite(bgAudio.volume) ? bgAudio.volume : 0;
            audioSlider.value = String(volumeValue);
        }
    };

    if (bgAudio) {
        bgAudio.volume = 0.35;

        const unlockAudio = () => {
            bgAudio.muted = false;
            bgAudio.volume = Number(audioSlider?.value || 0.35);
            updateAudioToggle();
            bgAudio.play().catch(() => {});
        };

        document.addEventListener("pointerdown", unlockAudio, { once: true });
        document.addEventListener("keydown", unlockAudio, { once: true });

        if (audioToggle) {
            audioToggle.addEventListener("click", async () => {
                if (bgAudio.muted || bgAudio.volume <= 0) {
                    bgAudio.muted = false;
                    bgAudio.volume = Number(audioSlider?.value || 0.35);
                    if (bgAudio.volume <= 0) {
                        bgAudio.volume = 0.35;
                    }
                } else {
                    bgAudio.muted = true;
                }

                try {
                    if (!bgAudio.paused) {
                        await bgAudio.play();
                    }
                } catch (error) {
                    // ignore autoplay restrictions until user interaction
                }

                updateAudioToggle();
            });
        }

        if (audioSlider) {
            audioSlider.addEventListener("input", (event) => {
                const value = Number(event.target.value);
                bgAudio.volume = value;
                bgAudio.muted = value <= 0;
                updateAudioToggle();
            });
        }

        bgAudio.addEventListener("volumechange", updateAudioToggle);
        updateAudioToggle();
    }

    const thirdPageSlider = document.querySelector(".music-slider");
    const thirdPageCurrent = document.querySelector(".music-current");
    const thirdPageDuration = document.querySelector(".music-duration");
    const thirdPagePlayButton = document.querySelector('[data-action="play"]');

    if (bgAudio && thirdPageSlider && thirdPageCurrent && thirdPageDuration) {
        const formatTime = (seconds) => {
            if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${String(secs).padStart(2, "0")}`;
        };

        const updatePlayerUI = () => {
            const duration = Number.isFinite(bgAudio.duration) ? bgAudio.duration : 0;
            const current = Number.isFinite(bgAudio.currentTime) ? bgAudio.currentTime : 0;
            const progress = duration > 0 ? (current / duration) * 100 : 0;

            thirdPageSlider.value = String(progress);
            thirdPageSlider.style.setProperty("--progress", `${progress}%`);
            thirdPageCurrent.textContent = formatTime(current);
            thirdPageDuration.textContent = formatTime(duration);
        };

        bgAudio.addEventListener("loadedmetadata", updatePlayerUI);
        bgAudio.addEventListener("timeupdate", updatePlayerUI);
        bgAudio.addEventListener("play", () => {
            if (thirdPagePlayButton) thirdPagePlayButton.textContent = "❚❚";
        });
        bgAudio.addEventListener("pause", () => {
            if (thirdPagePlayButton) thirdPagePlayButton.textContent = "▶";
        });

        thirdPageSlider.addEventListener("input", (event) => {
            if (!Number.isFinite(bgAudio.duration) || bgAudio.duration <= 0) return;
            const value = Number(event.target.value);
            bgAudio.currentTime = (value / 100) * bgAudio.duration;
            updatePlayerUI();
        });

        const togglePlayback = async () => {
            try {
                if (bgAudio.paused) {
                    await bgAudio.play();
                } else {
                    bgAudio.pause();
                }
            } catch (error) {
                // ignore autoplay restrictions until first user interaction
            }
        };

        const prevButton = document.querySelector('[data-action="prev"]');
        const nextButton = document.querySelector('[data-action="next"]');

        if (thirdPagePlayButton) {
            thirdPagePlayButton.addEventListener("click", togglePlayback);
        }

        if (prevButton) {
            prevButton.addEventListener("click", () => {
                bgAudio.currentTime = Math.max(0, bgAudio.currentTime - 10);
                updatePlayerUI();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                bgAudio.currentTime = Math.min(bgAudio.duration || 0, bgAudio.currentTime + 10);
                updatePlayerUI();
            });
        }

        updatePlayerUI();
    }

    const introScreen = document.getElementById("introScreen");

    if (introScreen) {
        const introTitle = introScreen.querySelector(".intro-title");
        const titleText = "welcome /ᐠ - ˕ -マᶻ 𝗓 𐰁";

        if (introTitle) {
            introTitle.innerHTML = [...titleText].map((char, index) => {
                const safeChar = char === " " ? "&nbsp;" : char;
                return `<span class="intro-letter" style="--delay:${index * 0.08}s">${safeChar}</span>`;
            }).join("");
        }

        const hideIntro = () => {
            introScreen.classList.add("hidden");
        };

        introScreen.addEventListener("click", hideIntro);
    }

    /* =====================================================
       СЧЁТЧИК ПРОСМОТРОВ
    ===================================================== */

    const viewsElement =
        document.getElementById("views");


    if (viewsElement) {

        let views =
            parseInt(
                localStorage.getItem("pageViews")
            ) || 0;


        views++;


        localStorage.setItem(
            "pageViews",
            views
        );


        let displayedViews = 0;


        const duration = 800;

        const startTime =
            performance.now();


        function animateCounter(currentTime) {

            const progress =
                Math.min(
                    (currentTime - startTime)
                    / duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            displayedViews =
                Math.floor(
                    views * eased
                );


            viewsElement.textContent =
                displayedViews.toLocaleString(
                    "en-US"
                );


            if (progress < 1) {

                requestAnimationFrame(
                    animateCounter
                );

            }

        }


        requestAnimationFrame(
            animateCounter
        );

    }



    /* =====================================================
       АНИМАЦИЯ ПЕЧАТАНИЯ
    ===================================================== */

    const nameTypingElement =
        document.getElementById(
            "nameTyping"
        );


    if (nameTypingElement) {

        const finalName =
            "Usagi Tsukino";

        const randomChars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789♡•♪✦";

        nameTypingElement.textContent = "";

        let nameIndex = 0;

        const renderName = (content) => {
            nameTypingElement.innerHTML = Array.from(content).map((char) => {
                const safeChar = char === " " ? "&nbsp;" : char;
                return `<span class="name-letter">${safeChar}</span>`;
            }).join("");
        };

        function buildNamePreview() {

            let preview =
                finalName.slice(
                    0,
                    nameIndex
                );


            for (
                let i = nameIndex;
                i < finalName.length;
                i++
            ) {

                const randomChar =
                    randomChars[
                        Math.floor(
                            Math.random() *
                            randomChars.length
                        )
                    ];

                preview +=
                    randomChar;

            }

            renderName(preview);

        }

        function typeName() {

            if (nameIndex <= finalName.length) {

                buildNamePreview();

                if (nameIndex < finalName.length) {
                    nameIndex++;
                }

                const delay =
                    80 + Math.random() * 50;

                setTimeout(
                    typeName,
                    delay
                );

            } else {

                renderName(finalName);

            }

        }

        typeName();

    }


    const typingElement =
        document.getElementById(
            "typingText"
        );


    if (typingElement) {

        const text =
            "♡ Love letters In a cup of tea ♡";


        let index = 0;

        let isDeleting = false;


        const typingSpeed = 100;

        const deletingSpeed = 80;

        const pauseDuration = 1500;


        function typeAnimation() {


            if (!isDeleting) {


                if (index < text.length) {

                    typingElement.textContent +=
                        text[index];

                    index++;


                    setTimeout(
                        typeAnimation,
                        typingSpeed
                    );

                } else {


                    setTimeout(() => {

                        isDeleting = true;

                        typeAnimation();

                    }, pauseDuration);

                }


            } else {


                if (index > 0) {

                    typingElement.textContent =
                        text.substring(
                            0,
                            index - 1
                        );

                    index--;


                    setTimeout(
                        typeAnimation,
                        deletingSpeed
                    );

                } else {

                    isDeleting = false;

                    typeAnimation();

                }

            }

        }


        typeAnimation();

    }



    /* =====================================================
       НАКЛОН КАРТОЧКИ ЗА МЫШЬЮ
    ===================================================== */

    const card =
        document.querySelector(
            ".profile-card"
        );


    if (
        window.innerWidth > 700 &&
        card
    ) {


        document.addEventListener(
            "mousemove",
            (event) => {


                const x =
                    event.clientX /
                    window.innerWidth -
                    0.5;


                const y =
                    event.clientY /
                    window.innerHeight -
                    0.5;


                card.style.transform =
                    `perspective(1200px)
                     rotateY(${x * 1.2}deg)
                     rotateX(${y * -1.2}deg)`;


            }
        );


        document.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "perspective(1200px) rotateY(0deg) rotateX(0deg)";

            }
        );

    }



    /* =====================================================
       ПАРТИКЛЫ ЗА МЫШКОЙ
    ===================================================== */

    const particlesContainer =
        document.createElement("div");


    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999;
    `;


    document.body.appendChild(
        particlesContainer
    );


    const particleStyle =
        document.createElement("style");


    particleStyle.textContent = `

        @keyframes particleFall {

            to {

                transform:
                    translateY(120px)
                    translateX(var(--tx))
                    scale(0);

                opacity: 0;

            }

        }


        .particle {

            position: fixed;

            font-size: 14px;

            animation:
                particleFall
                2.5s
                cubic-bezier(
                    0.25,
                    0.46,
                    0.45,
                    0.94
                )
                forwards;

            pointer-events: none;

            --tx: 0px;

        }

    `;


    document.head.appendChild(
        particleStyle
    );


    document.addEventListener(
        "mousemove",
        (event) => {


            if (Math.random() > 0.5) {


                const particle =
                    document.createElement("div");


                particle.className =
                    "particle";


                particle.textContent =
                    "❄";


                particle.style.left =
                    event.clientX + "px";


                particle.style.top =
                    event.clientY + "px";


                particle.style.color =
                    "#ffffff";


                particle.style.opacity =
                    "0.8";


                const tx =
                    (Math.random() - 0.5)
                    * 80;


                particle.style.setProperty(
                    "--tx",
                    tx + "px"
                );


                particlesContainer.appendChild(
                    particle
                );


                setTimeout(() => {

                    particle.remove();

                }, 2500);

            }

        }
    );



    /* =====================================================
       ПРОСТАЯ СИСТЕМА БЛОКОВ НА ОДНОЙ СТРАНИЦЕ
    ===================================================== */

    const sectionButtons = {
        up: document.querySelector(".section-up"),
        down: document.querySelector(".section-down")
    };

    const sectionNumberEl = document.querySelector(".section-number");
    const sectionTotalEl = document.querySelector(".section-total");
    const sections = Array.from(document.querySelectorAll(".panel"));
    const playerEl = document.querySelector(".third-page-player.top-player");

    let currentSection = 0;
    let isTransitioning = false;

    function updatePlayerVisibility() {
        if (!playerEl) return;

        const shouldShow = currentSection !== 1;
        playerEl.classList.toggle("is-hidden", !shouldShow);
        playerEl.setAttribute("aria-hidden", String(!shouldShow));
    }

    function updateSectionNav() {
        if (!sectionNumberEl || !sectionTotalEl) return;

        sectionNumberEl.textContent = String(currentSection + 1);
        sectionTotalEl.textContent = String(sections.length);

        if (sectionButtons.up) {
            sectionButtons.up.disabled = currentSection === 0;
        }

        if (sectionButtons.down) {
            sectionButtons.down.disabled = currentSection === sections.length - 1;
        }
    }

    function updateActiveSection(index) {
        currentSection = index;

        sections.forEach((section, sectionIndex) => {
            section.classList.toggle("active", sectionIndex === index);
        });

        updatePlayerVisibility();
        updateSectionNav();
    }

    function goToSection(index) {
        if (isTransitioning || index < 0 || index >= sections.length) return;

        isTransitioning = true;

        const targetSection = sections[index];
        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        updateActiveSection(index);

        setTimeout(() => {
            isTransitioning = false;
        }, 650);
    }

    if (sectionButtons.up) {
        sectionButtons.up.addEventListener("click", () => {
            goToSection(currentSection - 1);
        });
    }

    if (sectionButtons.down) {
        sectionButtons.down.addEventListener("click", () => {
            goToSection(currentSection + 1);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
            const visibleSection = visibleEntries[0].target;
            const nextIndex = sections.indexOf(visibleSection);

            if (nextIndex !== -1) {
                updateActiveSection(nextIndex);
            }
        }
    }, {
        threshold: [0.45, 0.7, 0.9]
    });

    sections.forEach(section => observer.observe(section));
    updateActiveSection(0);

    document.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) < 12) return;

        event.preventDefault();

        if (event.deltaY > 0) {
            goToSection(currentSection + 1);
        } else {
            goToSection(currentSection - 1);
        }
    }, { passive: false });

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "PageDown") {
            event.preventDefault();
            goToSection(currentSection + 1);
        }

        if (event.key === "ArrowUp" || event.key === "PageUp") {
            event.preventDefault();
            goToSection(currentSection - 1);
        }
    });

    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", (event) => {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", (event) => {
        touchEndY = event.changedTouches[0].clientY;
        const difference = touchStartY - touchEndY;

        if (Math.abs(difference) < 50) return;

        if (difference > 0) {
            goToSection(currentSection + 1);
        } else {
            goToSection(currentSection - 1);
        }
    }, { passive: true });


    /* =====================================================
       ГАЛЕРЕЯ - МОДАЛЬНОЕ ОКНО
    ===================================================== */

    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalClose = document.querySelector(".modal-close");
    const galleryFrames = document.querySelectorAll(".gallery-frame");

    if (modal && modalImage && galleryFrames.length) {
        galleryFrames.forEach(frame => {
            frame.addEventListener("click", () => {
                const img = frame.querySelector("img");
                if (!img) return;

                modalImage.src = img.src;
                modal.classList.add("active");
            });
        });
    }

    if (modalClose && modal) {
        modalClose.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("active")) {
                modal.classList.remove("active");
            }
        });
    }

    const frogWalk = document.querySelector('.frog-walk');
    const frog = document.querySelector('.frog');

    if (frogWalk && frog) {
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        let frogX = 26;
        let frogY = window.innerHeight - 44;
        let direction = 1;
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let frogVelocityY = 0;

        const groundY = () => window.innerHeight - 44;

        const updateFrog = () => {
            const boundsX = Math.max(window.innerWidth - 72, 0);
            const boundsY = Math.max(window.innerHeight - 40, 0);

            frogX = clamp(frogX, 0, boundsX);
            frogY = clamp(frogY, 0, boundsY);

            frogWalk.style.left = `${frogX}px`;
            frogWalk.style.top = `${frogY}px`;
        };

        const animateFrog = () => {
            if (!isDragging) {
                const speed = 1.1;
                frogX += direction * speed;

                if (frogX <= 0) {
                    frogX = 0;
                    direction = 1;
                }

                if (frogX >= Math.max(window.innerWidth - 72, 0)) {
                    frogX = Math.max(window.innerWidth - 72, 0);
                    direction = -1;
                }

                frogVelocityY += 0.24;
                frogY += frogVelocityY;

                if (frogY >= groundY()) {
                    frogY = groundY();
                    frogVelocityY *= -0.08;
                }
            }

            updateFrog();
            requestAnimationFrame(animateFrog);
        };

        frog.addEventListener('pointerdown', (event) => {
            isDragging = true;
            frog.setPointerCapture(event.pointerId);
            dragOffsetX = event.clientX - frogX;
            dragOffsetY = event.clientY - frogY;
            frogVelocityY = 0;
            frog.style.cursor = 'grabbing';
        });

        frog.addEventListener('pointermove', (event) => {
            if (!isDragging) return;

            frogX = clamp(event.clientX - dragOffsetX, 0, Math.max(window.innerWidth - 72, 0));
            frogY = clamp(event.clientY - dragOffsetY, 0, Math.max(window.innerHeight - 40, 0));
            updateFrog();
        });

        const releaseFrog = () => {
            if (!isDragging) return;
            isDragging = false;
            frog.style.cursor = 'grab';
            frogVelocityY = 0.6;
        };

        frog.addEventListener('pointerup', releaseFrog);
        frog.addEventListener('pointerleave', releaseFrog);
        frog.addEventListener('pointercancel', releaseFrog);
        window.addEventListener('resize', updateFrog);

        updateFrog();
        requestAnimationFrame(animateFrog);
    }
});