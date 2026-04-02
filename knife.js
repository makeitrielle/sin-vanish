const body = document.body;
const modeLabel = document.getElementById('mode-label');
const povDisplay = document.getElementById('pov-display');
const songTitle = document.getElementById('song-title');
const lineupContainer = document.getElementById('member-lineup');
const themeBg = document.querySelector('.theme-background');

let modeIndex = 0;
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%@$#*"; // Defined for the glitch effect

const modes = [
    { name: 'FORBIDDEN', theme: 'forbidden-theme', pov: 'THE BEGINNING OF ESCAPE', songImg: 'no.png',trackId: '6u7J7OH56kiN2A7Pfv5D0i', members: [{ name: 'HEESEUNG', img: 'hee_for.jpg' }, { name: 'JAY', img: 'jay_for.jpg' }, { name: 'JAKE', img: 'jake_for.jpg' }, { name: 'SUNGHOON', img: 'hoon_for.jpg' }, { name: 'SUNOO', img: 'sunoo_for.jpg' }, { name: 'JUNGWON', img: 'uwon_for.jpg' }, { name: 'NI-KI', img: 'riki_for.jpg' }] },
    { name: 'AFTERLIGHT', theme: 'afterlight-theme', pov: 'ROMANCE IN ESCAPE', songImg:'bgdc2.png', trackId: '6u7J7OH56kiN2A7Pfv5D0i', members:[{ name: 'HEESEUNG', img: 'hee_bgdc.jpg' }, { name: 'JAY', img: 'jay_bgdc.jpg' }, { name: 'JAKE', img: 'jake_bgdc.jpg' }, { name: 'SUNGHOON', img: 'hoon_bgdc.jpg' }, { name: 'SUNOO', img: 'sunoo_bgdc.jpg' }, { name: 'JUNGWON', img: 'uwon_bgdc.jpg' }, { name: 'NI-KI', img: 'riki_bgdc.jpg' }] },
    { name: 'FUGITIVES', theme: 'fugitives-theme', pov: 'REBELLION IN ESCAPE', songImg: 'scene.png', trackId: '5EK13IYnr1NKdWDZhLDlBl', members: [{ name: 'HEESEUNG', img: 'hee_stealer.jpg' }, { name: 'JAY', img: 'jay_stealer.jpg' }, { name: 'JAKE', img: 'jake_stealer.jpg' }, { name: 'SUNGHOON', img: 'hoon_stealer.jpg' }, { name: 'SUNOO', img: 'sunoo_stealer.jpg' }, { name: 'JUNGWON', img: 'uwon_stealer.jpg' }, { name: 'NI-KI', img: 'riki_stealer.jpg' }] },
    { name: 'STORM', theme: 'storm-theme', pov: 'DANGER OF ESCAPE', songImg:'a.png', trackId: '0TKCUjfV3YGuY99MxCKM5w', members: [{ name: 'HEESEUNG', img: 'hee_storm.jpg' }, { name: 'JAY', img: 'jay_storm.jpg' }, { name: 'JAKE', img: 'jake_storm.jpg' }, { name: 'SUNGHOON', img: 'hoon_storm.jpg' }, { name: 'SUNOO', img: 'sunoo_storm.jpg' }, { name: 'JUNGWON', img: 'uwon_storm.jpg' }, { name: 'NI-KI', img: 'riki_storm.jpg' }] }
];


