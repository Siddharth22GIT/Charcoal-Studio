// ========================================================
// CHARCOAL STUDIO - MAIN SCRIPT
// Features: Zen Dots Canvas, 3D Vinyl Crate, 3-Button Mobile Footer, Waveform
// ========================================================

const USERS_KEY = "gotoSongUsers";
const CURRENT_USER_KEY = "gotoSongCurrentUser";
const SONG_DB_NAME = "gotoSongDatabase";
const SONG_STORE_NAME = "customSongs";

// Application State
let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
let isGuestMode = false;
let songs = [];
let currentSongIndex = -1;
let isPlaying = false;
let isShuffle = false;
let repeatMode = "none"; // 'none' | 'all' | 'one'
let currentMainView = "tracklist"; // 'tracklist' | 'crate'

// Audio Instance
const audioPlayer = new Audio();
const objectUrlCache = new Map();

// Preset Cover Sleeves
const PRESET_SLEEVES = [
    "assets/themes/cover_charcoal.png",
    "assets/themes/sleeve_1.png",
    "assets/themes/sleeve_2.png",
    "assets/themes/sleeve_4.png",
    "assets/themes/sleeve_5.png",
    "assets/themes/sleeve_6.png"
];

// ========================================================
// DOM ELEMENTS
// ========================================================

// Views
const landingScreen = document.getElementById("landingScreen");
const landingDotsCanvas = document.getElementById("landingDotsCanvas");
const appContainer = document.getElementById("appContainer");

// Landing Controls
const landingLoginBtn = document.getElementById("landingLoginBtn");
const landingSignupBtn = document.getElementById("landingSignupBtn");
const heroSignupActionBtn = document.getElementById("heroSignupActionBtn");
const heroGuestActionBtn = document.getElementById("heroGuestActionBtn");

// Main App Header & Profile
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const topCrateBtn = document.getElementById("topCrateBtn");
const topAddTrackBtn = document.getElementById("topAddTrackBtn");
const userProfilePill = document.getElementById("userProfilePill");

// Desktop Sidebar
const sidebarNavHome = document.getElementById("sidebarNavHome");
const sidebarNavSearch = document.getElementById("sidebarNavSearch");
const sidebarNavCrate = document.getElementById("sidebarNavCrate");
const sidebarAlbumLink = document.getElementById("sidebarAlbumLink");
const sidebarSongCount = document.getElementById("sidebarSongCount");
const sidebarAddSongBtn = document.getElementById("sidebarAddSongBtn");

// Hero Banner
const heroCoverImg = document.getElementById("heroCoverImg");
const heroAlbumMeta = document.getElementById("heroAlbumMeta");
const heroAlbumTitle = document.getElementById("heroAlbumTitle");
const heroAlbumArtist = document.getElementById("heroAlbumArtist");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const heroShuffleBtn = document.getElementById("heroShuffleBtn");
const heroAddIconBtn = document.getElementById("heroAddIconBtn");
const tabViewTracklist = document.getElementById("tabViewTracklist");
const tabViewCrate = document.getElementById("tabViewCrate");

// Main Content Sections
const nirvanaEmptyCard = document.getElementById("nirvanaEmptyCard");
const nirvanaAddBtn = document.getElementById("nirvanaAddBtn");
const nirvanaDropBox = document.getElementById("nirvanaDropBox");
const tracklistSection = document.getElementById("tracklistSection");
const tracklistRowsList = document.getElementById("tracklistRowsList");
const vinylCrateSection = document.getElementById("vinylCrateSection");
const vinylFullBannerStack = document.getElementById("vinylFullBannerStack");

// Desktop Now Playing Panel
const panelArtImg = document.getElementById("panelArtImg");
const panelTrackName = document.getElementById("panelTrackName");
const panelTrackArtist = document.getElementById("panelTrackArtist");
const panelQueueItems = document.getElementById("panelQueueItems");

// Desktop Bottom Player Bar
const dtThumbImg = document.getElementById("dtThumbImg");
const dtTitle = document.getElementById("dtTitle");
const dtArtist = document.getElementById("dtArtist");
const dtShuffleBtn = document.getElementById("dtShuffleBtn");
const dtPrevBtn = document.getElementById("dtPrevBtn");
const dtPlayBtn = document.getElementById("dtPlayBtn");
const dtPlaySvg = document.getElementById("dtPlaySvg");
const dtPauseSvg = document.getElementById("dtPauseSvg");
const dtNextBtn = document.getElementById("dtNextBtn");
const dtRepeatBtn = document.getElementById("dtRepeatBtn");
const dtRepeatOneTag = document.getElementById("dtRepeatOneTag");
const dtCurrentTime = document.getElementById("dtCurrentTime");
const dtDuration = document.getElementById("dtDuration");
const dtWaveformTrack = document.getElementById("dtWaveformTrack");
const dtCrateShortcutBtn = document.getElementById("dtCrateShortcutBtn");
const dtMuteBtn = document.getElementById("dtMuteBtn");
const dtVolumeSlider = document.getElementById("dtVolumeSlider");

