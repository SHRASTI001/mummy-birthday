
let currentPage = 1;
const totalPages = 7;

// ===================================
// BIRTHDAY SOUNDS
// ===================================

// Realistic balloon pop MP3
const balloonPopAudio = new Audio("sounds/balloon-pop.mp3");
balloonPopAudio.preload = "auto";

// Soft clapping MP3
const softClapAudio = new Audio("sounds/soft-clap.mp3");
softClapAudio.preload = "auto";
softClapAudio.load();

// Audio Context
let audioContext;

function getAudioContext() {
    if (!audioContext) {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (AudioContextClass) {
            audioContext = new AudioContextClass();
        }
    }

    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}

// Cute birthday chime
function playBirthdaySound() {
    const audio = getAudioContext();
    if (!audio) return;

    const now = audio.currentTime;

    [659, 880, 1175].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.0001, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(
            0.12, now + index * 0.07 + 0.02
        );
        gain.gain.exponentialRampToValueAtTime(
            0.0001, now + index * 0.07 + 0.22
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(now + index * 0.07);
        oscillator.stop(now + index * 0.07 + 0.23);
    });
}

// Magical gift opening sound
function playGiftSound() {
    const audio = getAudioContext();
    if (!audio) return;

    const now = audio.currentTime;

    [523, 784, 1046, 1318].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.0001, now + index * 0.09);
        gain.gain.exponentialRampToValueAtTime(
            0.15, now + index * 0.09 + 0.03
        );
        gain.gain.exponentialRampToValueAtTime(
            0.0001, now + index * 0.09 + 0.35
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(now + index * 0.09);
        oscillator.stop(now + index * 0.09 + 0.36);
    });
}

// Realistic balloon pop sound
function playPopSound() {
    balloonPopAudio.pause();
    balloonPopAudio.currentTime = 0;

    balloonPopAudio.play().catch(error => {
        console.log("Balloon pop sound could not play:", error);
    });
}

// Soft clapping sound
function playApplause() {
    softClapAudio.pause();
    softClapAudio.currentTime = 0;

    const playPromise = softClapAudio.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Soft clapping sound could not play:", error);
        });
    }
}

// Sound for buttons and clickable elements
document.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    const gift = event.target.closest("#gift");

    if (button) {
        if (button.id === "blowBtn") {
            return;
        }

        if (button.classList.contains("surprise-balloon")) {
            playPopSound();
            return;
        }

        if (button.id === "popAnotherBtn") {
            playBirthdaySound();
            return;
        }

        playBirthdaySound();
    }

    if (gift) {
        playGiftSound();
    }
});

// ===================================
// PAGE NAVIGATION
// ===================================

function showPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    if (currentPage === 7 && pageNumber === 1) {
        resetAll();
    }

    currentPage = pageNumber;

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById("page" + pageNumber)
        .classList.add("active");

    document.getElementById("pageCount").textContent =
        String(pageNumber).padStart(2, "0") +
        " / " + String(totalPages).padStart(2, "0");

    document.getElementById("backBtn").disabled =
        pageNumber === 1;

    document.getElementById("nextBtn").disabled =
        pageNumber === totalPages;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function nextPage(page) {
    showPage(page);
}

function goBack() {
    showPage(currentPage - 1);
}

function goForward() {
    showPage(currentPage + 1);
}

// ===================================
// GIFT OPENING
// ===================================

let giftOpened = false;

function openGift() {
    if (giftOpened) return;

    giftOpened = true;

    document.getElementById("giftSurpriseGif").src =
        "images/gift-surprise.gif";

    document.getElementById("gift")
        .classList.add("open");

    document.getElementById("giftText").textContent =
        "Surprise! You are my biggest blessing 💗";

    document.getElementById("giftNext")
        .classList.remove("hidden");

    createConfetti();
}

// ===================================
// BIRTHDAY CAKE
// ===================================

let candlesBlown = false;

