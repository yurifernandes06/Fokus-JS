const html = document.querySelector("html");
const focusBt = document.querySelector(".app__card-button--focus");
const shortBt = document.querySelector(".app__card-button--short");
const longBt = document.querySelector(".app__card-button--long");
const banner = document.querySelector(".app__image");
const title = document.querySelector(".app__title");
const startPauseBt = document.querySelector("#start-pause");
const musicFocusInput = document.querySelector("#toggleMusic");
const startOrPauseBt = document.querySelector("#start-pause");
const timeOnScreen = document.querySelector("#timer");
const music = new Audio("/sons/luna-rise-part-one.mp3");
const homeAudio = new Audio("/sons/play.wav");
const pauseAudio = new Audio("/sons/pause.mp3");
const endAudio = new Audio("/sons/beep.mp3");

music.loop = true;

let timeElapsedPerSecond = 15;
let rangeId = null;

if (musicFocusInput) {
    musicFocusInput.addEventListener("change", () => {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
    })
}

if (focusBt) {
    focusBt.addEventListener("click", () => {
        changeContext("focus");
        focusBt.classList.add("active");
        shortBt.classList.remove("active");
        longBt.classList.remove("active");
        timeElapsedPerSecond = 15;
        showTime();
    })
}

if (shortBt) {
    shortBt.addEventListener("click", () => {
        changeContext("short-rest");
        shortBt.classList.add("active");
        focusBt.classList.remove("active");
        longBt.classList.remove("active");
        timeElapsedPerSecond = 300;
        showTime();
    })
}

if(longBt) {
longBt.addEventListener("click", () => {
    changeContext("long-rest");
    longBt.classList.add("active");
    shortBt.classList.remove("active");
    focusBt.classList.remove("active");
    timeElapsedPerSecond = 900;
    showTime();
})
}

function changeContext(context) {
    html.setAttribute("date-context", context);
    banner.setAttribute("src", `/imagens/${context}.png`);
    switch (context) {
        case "focus":
            title.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "short-rest":
            title.innerHTML = `
            Que tal dar uma respirada?,<br> 
            <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case "long-rest":
            title.innerHTML = `
            Hora de voltar à superfície.<br> 
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (timeElapsedPerSecond <= 0) {
        endAudio.play();
        alert("Tempo finalizado!");
        const activeFocus = html.getAttribute("date-context") == "focus";
        if (activeFocus) {
            const event = new CustomEvent("focusFinished");
            document.dispatchEvent(event);
        }
        reset();
        return;
    }
    timeElapsedPerSecond -= 1;
    showTime();

}

startPauseBt.addEventListener("click", StartorPause);

function StartorPause() {
    if (rangeId) {
        pauseAudio.play();
        reset();
        return;
    }
    homeAudio.play();
    rangeId = setInterval(contagemRegressiva, 1000);
    const buttonIcon = document.querySelector('.app__card-primary-butto-icon');
    const buttonText = document.querySelector('#start-pause span');
    buttonIcon.src = "/imagens/pause.png";
    buttonText.textContent = "Pausar";
}

function reset() {
    clearInterval(rangeId);
    const buttonIcon = document.querySelector('.app__card-primary-butto-icon');
    const buttonText = document.querySelector('#start-pause span');
    buttonIcon.src = "/imagens/play_arrow.png";
    buttonText.textContent = "Começar";
    rangeId = null;
}

function showTime() {
    const time = new Date(timeElapsedPerSecond * 1000);;
    const minutes  = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const timeFormatted = `${minutes }:${seconds}`;
    timeOnScreen.innerHTML = `${timeFormatted}`;
}

showTime();