// Mobile Mini Player
const mobileFloatingMiniPlayer = document.getElementById("mobileFloatingMiniPlayer");
const mobileMiniThumb = document.getElementById("mobileMiniThumb");
const mobileMiniTitle = document.getElementById("mobileMiniTitle");
const mobileMiniArtist = document.getElementById("mobileMiniArtist");
const mobileMiniPlayBtn = document.getElementById("mobileMiniPlayBtn");
const mobileMiniPlaySvg = document.getElementById("mobileMiniPlaySvg");
const mobileMiniPauseSvg = document.getElementById("mobileMiniPauseSvg");

// Mobile 3-Button Footer
const mobTabHome = document.getElementById("mobTabHome");
const mobTabSearch = document.getElementById("mobTabSearch");
const mobTabCrate = document.getElementById("mobTabCrate");

// Mobile Full-Screen Now Playing Overlay
const mobileNowPlayingOverlay = document.getElementById("mobileNowPlayingOverlay");
const mobileNpCollapseBtn = document.getElementById("mobileNpCollapseBtn");
const mobileNpQueueBtn = document.getElementById("mobileNpQueueBtn");
const mobileNpArtImg = document.getElementById("mobileNpArtImg");
const mobileNpSongTitle = document.getElementById("mobileNpSongTitle");
const mobileNpSongArtist = document.getElementById("mobileNpSongArtist");
const mobileWaveformBars = document.getElementById("mobileWaveformBars");
const mobileNpCurrentTime = document.getElementById("mobileNpCurrentTime");
const mobileNpDuration = document.getElementById("mobileNpDuration");
const mobileShuffleBtn = document.getElementById("mobileShuffleBtn");
const mobilePrevBtn = document.getElementById("mobilePrevBtn");
const mobilePlayBtn = document.getElementById("mobilePlayBtn");
const mobilePlaySvg = document.getElementById("mobilePlaySvg");
const mobilePauseSvg = document.getElementById("mobilePauseSvg");
const mobileNextBtn = document.getElementById("mobileNextBtn");
const mobileRepeatBtn = document.getElementById("mobileRepeatBtn");
const mobileRepeatOneTag = document.getElementById("mobileRepeatOneTag");

// Add Song Modal
const addSongModal = document.getElementById("addSongModal");
const addSongBackdrop = document.getElementById("addSongBackdrop");
const closeAddSongModalBtn = document.getElementById("closeAddSongModalBtn");
const cancelAddSongBtn = document.getElementById("cancelAddSongBtn");
const addSongForm = document.getElementById("addSongForm");
const newSongTitle = document.getElementById("newSongTitle");
const newSongArtist = document.getElementById("newSongArtist");
const newSongFile = document.getElementById("newSongFile");
const newSongBanner = document.getElementById("newSongBanner");
const audioDropLabel = document.getElementById("audioDropLabel");
const bannerDropLabel = document.getElementById("bannerDropLabel");
const presetCoverBoxes = document.querySelectorAll(".preset-cover-box");

// Sign Up & Log In Modals
const signupModal = document.getElementById("signupModal");
const signupBackdrop = document.getElementById("signupBackdrop");
const closeSignupBtn = document.getElementById("closeSignupBtn");
const signupForm = document.getElementById("signupForm");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupFeedback = document.getElementById("signupFeedback");
const switchLoginFromSignupBtn = document.getElementById("switchLoginFromSignupBtn");

const loginModal = document.getElementById("loginModal");
const loginBackdrop = document.getElementById("loginBackdrop");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginFeedback = document.getElementById("loginFeedback");
const switchSignupFromLoginBtn = document.getElementById("switchSignupFromLoginBtn");


// ========================================================
// 1. CAPACITIVE TOUCH GRID DOTS (Landing Screen Animation)
// Dots sit invisibly on a stationary grid across the screen.
// They wait for finger touch / press to reveal themselves with a soft
// radial capacitive falloff directly under the pressed area.
// As soon as the finger / pointer is lifted, they vanish immediately.
// ========================================================

let dotsAnimationId = null;
const activeTouches = new Map();