function blowCandles() {
    if (candlesBlown) return;

    candlesBlown = true;

    // 👏 Clapping sound
    playApplause();

    const flames = document.querySelectorAll(".flame");

    const blowBtn = document.getElementById("blowBtn");
    const celebrateBtn = document.getElementById("celebrateBtn");
    const wishText = document.getElementById("wishText");

    blowBtn.classList.add("hidden");

    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add("off");
        }, index * 350);
    });

    setTimeout(() => {
        wishText.textContent =
            "Yay! May all your wishes come true, Mummy! 💗";

        celebrateBtn.classList.remove("hidden");

        createConfetti();
    }, 2200);
}

// ===================================
// CONFETTI ANIMATION
// ===================================

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

let confettiPieces = [];
let animationRunning = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function createConfetti() {
    const colors = [
        "#E88EAD",
        "#F8B5CE",
        "#f5d58a",
        "#ffffff",
        "#AD5277"
    ];

    for (let i = 0; i < 130; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 8 - 4
        });
    }

    if (!animationRunning) {
        animationRunning = true;
        animateConfetti();
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(piece => {
        ctx.save();

        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation * Math.PI / 180);

        ctx.fillStyle = piece.color;

        ctx.fillRect(
            -piece.size / 2,
            -piece.size / 2,
            piece.size,
            piece.size * 0.65
        );

        ctx.restore();

        piece.y += piece.speed;
        piece.rotation += piece.rotationSpeed;
    });

    confettiPieces = confettiPieces.filter(
        piece => piece.y < canvas.height + 30
    );

    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        animationRunning = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ===================================
// BALLOON SPARKLES
// ===================================

function balloonSparkles() {
    const colors = [
        "#E88EAD",
        "#F8B5CE",
        "#FFD700",
        "#FFFFFF",
        "#AD5277"
    ];

    const particles = [];

    for (let i = 0; i < 55; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 220,
            y: canvas.height / 2 + (Math.random() - 0.5) * 180,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * 7,
            speedY: (Math.random() - 0.5) * 7,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1
        });
    }

    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            particle.life -= 0.035;
        });

        ctx.globalAlpha = 1;

        const remaining = particles.some(p => p.life > 0);

        if (remaining) {
            requestAnimationFrame(animateSparkles);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animateSparkles();
}

// ===================================
// FINAL CELEBRATION
// ===================================

function celebrate() {
    createConfetti();

    document.querySelector(".final-message").textContent =
        "Aapki smile hamesha aise hi bani rahe. " +
        "You deserve all the happiness in the world, Mummy! 💗";
}

// ===================================
// FLOATING HEARTS
// ===================================