function triggerScan() {
    lineupContainer.classList.remove('is-scanning');
    void lineupContainer.offsetWidth; 
    lineupContainer.classList.add('is-scanning');
    
    const memberNames = document.querySelectorAll('.card-name-mini');
    memberNames.forEach((el, index) => {
        const originalName = modes[modeIndex].members[index].name;
        let iterations = 0;
        const interval = setInterval(() => {
            el.innerText = originalName.split("")
                .map((letter, i) => {
                    if(i < iterations) return originalName[i];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("");
            if(iterations >= originalName.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    });
    setTimeout(() => lineupContainer.classList.remove('is-scanning'), 1000);
}
function updateLineup(idx) {
    const m = modes[idx];
    lineupContainer.innerHTML = ''; 
    m.members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card-mini';
        card.innerHTML = `<div class="card-name-mini">${member.name}</div>`;
        card.addEventListener('click', () => {
            themeBg.style.backgroundImage = `url('${member.img}')`;
            themeBg.style.opacity = "0.5";
            body.style.filter = "brightness(1.5)";
            setTimeout(() => body.style.filter = "none", 100);
            document.querySelectorAll('.member-card-mini').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
        lineupContainer.appendChild(card);
    });
}

// Initialize

updateLineup(0);


function cycleMode() {
    modeIndex = (modeIndex + 1) % modes.length;
    const m = modes[modeIndex];
    
    // 1. Update Visuals
    themeBg.style.backgroundImage = ''; 
    body.className = m.theme;
    modeLabel.innerText = `CASE: ${m.name}`;
    povDisplay.innerText = `POV: ${m.pov}`;
    songTitle.innerHTML = `<img src="${m.songImg}" class="title-img">`;

    updateLineup(modeIndex);
    triggerScan();

    
}


let isPlaying = false;
const spotifyLink = document.getElementById('spotify-link');


function togglePlay() {
    if (!spotifyLink) return;
    const currentTrack = modes[modeIndex].trackId;
    
    if (!isPlaying) {
        // Use the official embed format to force autoplay
        spotifyLink.src = `https://open.spotify.com/embed/track/${currentTrack}?utm_source=generator&autoplay=1`;
        isPlaying = true;
        body.classList.add('audio-active'); // Useful for CSS animations
    } else {
        // Reload without autoplay to stop the sound
        spotifyLink.src = `https://open.spotify.com/embed/track/${currentTrack}?utm_source=generator`;
        isPlaying = false;
        body.classList.remove('audio-active');
    }
}

spotifyLink.addEventListener('click', (e) => {
    e.preventDefault(); // Stops the link from opening Spotify in a new tab
    togglePlay();       // Triggers your background music
    
    // Optional: Visual feedback when clicking the title
    songTitle.style.transform = "scale(0.95)";
    setTimeout(() => songTitle.style.transform = "scale(1)", 100);
});

// Modify your existing Keydown Logic
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    // SPACEBAR: TOGGLE AUDIO
    if (key === ' ' || e.code === 'Space') {
        e.preventDefault(); // Prevents the page from scrolling down
        togglePlay();
    }

    // Q KEY: SWITCH CASE
    if (key === 'q') {
        cycleMode();
    }


    // W KEY: SLASH FOCUS EFFECT
    if (key === 'w') {
        body.style.filter = "brightness(3) saturate(2)";
        const img = songTitle.querySelector('img');
        if (img) img.classList.add('slash-effect');
        setTimeout(() => img.classList.remove('slash-effect'), 200);
        setTimeout(() => body.style.filter = "none", 100);

        const toHide = [
            lineupContainer, modeLabel, povDisplay, 
            document.getElementById('subject-label'),
            document.getElementById('status-display'),
            document.getElementById('mode-trigger'),
            document.querySelector('.shortcut-hints'),
            document.querySelector('.data-stats')
        ];
        toHide.forEach(el => { if (el) { el.style.opacity = "0"; el.style.pointerEvents = "none"; } });
    }
});

// Keyup Logic
document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w') {
        body.style.filter = "none";
        const img = songTitle.querySelector('img');
        if (img) img.classList.remove('slash-effect');

        const toShow = [
            lineupContainer, modeLabel, povDisplay, 
            document.getElementById('subject-label'), 
            document.getElementById('status-display'), 
            document.getElementById('mode-trigger'), 
            document.querySelector('.shortcut-hints'),
            document.querySelector('.data-stats')
        ];
        toShow.forEach(el => { if (el) { el.style.opacity = "1"; el.style.pointerEvents = "auto"; } });
    }
});

// Initial load
updateLineup(0);