function initZenDotsCanvas() {
    if (!landingDotsCanvas) return;
    const ctx = landingDotsCanvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    let w = 0;
    let h = 0;
    const GRID_SPACING = 10;
    const TOUCH_RADIUS = 96;

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        landingDotsCanvas.width = Math.floor(w * dpr);
        landingDotsCanvas.height = Math.floor(h * dpr);
        landingDotsCanvas.style.width = w + "px";
        landingDotsCanvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function updatePointer(id, x, y, isPressed) {
        activeTouches.set(id, {
            x,
            y,
            isPressed,
            intensity: isPressed ? 1.0 : 0.88
        });
    }

    function removePointer(id) {
        activeTouches.delete(id);
    }

    // Touch events on landing screen (mobile & tablet)
    landingScreen.addEventListener("touchstart", e => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            updatePointer("touch-" + t.identifier, t.clientX, t.clientY, true);
        }
    }, { passive: true });

    landingScreen.addEventListener("touchmove", e => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            updatePointer("touch-" + t.identifier, t.clientX, t.clientY, true);
        }
    }, { passive: true });

    landingScreen.addEventListener("touchend", e => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            removePointer("touch-" + t.identifier);
        }
    }, { passive: true });

    landingScreen.addEventListener("touchcancel", e => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            removePointer("touch-" + t.identifier);
        }
    }, { passive: true });

    // Pointer events on landing screen (desktop mouse / stylus)
    landingScreen.addEventListener("pointerdown", e => {
        if (e.pointerType === "touch") return;
        updatePointer("pointer-" + e.pointerId, e.clientX, e.clientY, true);
    });

    landingScreen.addEventListener("pointermove", e => {
        if (e.pointerType === "touch") return;
        const isPressed = e.buttons > 0;
        updatePointer("pointer-" + e.pointerId, e.clientX, e.clientY, isPressed);
    });

    landingScreen.addEventListener("pointerup", e => {
        if (e.pointerType === "touch") return;
        removePointer("pointer-" + e.pointerId);
    });

    landingScreen.addEventListener("pointerleave", e => {
        if (e.pointerType === "touch") return;
        removePointer("pointer-" + e.pointerId);
    });

    function renderTouchGrid() {
        ctx.clearRect(0, 0, w, h);

        if (activeTouches.size > 0) {
            const touches = Array.from(activeTouches.values());

            for (const touch of touches) {
                const minX = Math.max(0, Math.floor((touch.x - TOUCH_RADIUS) / GRID_SPACING) * GRID_SPACING);
                const maxX = Math.min(w, Math.ceil((touch.x + TOUCH_RADIUS) / GRID_SPACING) * GRID_SPACING);
                const minY = Math.max(0, Math.floor((touch.y - TOUCH_RADIUS) / GRID_SPACING) * GRID_SPACING);
                const maxY = Math.min(h, Math.ceil((touch.y + TOUCH_RADIUS) / GRID_SPACING) * GRID_SPACING);

                for (let gx = minX; gx <= maxX; gx += GRID_SPACING) {
                    for (let gy = minY; gy <= maxY; gy += GRID_SPACING) {
                        const dx = gx - touch.x;
                        const dy = gy - touch.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < TOUCH_RADIUS) {
                            const factor = 1 - (dist / TOUCH_RADIUS);
                            // Solid pure black with clean radial falloff
                            const alpha = Math.min(1.0, Math.pow(factor, 0.65) * 1.5 * touch.intensity);
                            // Ultra-dense micro-dots (radius ~0.85px to 1.35px)
                            const radius = 0.85 + factor * 0.5;

                            ctx.beginPath();
                            ctx.arc(gx, gy, radius, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                            ctx.fill();
                        }
                    }
                }
            }
        }

        if (landingScreen.style.display !== "none") {
            dotsAnimationId = requestAnimationFrame(renderTouchGrid);
        }
    }

    if (dotsAnimationId) cancelAnimationFrame(dotsAnimationId);
    dotsAnimationId = requestAnimationFrame(renderTouchGrid);
}


// ========================================================
// 2. AUTHENTICATION & SESSION MANAGEMENT
// ========================================================

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function updateAuthUI() {
    userProfilePill.innerHTML = "";
    if (currentUser) {
        const nameSpan = document.createElement("span");
        nameSpan.className = "user-name-tag";
        nameSpan.textContent = currentUser.name;

        const logoutBtn = document.createElement("button");
        logoutBtn.className = "logout-link-btn";
        logoutBtn.type = "button";
        logoutBtn.textContent = "Log out";
        logoutBtn.addEventListener("click", logout);

        userProfilePill.appendChild(nameSpan);
        userProfilePill.appendChild(logoutBtn);
    } else {
        const loginPill = document.createElement("button");
        loginPill.className = "pill-btn-outline";
        loginPill.type = "button";
        loginPill.textContent = "Log In";
        loginPill.addEventListener("click", openLoginModal);

        const signupPill = document.createElement("button");
        signupPill.className = "pill-btn-solid";
        signupPill.type = "button";
        signupPill.textContent = "Sign Up";
        signupPill.addEventListener("click", openSignupModal);

        userProfilePill.appendChild(loginPill);
        userProfilePill.appendChild(signupPill);
    }
}

function showLanding() {
    landingScreen.style.display = "flex";
    appContainer.style.display = "none";
    initZenDotsCanvas();
}

function showApp() {
    landingScreen.style.display = "none";
    if (dotsAnimationId) cancelAnimationFrame(dotsAnimationId);
    appContainer.style.display = "flex";
    updateAuthUI();
    refreshSongs();
}

function login(email, password) {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email === cleanEmail && u.password === password);

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    isGuestMode = false;
    closeLoginModal();
    showApp();
}

function register(name, email, password) {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email === cleanEmail)) {
        throw new Error("An account with this email already exists.");
    }

    const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        email: cleanEmail,
        password: password
    };

    users.push(newUser);
    saveUsers(users);

    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    isGuestMode = false;
    closeSignupModal();
    showApp();
}

function logout() {
    pause();
    currentUser = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    isGuestMode = false;
    currentSongIndex = -1;
    showLanding();
}