function createHeart() {
    const heart = document.createElement("span");

    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "♡" : "✿";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = Math.random() * 18 + 12 + "px";
    heart.style.animationDuration = Math.random() * 5 + 5 + "s";

    document.getElementById("hearts").appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

setInterval(createHeart, 700);

// ===================================
// BALLOON POP SURPRISE
// ===================================

const surpriseData = [
    {
        gif: "images/gif1.gif",
        message: "Mummy, you are my first home and my forever comfort. 💗"
    },
    {
        gif: "images/gif2.gif",
        message: "Your smile makes every day more beautiful. 🌸"
    },
    {
        gif: "images/gif3.gif",
        message: "Thank you for filling my life with so much love. 💕"
    },
    {
        gif: "images/gif4.gif",
        message: "You are my biggest blessing, Mummy! ✨"
    },
    {
        gif: "images/gif5.gif",
        message: "Every beautiful memory of mine has a little piece of you. 🥹"
    },
    {
        gif: "images/gif6.gif",
        message: "Happy Birthday to my forever favourite person! 🎂💗"
    }
];

let currentSurprise = -1;
let selectedBalloon = -1;
let isAnimating = false;

// POP SELECTED BALLOON
function popSurprise(balloonIndex) {
    if (isAnimating || selectedBalloon !== -1) return;

    const balloons = document.querySelectorAll(".surprise-balloon");

    if (!balloons[balloonIndex] || balloons[balloonIndex].hidden) return;

    selectedBalloon = balloonIndex;
    currentSurprise = balloonIndex;

    revealBalloon(balloonIndex);
}

// SHOW SELECTED BALLOON CARD
function revealBalloon(cardIndex) {
    if (isAnimating) return;

    isAnimating = true;

    const balloonArea = document.getElementById("balloonArea");
    const card = document.getElementById("surpriseCard");

    const gif = document.getElementById("surpriseGif");
    const message = document.getElementById("surpriseMessage");

    const popButton = document.getElementById("popAnotherBtn");
    const nextButton = document.getElementById("balloonNext");

    balloonArea.classList.add("behind");

    balloonSparkles();

    setTimeout(() => {
        gif.src = surpriseData[cardIndex].gif;
        message.textContent = surpriseData[cardIndex].message;

        card.classList.remove("show");

        void card.offsetWidth;

        card.classList.add("show");

        playBirthdaySound();

        popButton.classList.remove("hidden");
        popButton.textContent = "POP ANOTHER ↗";

        nextButton.classList.add("hidden");

        isAnimating = false;
    }, 750);
}

// POP ANOTHER BALLOON
function nextSurprise() {
    if (isAnimating || selectedBalloon === -1) return;

    const balloons = document.querySelectorAll(".surprise-balloon");

    balloons[selectedBalloon].hidden = true;

    selectedBalloon = -1;
    currentSurprise = -1;

    const remaining = Array.from(balloons).filter(
        balloon => !balloon.hidden
    ).length;

    const card = document.getElementById("surpriseCard");
    const balloonArea = document.getElementById("balloonArea");

    const popButton = document.getElementById("popAnotherBtn");
    const nextButton = document.getElementById("balloonNext");

    card.classList.remove("show");
    balloonArea.classList.remove("behind");

    document.getElementById("surpriseGif").src = "";
    document.getElementById("surpriseMessage").textContent = "";

    playBirthdaySound();

    if (remaining === 0) {
        document.getElementById("balloonCounter").textContent =
            "All 6 surprises opened! 💗";

        popButton.classList.add("hidden");
        nextButton.classList.remove("hidden");
    } else {
        document.getElementById("balloonCounter").textContent =
            `${remaining} left to pop`;

        popButton.classList.add("hidden");
        nextButton.classList.add("hidden");
    }
}

// RESET BALLOON PAGE
function resetSurprise() {
    currentSurprise = -1;
    selectedBalloon = -1;
    isAnimating = false;

    document.querySelectorAll(".surprise-balloon").forEach(balloon => {
        balloon.classList.remove("popped");
        balloon.hidden = false;
        balloon.removeAttribute("style");
    });

    document.getElementById("balloonArea")
        .classList.remove("behind");

    const card = document.getElementById("surpriseCard");

    card.classList.remove("show");
    card.style.display = "";

    document.getElementById("surpriseGif").src = "";
    document.getElementById("surpriseMessage").textContent = "";

    document.getElementById("popAnotherBtn")
        .classList.remove("hidden");

    document.getElementById("popAnotherBtn").textContent =
        "POP ANOTHER ↗";

    document.getElementById("balloonNext")
        .classList.add("hidden");

    document.getElementById("balloonCounter").textContent =
        "6 left to pop";
}

// ===================================
// RESET COMPLETE WEBSITE
// ===================================

function resetAll() {
    // Gift reset
    giftOpened = false;

    document.getElementById("gift")
        .classList.remove("open");

    document.getElementById("giftNext")
        .classList.add("hidden");

    document.getElementById("giftText").textContent =
        "Surprise! You are my biggest blessing 💗";

    // Candle reset
    candlesBlown = false;

    document.querySelectorAll(".flame").forEach(flame => {
        flame.classList.remove("off");
    });

    document.getElementById("blowBtn")
        .classList.remove("hidden");

    document.getElementById("celebrateBtn")
        .classList.add("hidden");

    document.getElementById("wishText").textContent =
        "Yay! May all your wishes come true, Mummy! 💗";

    // Final message reset
    document.querySelector(".final-message").textContent =
        "Aapki smile hamesha aise hi bani rahe. " +
        "You deserve all the happiness in the world, Mummy! 💗";

    // Balloon reset
    resetSurprise();

    // Confetti reset
    confettiPieces = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===================================
// INITIAL PAGE
// ===================================

showPage(1);