function openSignupModal() {
    signupForm.reset();
    signupFeedback.textContent = "";
    signupModal.style.display = "flex";
}
function closeSignupModal() {
    signupModal.style.display = "none";
}

function openLoginModal() {
    loginForm.reset();
    loginFeedback.textContent = "";
    loginModal.style.display = "flex";
}
function closeLoginModal() {
    loginModal.style.display = "none";
}


// ========================================================
// 3. INDEXED DB SONG STORAGE ENGINE
// ========================================================

function openSongDatabase() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error("IndexedDB not supported."));
            return;
        }

        const request = indexedDB.open(SONG_DB_NAME, 2);

        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(SONG_STORE_NAME)) {
                db.createObjectStore(SONG_STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getStoredSongs() {
    return openSongDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SONG_STORE_NAME, "readonly");
            const store = transaction.objectStore(SONG_STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const records = request.result || [];
                const targetUserId = currentUser ? currentUser.id : "guest";
                // Show records for this user (or guest)
                const userRecords = records.filter(s => s.userId === targetUserId);
                resolve(userRecords);
            };
            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => db.close();
        });
    });
}

function saveSongRecord(song) {
    return openSongDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SONG_STORE_NAME, "readwrite");
            const record = {
                ...song,
                userId: currentUser ? currentUser.id : "guest"
            };
            transaction.objectStore(SONG_STORE_NAME).put(record);

            transaction.oncomplete = () => {
                db.close();
                resolve();
            };
            transaction.onerror = () => {
                db.close();
                reject(transaction.error);
            };
        });
    });
}

function deleteSongRecord(id) {
    return openSongDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SONG_STORE_NAME, "readwrite");
            transaction.objectStore(SONG_STORE_NAME).delete(id);

            transaction.oncomplete = () => {
                db.close();
                resolve();
            };
            transaction.onerror = () => {
                db.close();
                reject(transaction.error);
            };
        });
    });
}


// ========================================================
// 4. SONG REFRESH & VIEWS RENDERING
// ========================================================

async function refreshSongs() {
    const records = await getStoredSongs();

    songs = records.map((s, idx) => {
        let audioUrl = objectUrlCache.get(`audio-${s.id}`);
        if (!audioUrl && s.audioBlob) {
            audioUrl = URL.createObjectURL(s.audioBlob);
            objectUrlCache.set(`audio-${s.id}`, audioUrl);
        }

        let posterUrl = objectUrlCache.get(`poster-${s.id}`);
        if (!posterUrl) {
            if (s.posterBlob) {
                posterUrl = URL.createObjectURL(s.posterBlob);
                objectUrlCache.set(`poster-${s.id}`, posterUrl);
            } else if (s.posterPreset) {
                posterUrl = s.posterPreset;
            } else {
                posterUrl = PRESET_SLEEVES[idx % PRESET_SLEEVES.length];
            }
        }

        return {
            id: s.id,
            title: s.title || "Untitled Track",
            artist: s.artist || "Unknown Artist",
            src: audioUrl,
            poster: posterUrl,
            duration: s.duration || "2:52"
        };
    });

    sidebarSongCount.textContent = songs.length;
    heroAlbumMeta.textContent = `Album • ${songs.length} songs • 2026`;

    renderTracklist();
    renderVinylCrate();
    renderPanelQueue();

    if (songs.length === 0) {
        // Show "Choose your Nirvana" Empty State
        appContainer.classList.add("empty-library");
        nirvanaEmptyCard.style.display = "flex";
        tracklistSection.style.display = "none";
        vinylCrateSection.style.display = "none";

        dtTitle.textContent = "Choose your Nirvana";
        dtArtist.textContent = "Add your first song";
        mobileMiniTitle.textContent = "Choose your Nirvana";
        mobileMiniArtist.textContent = "Add your first song";
        mobileNpSongTitle.textContent = "Choose your Nirvana";
        mobileNpSongArtist.textContent = "Add your first song";
    } else {
        appContainer.classList.remove("empty-library");
        nirvanaEmptyCard.style.display = "none";

        if (currentMainView === "tracklist") {
            tracklistSection.style.display = "flex";
            vinylCrateSection.style.display = "none";
        } else {
            tracklistSection.style.display = "none";
            vinylCrateSection.style.display = "flex";
        }

        if (currentSongIndex === -1 && songs.length > 0) {
            loadTrack(0, false);
        }
    }
}

function renderTracklist() {
    tracklistRowsList.innerHTML = "";
    const filter = (searchInput.value || "").trim().toLowerCase();

    songs.forEach((song, idx) => {
        if (filter && !song.title.toLowerCase().includes(filter) && !song.artist.toLowerCase().includes(filter)) {
            return;
        }

        const isActive = idx === currentSongIndex;
        const row = document.createElement("div");
        row.className = `track-item-row ${isActive ? "active" : ""}`;

        let leadingHtml = "";
        if (isActive && isPlaying) {
            leadingHtml = `
                <div class="sound-bars-anim">
                    <span></span><span></span><span></span><span></span>
                </div>
            `;
        } else {
            const numStr = (idx + 1) < 10 ? `0${idx + 1}` : `${idx + 1}`;
            leadingHtml = `<span class="track-index-col">${numStr}</span>`;
        }

        row.innerHTML = `
            ${leadingHtml}
            <div class="track-title-col">
                <img src="${song.poster}" alt="Thumb" class="track-thumb-img">
                <span class="track-title-text">${song.title}</span>
            </div>
            <span class="track-artist-col">${song.artist}</span>
            <span class="track-duration-col">${song.duration}</span>
            <div class="track-actions-col">
                <button class="track-del-btn" type="button" title="Delete song" aria-label="Delete song">
                    🗑
                </button>
            </div>
        `;

        row.addEventListener("click", () => {
            loadTrack(idx, true);
        });

        const delBtn = row.querySelector(".track-del-btn");
        delBtn.addEventListener("click", async e => {
            e.stopPropagation();
            if (confirm(`Remove "${song.title}" from library?`)) {
                await deleteSongRecord(song.id);
                if (currentSongIndex === idx) {
                    pause();
                    currentSongIndex = -1;
                }
                await refreshSongs();
            }
        });

        tracklistRowsList.appendChild(row);
    });
}


// ========================================================
// 5. 3D FULL-BANNER VINYL CRATE DECK
// "reduce padding of vinyl crate deck so crates are big enough and smoothly scrollable with full banner scroll"
// ========================================================

function renderVinylCrate() {
    vinylFullBannerStack.innerHTML = "";

    if (songs.length === 0) {
        vinylFullBannerStack.innerHTML = `<p style="color: #6C7689; font-size: 14px; margin-top: 40px;">No vinyls in crate. Add your first track!</p>`;
        return;
    }

    songs.forEach((song, idx) => {
        const isCurrent = idx === currentSongIndex;
        const sleeve = document.createElement("div");
        sleeve.className = `vinyl-full-sleeve-card ${isCurrent ? "pulled" : ""}`;
        sleeve.title = `Click to play: ${song.title} by ${song.artist}`;

        const numStr = (idx + 1) < 10 ? `0${idx + 1}` : `${idx + 1}`;

        sleeve.innerHTML = `
            <div class="sleeve-spine-bar">
                <span>${numStr} • ${song.title}</span>
                <span>${song.artist}</span>
            </div>
            <img src="${song.poster}" alt="${song.title}" class="sleeve-cover-img">
        `;

        sleeve.addEventListener("click", () => {
            document.querySelectorAll(".vinyl-full-sleeve-card").forEach(c => c.classList.remove("pulled"));
            sleeve.classList.add("pulled");

            setTimeout(() => {
                loadTrack(idx, true);
            }, 180);
        });

        vinylFullBannerStack.appendChild(sleeve);
    });
}

function setMainView(view) {
    currentMainView = view;
    if (view === "crate") {
        tracklistSection.style.display = "none";
        vinylCrateSection.style.display = "flex";
        tabViewTracklist.classList.remove("active");
        tabViewCrate.classList.add("active");
        mobTabHome.classList.remove("active");
        mobTabCrate.classList.add("active");
        renderVinylCrate();
    } else {
        tracklistSection.style.display = "flex";
        vinylCrateSection.style.display = "none";
        tabViewTracklist.classList.add("active");
        tabViewCrate.classList.remove("active");
        mobTabHome.classList.add("active");
        mobTabCrate.classList.remove("active");
    }
}


// ========================================================
// 6. AUDIO PLAYBACK & WAVEFORM SCRUBBER
// ========================================================

const WAVE_BARS_COUNT = 44;
let waveBarHeights = [];

function initWaveform() {
    waveBarHeights = [];
    for (let i = 0; i < WAVE_BARS_COUNT; i++) {
        const base = Math.sin((i / WAVE_BARS_COUNT) * Math.PI) * 18 + 5;
        const rand = Math.sin(i * 1.6) * 4 + Math.cos(i * 3.1) * 3;
        waveBarHeights.push(Math.max(4, Math.min(26, Math.round(base + rand))));
    }

    renderWaveforms();
}

function renderWaveforms() {
    dtWaveformTrack.innerHTML = "";
    mobileWaveformBars.innerHTML = "";

    for (let i = 0; i < WAVE_BARS_COUNT; i++) {
        const h = waveBarHeights[i];

        // Desktop bar unit
        const dtBar = document.createElement("div");
        dtBar.className = "wave-bar-unit";
        dtBar.style.height = `${h}px`;
        dtBar.setAttribute("data-index", i);
        dtWaveformTrack.appendChild(dtBar);

        // Mobile bar unit
        const mobBar = document.createElement("div");
        mobBar.className = "wave-bar-unit";
        mobBar.style.height = `${h}px`;
        mobBar.setAttribute("data-index", i);
        mobileWaveformBars.appendChild(mobBar);
    }
}

function attachWaveformScrubbing(container) {
    container.addEventListener("click", e => {
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, clickX / rect.width));

        if (audioPlayer.duration) {
            audioPlayer.currentTime = percent * audioPlayer.duration;
            updateWaveform(percent);
        }
    });
}
attachWaveformScrubbing(dtWaveformTrack);
attachWaveformScrubbing(mobileWaveformBars);

function updateWaveform(percent) {
    const activeLimit = Math.floor(percent * WAVE_BARS_COUNT);

    document.querySelectorAll(".wave-bar-unit").forEach(bar => {
        const idx = parseInt(bar.getAttribute("data-index"), 10);
        bar.classList.toggle("active", idx <= activeLimit);
    });
}

function formatTime(secs) {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function loadTrack(index, shouldPlay = true) {
    if (index < 0 || index >= songs.length) return;
    currentSongIndex = index;
    const song = songs[currentSongIndex];

    audioPlayer.src = song.src;
    audioPlayer.load();

    // Desktop elements
    dtThumbImg.src = song.poster;
    dtTitle.textContent = song.title;
    dtArtist.textContent = song.artist;
    heroCoverImg.src = song.poster;
    heroAlbumTitle.textContent = song.title;
    heroAlbumArtist.textContent = song.artist;
    panelArtImg.src = song.poster;
    panelTrackName.textContent = song.title;
    panelTrackArtist.textContent = song.artist;

    // Mobile elements
    mobileMiniThumb.src = song.poster;
    mobileMiniTitle.textContent = song.title;
    mobileMiniArtist.textContent = song.artist;
    mobileNpArtImg.src = song.poster;
    mobileNpSongTitle.textContent = song.title;
    mobileNpSongArtist.textContent = song.artist;

    // Reset progress
    dtCurrentTime.textContent = "0:00";
    mobileNpCurrentTime.textContent = "0:00";
    updateWaveform(0);
    renderTracklist();
    renderPanelQueue();

    if (shouldPlay) {
        play();
    } else {
        pause();
    }
}

function play() {
    if (currentSongIndex === -1 && songs.length > 0) {
        loadTrack(0, true);
        return;
    }
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayIcons(true);
        renderTracklist();
    }).catch(err => {
        console.warn("Playback error or autoplay blocked:", err);
        isPlaying = false;
        updatePlayIcons(false);
    });
}

function pause() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayIcons(false);
    renderTracklist();
}

function togglePlay() {
    if (songs.length === 0) {
        openAddSongModal();
        return;
    }
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function updatePlayIcons(playing) {
    // Desktop Bottom Bar
    dtPlaySvg.style.display = playing ? "none" : "block";
    dtPauseSvg.style.display = playing ? "block" : "none";

    // Mobile Mini Player
    mobileMiniPlaySvg.style.display = playing ? "none" : "block";
    mobileMiniPauseSvg.style.display = playing ? "block" : "none";

    // Mobile Full Now Playing
    mobilePlaySvg.style.display = playing ? "none" : "block";
    mobilePauseSvg.style.display = playing ? "block" : "none";
}

// Functioning Shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    dtShuffleBtn.classList.toggle("active", isShuffle);
    mobileShuffleBtn.classList.toggle("active", isShuffle);
    heroShuffleBtn.classList.toggle("pill-btn-solid", isShuffle);
}

function nextTrack() {
    if (songs.length === 0) return;
    if (isShuffle) {
        let randIdx = currentSongIndex;
        if (songs.length > 1) {
            while (randIdx === currentSongIndex) {
                randIdx = Math.floor(Math.random() * songs.length);
            }
        }
        loadTrack(randIdx, true);
        return;
    }
    const nextIdx = (currentSongIndex + 1) % songs.length;
    loadTrack(nextIdx, true);
}

function prevTrack() {
    if (songs.length === 0) return;
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    loadTrack(prevIdx, true);
}

// Functioning Repeat Mode ('none' -> 'all' -> 'one')
function toggleRepeat() {
    if (repeatMode === "none") {
        repeatMode = "all";
        dtRepeatBtn.classList.add("active");
        mobileRepeatBtn.classList.add("active");
        dtRepeatOneTag.style.display = "none";
        mobileRepeatOneTag.style.display = "none";
    } else if (repeatMode === "all") {
        repeatMode = "one";
        dtRepeatBtn.classList.add("active");
        mobileRepeatBtn.classList.add("active");
        dtRepeatOneTag.style.display = "flex";
        mobileRepeatOneTag.style.display = "flex";
    } else {
        repeatMode = "none";
        dtRepeatBtn.classList.remove("active");
        mobileRepeatBtn.classList.remove("active");
        dtRepeatOneTag.style.display = "none";
        mobileRepeatOneTag.style.display = "none";
    }
}

// Audio Player Listeners
audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) return;
    const cur = audioPlayer.currentTime;
    const dur = audioPlayer.duration;
    const pct = cur / dur;

    dtCurrentTime.textContent = formatTime(cur);
    dtDuration.textContent = formatTime(dur);
    mobileNpCurrentTime.textContent = formatTime(cur);
    mobileNpDuration.textContent = formatTime(dur);
    updateWaveform(pct);
});

audioPlayer.addEventListener("loadedmetadata", () => {
    dtDuration.textContent = formatTime(audioPlayer.duration);
    mobileNpDuration.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("ended", () => {
    if (repeatMode === "one") {
        audioPlayer.currentTime = 0;
        play();
    } else if (repeatMode === "all" || currentSongIndex < songs.length - 1) {
        nextTrack();
    } else {
        pause();
    }
});

// Volume control
dtVolumeSlider.addEventListener("input", e => {
    const val = e.target.value / 100;
    audioPlayer.volume = val;
    audioPlayer.muted = false;
    dtMuteBtn.textContent = val === 0 ? "🔇" : val > 0.5 ? "🔊" : "🔉";
});

dtMuteBtn.addEventListener("click", () => {
    audioPlayer.muted = !audioPlayer.muted;
    dtMuteBtn.textContent = audioPlayer.muted ? "🔇" : "🔊";
});

function renderPanelQueue() {
    panelQueueItems.innerHTML = "";
    if (songs.length === 0) return;

    songs.forEach((s, idx) => {
        if (idx === currentSongIndex) return;

        const item = document.createElement("div");
        item.className = "queue-pill-item";
        item.innerHTML = `
            <img src="${s.poster}" alt="Thumb" class="queue-pill-thumb">
            <div>
                <div class="queue-pill-name">${s.title}</div>
                <div class="queue-pill-artist">${s.artist}</div>
            </div>
        `;
        item.addEventListener("click", () => {
            loadTrack(idx, true);
        });
        panelQueueItems.appendChild(item);
    });
}


// ========================================================
// 7. ADD SONG MODAL & FILE HANDLING
// "adjust size so there's NO scrollbar present in mobile or web view"
// ========================================================

function openAddSongModal() {
    addSongForm.reset();
    audioDropLabel.textContent = "Choose audio file or drag & drop here";
    bannerDropLabel.textContent = "Optional custom cover image";
    addSongModal.style.display = "flex";
}

function closeAddSongModal() {
    addSongModal.style.display = "none";
}

presetCoverBoxes.forEach(box => {
    box.addEventListener("click", () => {
        presetCoverBoxes.forEach(b => b.classList.remove("selected"));
        box.classList.add("selected");
        box.querySelector("input").checked = true;
    });
});

newSongFile.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
        audioDropLabel.textContent = `Selected: ${file.name}`;
        if (!newSongTitle.value) {
            const clean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            newSongTitle.value = clean.charAt(0).toUpperCase() + clean.slice(1);
        }
    }
});

newSongBanner.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
        bannerDropLabel.textContent = `Selected: ${file.name}`;
    }
});

addSongForm.addEventListener("submit", async e => {
    e.preventDefault();

    const title = newSongTitle.value.trim();
    const artist = newSongArtist.value.trim() || "Unknown Artist";
    const audioFile = newSongFile.files[0];
    const bannerFile = newSongBanner.files[0];
    const selectedPresetVal = document.querySelector('input[name="coverStyle"]:checked')?.value || "charcoal";

    let presetImg = "assets/themes/cover_charcoal.png";
    if (selectedPresetVal === "sleeve1") presetImg = "assets/themes/sleeve_1.png";
    if (selectedPresetVal === "sleeve2") presetImg = "assets/themes/sleeve_2.png";
    if (selectedPresetVal === "sleeve4") presetImg = "assets/themes/sleeve_4.png";

    if (!title || !audioFile) {
        alert("Please provide a track title and audio file.");
        return;
    }

    const songRecord = {
        id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        artist,
        audioBlob: audioFile,
        posterBlob: bannerFile || null,
        posterPreset: presetImg,
        createdAt: Date.now()
    };

    try {
        await saveSongRecord(songRecord);
        closeAddSongModal();
        await refreshSongs();

        const newIdx = songs.findIndex(s => s.id === songRecord.id);
        if (newIdx >= 0) {
            loadTrack(newIdx, true);
        }
    } catch (err) {
        console.error("Could not save song:", err);
        alert("Failed to save track.");
    }
});

// Drag & Drop on Nirvana Empty state
nirvanaDropBox.addEventListener("dragover", e => {
    e.preventDefault();
    nirvanaDropBox.classList.add("drag-over");
});
nirvanaDropBox.addEventListener("dragleave", () => {
    nirvanaDropBox.classList.remove("drag-over");
});
nirvanaDropBox.addEventListener("drop", e => {
    e.preventDefault();
    nirvanaDropBox.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
        openAddSongModal();
        const dt = new DataTransfer();
        dt.items.add(file);
        newSongFile.files = dt.files;
        audioDropLabel.textContent = `Selected: ${file.name}`;
        const clean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        newSongTitle.value = clean.charAt(0).toUpperCase() + clean.slice(1);
    }
});


// ========================================================
// 8. EVENT LISTENERS
// ========================================================

// Landing Nav / Hero Buttons
landingLoginBtn.addEventListener("click", openLoginModal);
landingSignupBtn.addEventListener("click", openSignupModal);
heroSignupActionBtn.addEventListener("click", openSignupModal);
heroGuestActionBtn.addEventListener("click", () => {
    isGuestMode = true;
    showApp();
});

// Auth Form Submissions
signupForm.addEventListener("submit", e => {
    e.preventDefault();
    try {
        register(signupName.value, signupEmail.value, signupPassword.value);
    } catch (err) {
        signupFeedback.textContent = err.message;
    }
});

loginForm.addEventListener("submit", e => {
    e.preventDefault();
    try {
        login(loginEmail.value, loginPassword.value);
    } catch (err) {
        loginFeedback.textContent = err.message;
    }
});

switchLoginFromSignupBtn.addEventListener("click", () => {
    closeSignupModal();
    openLoginModal();
});
switchSignupFromLoginBtn.addEventListener("click", () => {
    closeLoginModal();
    openSignupModal();
});
closeSignupBtn.addEventListener("click", closeSignupModal);
signupBackdrop.addEventListener("click", closeSignupModal);
closeLoginBtn.addEventListener("click", closeLoginModal);
loginBackdrop.addEventListener("click", closeLoginModal);

// Top Bar Actions
topAddTrackBtn.addEventListener("click", openAddSongModal);
sidebarAddSongBtn.addEventListener("click", openAddSongModal);
heroAddIconBtn.addEventListener("click", openAddSongModal);
nirvanaAddBtn.addEventListener("click", openAddSongModal);
closeAddSongModalBtn.addEventListener("click", closeAddSongModal);
cancelAddSongBtn.addEventListener("click", closeAddSongModal);
addSongBackdrop.addEventListener("click", closeAddSongModal);

// Search
searchInput.addEventListener("input", e => {
    clearSearchBtn.style.display = e.target.value ? "block" : "none";
    renderTracklist();
});
clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderTracklist();
    searchInput.focus();
});

// View Switchers (Tracklist vs 3D Vinyl Crate Deck)
tabViewTracklist.addEventListener("click", () => setMainView("tracklist"));
tabViewCrate.addEventListener("click", () => setMainView("crate"));
topCrateBtn.addEventListener("click", () => setMainView("crate"));
sidebarNavCrate.addEventListener("click", () => setMainView("crate"));
dtCrateShortcutBtn.addEventListener("click", () => {
    setMainView(currentMainView === "crate" ? "tracklist" : "crate");
});

// Sidebar Navigation
sidebarNavHome.addEventListener("click", () => {
    setMainView("tracklist");
    document.getElementById("mainScrollBody").scrollTo({ top: 0, behavior: "smooth" });
});
sidebarNavSearch.addEventListener("click", () => searchInput.focus());
sidebarAlbumLink.addEventListener("click", () => setMainView("tracklist"));

// Album Hero Buttons
heroPlayBtn.addEventListener("click", () => {
    if (songs.length > 0) loadTrack(0, true);
});
heroShuffleBtn.addEventListener("click", () => {
    if (songs.length > 0) {
        toggleShuffle();
        const r = Math.floor(Math.random() * songs.length);
        loadTrack(r, true);
    }
});

// Desktop Bottom Controls
dtPlayBtn.addEventListener("click", togglePlay);
dtNextBtn.addEventListener("click", nextTrack);
dtPrevBtn.addEventListener("click", prevTrack);
dtShuffleBtn.addEventListener("click", toggleShuffle);
dtRepeatBtn.addEventListener("click", toggleRepeat);

// Mobile Mini Player -> Expands Full Now Playing (Mobile view only)
function openMobileOverlay() {
    if (window.innerWidth <= 768) {
        mobileNowPlayingOverlay.classList.add("open");
    }
}

function closeMobileOverlay() {
    mobileNowPlayingOverlay.classList.remove("open");
    mobileNowPlayingOverlay.style.display = "";
}

mobileFloatingMiniPlayer.addEventListener("click", e => {
    if (e.target.closest("#mobileMiniPlayBtn")) return; // prevent toggle trigger from opening
    openMobileOverlay();
});
mobileMiniPlayBtn.addEventListener("click", togglePlay);

// Mobile Full Now Playing Controls (Pic 3)
mobileNpCollapseBtn.addEventListener("click", closeMobileOverlay);
mobileNpQueueBtn.addEventListener("click", () => {
    closeMobileOverlay();
    setMainView("crate");
});
mobilePlayBtn.addEventListener("click", togglePlay);
mobileNextBtn.addEventListener("click", nextTrack);
mobilePrevBtn.addEventListener("click", prevTrack);
mobileShuffleBtn.addEventListener("click", toggleShuffle);
mobileRepeatBtn.addEventListener("click", toggleRepeat);

// Mobile 3 Footer Buttons
mobTabHome.addEventListener("click", () => {
    closeMobileOverlay();
    setMainView("tracklist");
});
mobTabSearch.addEventListener("click", () => {
    closeMobileOverlay();
    searchInput.focus();
});
mobTabCrate.addEventListener("click", () => {
    closeMobileOverlay();
    setMainView("crate");
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMobileOverlay();
    }
});


// ========================================================
// 9. INITIALIZATION
// ========================================================

function init() {
    initWaveform();

    if (currentUser) {
        showApp();
    } else {
        showLanding();
    }
}

init();
