// ========================================================
// PIXELTUNES - SCRIPT
// 16-Bit Pixel Audio Kingdom
// ========================================================

const USERS_KEY = "gotoSongUsers";
const CURRENT_USER_KEY = "gotoSongCurrentUser";
const THEME_KEY = "pixelTunesTheme";
const SONG_DB_NAME = "gotoSongDatabase";
const SONG_STORE_NAME = "customSongs";

// Application State
let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
let currentTheme = localStorage.getItem(THEME_KEY) || "castle";
let songs = [];
let filteredSongs = [];
let currentSongIndex = -1;
let isPlaying = false;
let isShuffle = false;
let repeatMode = "none"; // 'none' | 'all' | 'one'
let likedSongIds = new Set();
let isGuestMode = false;

// Audio Instance
const audioPlayer = new Audio();
const objectUrlCache = new Map();

// ========================================================
// DOM ELEMENTS
// ========================================================

// Views
const landingScreen = document.getElementById("landingScreen");
const appContainer = document.getElementById("appContainer");
const starfieldCanvas = document.getElementById("starfieldCanvas");

// Landing Elements
const landingLoginNavBtn = document.getElementById("landingLoginNavBtn");
const landingSignupNavBtn = document.getElementById("landingSignupNavBtn");
const heroSignupBtn = document.getElementById("heroSignupBtn");
const heroLoginBtn = document.getElementById("heroLoginBtn");
const heroExploreBtn = document.getElementById("heroExploreBtn");
const floatingCards = document.querySelectorAll(".floating-card");

// App Header
const brandLogoHome = document.getElementById("brandLogoHome");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const openThemePickerBtn = document.getElementById("openThemePickerBtn");
const activeThemeLabel = document.getElementById("activeThemeLabel");
const authButtons = document.getElementById("authButtons");

// Sidebar
const navHome = document.getElementById("navHome");
const navExplore = document.getElementById("navExplore");
const navLibrary = document.getElementById("navLibrary");
const navPlaylists = document.getElementById("navPlaylists");
const navLiked = document.getElementById("navLiked");
const sidebarAddSongBtn = document.getElementById("sidebarAddSongBtn");
const libraryCount = document.getElementById("libraryCount");
const likedCount = document.getElementById("likedCount");

// Stage Arch & Scenery
const bannerEmblem = document.getElementById("bannerEmblem");
const scenicLandscape = document.getElementById("scenicLandscape");
const nirvanaEmptyState = document.getElementById("nirvanaEmptyState");
const nirvanaAddBtn = document.getElementById("nirvanaAddBtn");
const nirvanaDropzone = document.getElementById("nirvanaDropzone");
const nowPlayingCard = document.getElementById("nowPlayingCard");

// Stage Player Controls
const stageAlbumArt = document.getElementById("stageAlbumArt");
const stageTrackTitle = document.getElementById("stageTrackTitle");
const stageTrackArtist = document.getElementById("stageTrackArtist");
const stageLikeBtn = document.getElementById("stageLikeBtn");
const stageLikeIcon = document.getElementById("stageLikeIcon");
const stageCurrentTime = document.getElementById("stageCurrentTime");
const stageDuration = document.getElementById("stageDuration");
const stageProgressBar = document.getElementById("stageProgressBar");
const stageShuffleBtn = document.getElementById("stageShuffleBtn");
const stagePrevBtn = document.getElementById("stagePrevBtn");
const stagePlayBtn = document.getElementById("stagePlayBtn");
const stagePlayIcon = document.getElementById("stagePlayIcon");
const stageNextBtn = document.getElementById("stageNextBtn");
const stageRepeatBtn = document.getElementById("stageRepeatBtn");

// Secondary Stage Views
const stageSecondaryView = document.getElementById("stageSecondaryView");
const secondaryViewTitle = document.getElementById("secondaryViewTitle");
const secondarySongGrid = document.getElementById("secondarySongGrid");
const backToPlayerBtn = document.getElementById("backToPlayerBtn");
const secondaryAddSongBtn = document.getElementById("secondaryAddSongBtn");

// Queue Panel
const queueList = document.getElementById("queueList");
const queueEmpty = document.getElementById("queueEmpty");
const queueAddSongBtn = document.getElementById("queueAddSongBtn");
const queueEmptyAddBtn = document.getElementById("queueEmptyAddBtn");

// Bottom Player Bar
const bottomPlayerBar = document.getElementById("bottomPlayerBar");
const bottomCover = document.getElementById("bottomCover");
const bottomTitle = document.getElementById("bottomTitle");
const bottomArtist = document.getElementById("bottomArtist");
const bottomLikeBtn = document.getElementById("bottomLikeBtn");
const bottomLikeIcon = document.getElementById("bottomLikeIcon");
const bottomShuffleBtn = document.getElementById("bottomShuffleBtn");
const bottomPrevBtn = document.getElementById("bottomPrevBtn");
const bottomPlayBtn = document.getElementById("bottomPlayBtn");
const bottomPlayIcon = document.getElementById("bottomPlayIcon");
const bottomNextBtn = document.getElementById("bottomNextBtn");
const bottomRepeatBtn = document.getElementById("bottomRepeatBtn");
const bottomCurrentTime = document.getElementById("bottomCurrentTime");
const bottomDuration = document.getElementById("bottomDuration");
const bottomProgressBar = document.getElementById("bottomProgressBar");
const muteToggleBtn = document.getElementById("muteToggleBtn");
const volumeSlider = document.getElementById("volumeSlider");
const bottomThemeBtn = document.getElementById("bottomThemeBtn");

// Modals
const themePickerModal = document.getElementById("themePickerModal");
const themePickerBackdrop = document.getElementById("themePickerBackdrop");
const closeThemeModalBtn = document.getElementById("closeThemeModalBtn");
const themeSelectCards = document.querySelectorAll(".theme-select-card");
const confirmThemeBtn = document.getElementById("confirmThemeBtn");

const addSongModal = document.getElementById("addSongModal");
const addSongBackdrop = document.getElementById("addSongBackdrop");
const closeAddSongBtn = document.getElementById("closeAddSongBtn");
const cancelAddSongBtn = document.getElementById("cancelAddSongBtn");
const addSongForm = document.getElementById("addSongForm");
const newSongName = document.getElementById("newSongName");
const newSongArtist = document.getElementById("newSongArtist");
const newSongAudio = document.getElementById("newSongAudio");
const newSongBanner = document.getElementById("newSongBanner");
const audioDropLabel = document.getElementById("audioDropLabel");
const bannerDropLabel = document.getElementById("bannerDropLabel");
const coverPresetOptions = document.querySelectorAll(".cover-preset-option");

const signupModal = document.getElementById("signupModal");
const signupBackdrop = document.getElementById("signupBackdrop");
const closeSignupBtn = document.getElementById("closeSignupBtn");
const signupForm = document.getElementById("signupForm");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");
const signupMessage = document.getElementById("signupMessage");
const switchToLoginBtn = document.getElementById("switchToLoginBtn");

const loginModal = document.getElementById("loginModal");
const loginBackdrop = document.getElementById("loginBackdrop");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const switchToSignupBtn = document.getElementById("switchToSignupBtn");


// ========================================================
// 1. INDEXED DB STORAGE ENGINE (Local & Persistent)
// ========================================================

function openSongDatabase() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error("IndexedDB is not supported."));
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

function getSongsFromDatabase() {
    return openSongDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SONG_STORE_NAME, "readonly");
            const store = transaction.objectStore(SONG_STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const records = request.result || [];
                const targetUserId = currentUser ? currentUser.id : "guest";
                // Filter songs belonging to this user or guest
                const userRecords = records.filter(s => s.userId === targetUserId);
                resolve(userRecords);
            };

            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => db.close();
        });
    });
}

function saveSongToDatabase(songRecord) {
    return openSongDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SONG_STORE_NAME, "readwrite");
            const record = {
                ...songRecord,
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

function deleteSongFromDatabase(songId) {
    return openSongDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SONG_STORE_NAME, "readwrite");
            transaction.objectStore(SONG_STORE_NAME).delete(songId);

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
// 2. THEME ENGINE (Castle, Forest, Snowpeak)
// ========================================================

const THEME_CONFIG = {
    castle: {
        name: "Castle Kingdom",
        bodyClass: "theme-castle",
        emblem: "🎵",
        defaultCover: "assets/themes/cover_castle.png"
    },
    forest: {
        name: "Forest Sanctuary",
        bodyClass: "theme-forest",
        emblem: "🍃",
        defaultCover: "assets/themes/cover_forest.png"
    },
    snowpeak: {
        name: "Snowpeak Fortress",
        bodyClass: "theme-snowpeak",
        emblem: "❄️",
        defaultCover: "assets/themes/cover_snowpeak.png"
    }
};

function applyTheme(themeKey) {
    if (!THEME_CONFIG[themeKey]) themeKey = "castle";
    currentTheme = themeKey;

    document.body.className = THEME_CONFIG[themeKey].bodyClass;
    bannerEmblem.textContent = THEME_CONFIG[themeKey].emblem;
    activeThemeLabel.textContent = THEME_CONFIG[themeKey].name;

    localStorage.setItem(THEME_KEY, themeKey);
    if (currentUser) {
        currentUser.theme = themeKey;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    // Update Theme Picker selected card
    themeSelectCards.forEach(card => {
        const isMatch = card.dataset.themeId === themeKey;
        card.classList.toggle("selected", isMatch);
    });
}

function openThemePicker() {
    themePickerModal.style.display = "flex";
    themePickerModal.setAttribute("aria-hidden", "false");
}

function closeThemePicker() {
    themePickerModal.style.display = "none";
    themePickerModal.setAttribute("aria-hidden", "true");
}


// ========================================================
// 3. AUTHENTICATION & VIEWS
// ========================================================

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
    if (window.crypto?.subtle) {
        const data = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = (hash << 5) - hash + password.charCodeAt(i);
        hash |= 0;
    }
    return `hash-${Math.abs(hash)}`;
}

function setAuthMessage(element, message, isSuccess = false) {
    element.textContent = message;
    element.classList.toggle("success", isSuccess);
}

function renderAuthHeader() {
    authButtons.innerHTML = "";

    if (currentUser) {
        const namePill = document.createElement("span");
        namePill.className = "auth-user-name";
        namePill.textContent = `👑 ${currentUser.name}`;

        const logoutBtn = document.createElement("button");
        logoutBtn.className = "logout-btn";
        logoutBtn.type = "button";
        logoutBtn.textContent = "Log Out";
        logoutBtn.addEventListener("click", logoutUser);

        authButtons.appendChild(namePill);
        authButtons.appendChild(logoutBtn);
    } else {
        const signupBtn = document.createElement("button");
        signupBtn.className = "pixel-btn pixel-btn-primary pixel-btn-sm";
        signupBtn.type = "button";
        signupBtn.textContent = "Sign Up";
        signupBtn.addEventListener("click", () => openSignupModal());

        const loginBtn = document.createElement("button");
        loginBtn.className = "pixel-btn pixel-btn-ghost pixel-btn-sm";
        loginBtn.type = "button";
        loginBtn.textContent = "Log In";
        loginBtn.addEventListener("click", () => openLoginModal());

        authButtons.appendChild(signupBtn);
        authButtons.appendChild(loginBtn);
    }
}

function showLandingScreen() {
    landingScreen.style.display = "flex";
    appContainer.style.display = "none";
}

function showAppScreen() {
    landingScreen.style.display = "none";
    appContainer.style.display = "flex";
    renderAuthHeader();
    loadLikedSongs();
    refreshSongList();
}

async function loginUser(email, password) {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const hashed = await hashPassword(password);

    const user = users.find(u => u.email === cleanEmail && u.passwordHash === hashed);
    if (!user) {
        throw new Error("Invalid email or password.");
    }

    currentUser = { id: user.id, name: user.name, email: user.email, theme: user.theme || "castle" };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    applyTheme(currentUser.theme || "castle");

    closeLoginModal();
    showAppScreen();
}

async function createAccount(name, email, password) {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email === cleanEmail)) {
        throw new Error("An account with this email already exists.");
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const passwordHash = await hashPassword(password);
    const newUser = { id, name: name.trim(), email: cleanEmail, passwordHash, theme: currentTheme };

    users.push(newUser);
    saveUsers(users);

    currentUser = { id, name: newUser.name, email: cleanEmail, theme: currentTheme };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    closeSignupModal();
    showAppScreen();

    // REQUIREMENT: Immediately give 3 UI options after user signs up successfully!
    openThemePicker();
}

function logoutUser() {
    pauseAudio();
    currentUser = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    isGuestMode = false;
    currentSongIndex = -1;
    showLandingScreen();
}

// Modal open/close helpers
function openSignupModal() {
    signupForm.reset();
    setAuthMessage(signupMessage, "");
    signupModal.style.display = "flex";
    signupModal.setAttribute("aria-hidden", "false");
}
function closeSignupModal() {
    signupModal.style.display = "none";
    signupModal.setAttribute("aria-hidden", "true");
}

function openLoginModal() {
    loginForm.reset();
    setAuthMessage(loginMessage, "");
    loginModal.style.display = "flex";
    loginModal.setAttribute("aria-hidden", "false");
}
function closeLoginModal() {
    loginModal.style.display = "none";
    loginModal.setAttribute("aria-hidden", "true");
}

function openAddSongModal() {
    addSongForm.reset();
    audioDropLabel.textContent = "Choose audio file or drop here";
    bannerDropLabel.textContent = "Optional custom banner image";
    coverPresetOptions.forEach(opt => {
        opt.classList.toggle("selected", opt.querySelector("input").value === currentTheme);
        opt.querySelector("input").checked = (opt.querySelector("input").value === currentTheme);
    });
    addSongModal.style.display = "flex";
    addSongModal.setAttribute("aria-hidden", "false");
}
function closeAddSongModal() {
    addSongModal.style.display = "none";
    addSongModal.setAttribute("aria-hidden", "true");
}


// ========================================================
// 4. LIKED SONGS & PLAYLIST HELPERS
// ========================================================

function getLikedStorageKey() {
    const id = currentUser ? currentUser.id : "guest";
    return `pixelTunesLiked_${id}`;
}

function loadLikedSongs() {
    const raw = localStorage.getItem(getLikedStorageKey());
    likedSongIds = new Set(JSON.parse(raw || "[]"));
    likedCount.textContent = likedSongIds.size;
}

function toggleLikeCurrentSong() {
    if (currentSongIndex < 0 || currentSongIndex >= songs.length) return;
    const song = songs[currentSongIndex];
    if (likedSongIds.has(song.id)) {
        likedSongIds.delete(song.id);
    } else {
        likedSongIds.add(song.id);
    }
    localStorage.setItem(getLikedStorageKey(), JSON.stringify([...likedSongIds]));
    likedCount.textContent = likedSongIds.size;
    updateLikeButtonUI();
}

function updateLikeButtonUI() {
    if (currentSongIndex < 0 || currentSongIndex >= songs.length) {
        stageLikeBtn.classList.remove("liked");
        stageLikeIcon.textContent = "🤍";
        bottomLikeBtn.classList.remove("liked");
        bottomLikeIcon.textContent = "🤍";
        return;
    }
    const song = songs[currentSongIndex];
    const isLiked = likedSongIds.has(song.id);
    stageLikeBtn.classList.toggle("liked", isLiked);
    stageLikeIcon.textContent = isLiked ? "💜" : "🤍";
    bottomLikeBtn.classList.toggle("liked", isLiked);
    bottomLikeIcon.textContent = isLiked ? "💜" : "🤍";
}


// ========================================================
// 5. SONG REFRESH & QUEUE RENDERING
// ========================================================

async function refreshSongList() {
    try {
        const rawSongs = await getSongsFromDatabase();

        songs = rawSongs.map(song => {
            // Manage audio blob object URL
            let audioUrl = objectUrlCache.get(`audio-${song.id}`);
            if (!audioUrl && song.audioBlob) {
                audioUrl = URL.createObjectURL(song.audioBlob);
                objectUrlCache.set(`audio-${song.id}`, audioUrl);
            }

            // Manage poster cover
            let posterUrl = objectUrlCache.get(`poster-${song.id}`);
            if (!posterUrl) {
                if (song.posterBlob) {
                    posterUrl = URL.createObjectURL(song.posterBlob);
                    objectUrlCache.set(`poster-${song.id}`, posterUrl);
                } else if (song.posterPreset && THEME_CONFIG[song.posterPreset]) {
                    posterUrl = THEME_CONFIG[song.posterPreset].defaultCover;
                } else {
                    posterUrl = THEME_CONFIG[currentTheme].defaultCover;
                }
            }

            return {
                id: song.id,
                title: song.title || "Untitled Melody",
                artist: song.artist || "Azure Beats",
                src: audioUrl,
                poster: posterUrl,
                duration: song.duration || "3:00"
            };
        });

        libraryCount.textContent = songs.length;
        applySearchFilter();
    } catch (err) {
        console.error("Could not refresh songs:", err);
    }
}

function applySearchFilter() {
    const term = (searchInput.value || "").trim().toLowerCase();
    clearSearchBtn.style.display = term ? "block" : "none";

    if (!term) {
        filteredSongs = [...songs];
    } else {
        filteredSongs = songs.filter(s =>
            s.title.toLowerCase().includes(term) ||
            s.artist.toLowerCase().includes(term)
        );
    }

    renderQueue();
    updateStageEmptyOrPlaying();
}

function updateStageEmptyOrPlaying() {
    if (songs.length === 0) {
        // App has 0 songs -> Showcase "Choose your Nirvana"
        nirvanaEmptyState.style.display = "flex";
        nowPlayingCard.style.display = "none";
        bottomTitle.textContent = "Choose your Nirvana";
        bottomArtist.textContent = "Add your first song";
        bottomCover.src = THEME_CONFIG[currentTheme].defaultCover;
        bottomPlayBtn.style.opacity = "0.5";
    } else {
        nirvanaEmptyState.style.display = "none";
        nowPlayingCard.style.display = "flex";
        bottomPlayBtn.style.opacity = "1";

        if (currentSongIndex === -1 && songs.length > 0) {
            loadSong(0, false);
        }
    }
}

function renderQueue() {
    queueList.innerHTML = "";

    if (filteredSongs.length === 0) {
        queueEmpty.style.display = "flex";
        return;
    }
    queueEmpty.style.display = "none";

    filteredSongs.forEach((song, idx) => {
        const originalIndex = songs.findIndex(s => s.id === song.id);
        const isActive = originalIndex === currentSongIndex;

        const row = document.createElement("div");
        row.className = `queue-item ${isActive ? "active" : ""}`;

        // Equalizer animation if playing this track
        const eqHtml = (isActive && isPlaying)
            ? `<div class="queue-eq-bars"><span></span><span></span><span></span></div>`
            : "";

        row.innerHTML = `
            <img src="${song.poster}" alt="Cover" class="queue-item-thumb">
            <div class="queue-item-info">
                <div class="queue-item-title">${song.title}</div>
                <div class="queue-item-artist">${song.artist}</div>
            </div>
            ${eqHtml}
            <div class="queue-item-actions">
                <button class="queue-action-btn queue-play-btn" type="button" title="Play">
                    ${isActive && isPlaying ? "⏸" : "▶"}
                </button>
                <button class="queue-action-btn queue-delete-btn" type="button" title="Delete">
                    🗑
                </button>
            </div>
        `;

        // Dedicated single-purpose buttons on row:
        const playBtn = row.querySelector(".queue-play-btn");
        playBtn.addEventListener("click", e => {
            e.stopPropagation();
            if (isActive) {
                togglePlayPause();
            } else {
                loadSong(originalIndex, true);
            }
        });

        const deleteBtn = row.querySelector(".queue-delete-btn");
        deleteBtn.addEventListener("click", async e => {
            e.stopPropagation();
            if (confirm(`Remove "${song.title}" from your kingdom?`)) {
                await deleteSong(song.id);
            }
        });

        row.addEventListener("click", () => {
            loadSong(originalIndex, true);
        });

        queueList.appendChild(row);
    });
}


// ========================================================
// 6. AUDIO PLAYBACK ENGINE
// ========================================================

function loadSong(index, autoPlay = true) {
    if (index < 0 || index >= songs.length) return;
    currentSongIndex = index;
    const song = songs[currentSongIndex];

    audioPlayer.src = song.src;
    audioPlayer.load();

    // Update UI elements
    stageAlbumArt.src = song.poster;
    stageTrackTitle.textContent = song.title;
    stageTrackArtist.textContent = song.artist;

    bottomCover.src = song.poster;
    bottomTitle.textContent = song.title;
    bottomArtist.textContent = song.artist;

    stageProgressBar.value = 0;
    bottomProgressBar.value = 0;
    stageCurrentTime.textContent = "0:00";
    bottomCurrentTime.textContent = "0:00";

    updateLikeButtonUI();
    renderQueue();

    if (autoPlay) {
        playAudio();
    } else {
        pauseAudio();
    }
}

function playAudio() {
    if (currentSongIndex === -1 && songs.length > 0) {
        loadSong(0, true);
        return;
    }
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayIcons(true);
        renderQueue();
    }).catch(err => {
        console.warn("Autoplay blocked or playback error:", err);
        isPlaying = false;
        updatePlayIcons(false);
    });
}

function pauseAudio() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayIcons(false);
    renderQueue();
}

function togglePlayPause() {
    if (songs.length === 0) {
        openAddSongModal();
        return;
    }
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function updatePlayIcons(playing) {
    stagePlayIcon.textContent = playing ? "⏸" : "▶";
    bottomPlayIcon.textContent = playing ? "⏸" : "▶";
}

function playNextSong() {
    if (songs.length === 0) return;
    if (isShuffle) {
        const nextIndex = Math.floor(Math.random() * songs.length);
        loadSong(nextIndex, true);
        return;
    }
    const nextIndex = (currentSongIndex + 1) % songs.length;
    loadSong(nextIndex, true);
}

function playPrevSong() {
    if (songs.length === 0) return;
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(prevIndex, true);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    stageShuffleBtn.classList.toggle("active", isShuffle);
    bottomShuffleBtn.classList.toggle("active", isShuffle);
}

function toggleRepeat() {
    if (repeatMode === "none") {
        repeatMode = "all";
        stageRepeatBtn.classList.add("active");
        bottomRepeatBtn.classList.add("active");
        stageRepeatBtn.title = "Repeat: All";
        bottomRepeatBtn.title = "Repeat: All";
    } else if (repeatMode === "all") {
        repeatMode = "one";
        stageRepeatBtn.classList.add("active");
        bottomRepeatBtn.classList.add("active");
        stageRepeatBtn.title = "Repeat: One";
        bottomRepeatBtn.title = "Repeat: One";
    } else {
        repeatMode = "none";
        stageRepeatBtn.classList.remove("active");
        bottomRepeatBtn.classList.remove("active");
        stageRepeatBtn.title = "Repeat: Off";
        bottomRepeatBtn.title = "Repeat: Off";
    }
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Audio Player Events
audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) return;
    const current = audioPlayer.currentTime;
    const total = audioPlayer.duration;
    const percent = (current / total) * 100;

    stageProgressBar.value = percent;
    bottomProgressBar.value = percent;
    stageCurrentTime.textContent = formatTime(current);
    bottomCurrentTime.textContent = formatTime(current);
});

audioPlayer.addEventListener("loadedmetadata", () => {
    const total = audioPlayer.duration;
    stageDuration.textContent = formatTime(total);
    bottomDuration.textContent = formatTime(total);
});

audioPlayer.addEventListener("ended", () => {
    if (repeatMode === "one") {
        audioPlayer.currentTime = 0;
        playAudio();
    } else if (repeatMode === "all" || currentSongIndex < songs.length - 1) {
        playNextSong();
    } else {
        pauseAudio();
    }
});

// Seek Sliders
function handleSeek(e) {
    if (!audioPlayer.duration) return;
    const seekPercent = e.target.value;
    audioPlayer.currentTime = (seekPercent / 100) * audioPlayer.duration;
}
stageProgressBar.addEventListener("input", handleSeek);
bottomProgressBar.addEventListener("input", handleSeek);

// Volume Controls
volumeSlider.addEventListener("input", e => {
    const val = e.target.value / 100;
    audioPlayer.volume = val;
    audioPlayer.muted = false;
    muteToggleBtn.textContent = val === 0 ? "🔇" : val > 0.5 ? "🔊" : "🔉";
});

muteToggleBtn.addEventListener("click", () => {
    audioPlayer.muted = !audioPlayer.muted;
    muteToggleBtn.textContent = audioPlayer.muted ? "🔇" : "🔊";
});

async function deleteSong(songId) {
    await deleteSongFromDatabase(songId);
    if (currentSongIndex >= 0 && songs[currentSongIndex]?.id === songId) {
        pauseAudio();
        currentSongIndex = -1;
    }
    await refreshSongList();
}


// ========================================================
// 7. ADD SONG MODAL & FILE HANDLING
// ========================================================

// Cover Preset Selection
coverPresetOptions.forEach(opt => {
    opt.addEventListener("click", () => {
        coverPresetOptions.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        opt.querySelector("input").checked = true;
    });
});

newSongAudio.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
        audioDropLabel.textContent = `Selected: ${file.name}`;
        if (!newSongName.value) {
            // Auto fill song name from filename (stripping extension)
            const clean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            newSongName.value = clean.charAt(0).toUpperCase() + clean.slice(1);
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

    const title = newSongName.value.trim();
    const artist = newSongArtist.value.trim() || "Azure Beats";
    const audioFile = newSongAudio.files[0];
    const bannerFile = newSongBanner.files[0];
    const selectedPreset = document.querySelector('input[name="coverPreset"]:checked')?.value || currentTheme;

    if (!title || !audioFile) {
        alert("Please provide a title and audio file.");
        return;
    }

    const songRecord = {
        id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        artist,
        audioBlob: audioFile,
        posterBlob: bannerFile || null,
        posterPreset: selectedPreset,
        createdAt: Date.now()
    };

    try {
        await saveSongToDatabase(songRecord);
        closeAddSongModal();
        await refreshSongList();

        // Immediately load and play the newly added song!
        const newIndex = songs.findIndex(s => s.id === songRecord.id);
        if (newIndex >= 0) {
            loadSong(newIndex, true);
        }
    } catch (err) {
        console.error("Could not add song:", err);
        alert("Failed to save song to kingdom.");
    }
});

// Drag & drop support on Nirvana Dropzone
function handleDragOver(e) {
    e.preventDefault();
    nirvanaDropzone.classList.add("drag-over");
}
function handleDragLeave() {
    nirvanaDropzone.classList.remove("drag-over");
}
function handleDrop(e) {
    e.preventDefault();
    nirvanaDropzone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
        openAddSongModal();
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        newSongAudio.files = dataTransfer.files;
        audioDropLabel.textContent = `Selected: ${file.name}`;
        const clean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        newSongName.value = clean.charAt(0).toUpperCase() + clean.slice(1);
    }
}

nirvanaDropzone.addEventListener("dragover", handleDragOver);
nirvanaDropzone.addEventListener("dragleave", handleDragLeave);
nirvanaDropzone.addEventListener("drop", handleDrop);


// ========================================================
// 8. EVENT LISTENERS (Strict Single-Purpose Actions)
// ========================================================

// Landing Nav / Hero Buttons
landingSignupNavBtn.addEventListener("click", openSignupModal);
landingLoginNavBtn.addEventListener("click", openLoginModal);
heroSignupBtn.addEventListener("click", openSignupModal);
heroLoginBtn.addEventListener("click", openLoginModal);
heroExploreBtn.addEventListener("click", () => {
    isGuestMode = true;
    showAppScreen();
});

// Floating UI Cards on Landing Screen: Click to preview theme & enter
floatingCards.forEach(card => {
    card.addEventListener("click", () => {
        const theme = card.dataset.targetTheme;
        applyTheme(theme);
        isGuestMode = true;
        showAppScreen();
    });
});

// Search Filter
searchInput.addEventListener("input", applySearchFilter);
clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    applySearchFilter();
    searchInput.focus();
});

// Single-purpose Play/Pause Buttons
stagePlayBtn.addEventListener("click", togglePlayPause);
bottomPlayBtn.addEventListener("click", togglePlayPause);

// Single-purpose Next/Prev Buttons
stageNextBtn.addEventListener("click", playNextSong);
bottomNextBtn.addEventListener("click", playNextSong);
stagePrevBtn.addEventListener("click", playPrevSong);
bottomPrevBtn.addEventListener("click", playPrevSong);

// Single-purpose Shuffle & Repeat Buttons
stageShuffleBtn.addEventListener("click", toggleShuffle);
bottomShuffleBtn.addEventListener("click", toggleShuffle);
stageRepeatBtn.addEventListener("click", toggleRepeat);
bottomRepeatBtn.addEventListener("click", toggleRepeat);

// Single-purpose Like Buttons
stageLikeBtn.addEventListener("click", toggleLikeCurrentSong);
bottomLikeBtn.addEventListener("click", toggleLikeCurrentSong);

// Dedicated Add Song Openers
nirvanaAddBtn.addEventListener("click", openAddSongModal);
sidebarAddSongBtn.addEventListener("click", openAddSongModal);
queueAddSongBtn.addEventListener("click", openAddSongModal);
queueEmptyAddBtn.addEventListener("click", openAddSongModal);
secondaryAddSongBtn.addEventListener("click", openAddSongModal);

// Theme Switcher Buttons
openThemePickerBtn.addEventListener("click", openThemePicker);
bottomThemeBtn.addEventListener("click", openThemePicker);
closeThemeModalBtn.addEventListener("click", closeThemePicker);
themePickerBackdrop.addEventListener("click", closeThemePicker);

// Theme Selection Cards inside Modal
themeSelectCards.forEach(card => {
    card.addEventListener("click", () => {
        const themeId = card.dataset.themeId;
        applyTheme(themeId);
    });
});

confirmThemeBtn.addEventListener("click", () => {
    closeThemePicker();
});

// Add Song Modal Closer
closeAddSongBtn.addEventListener("click", closeAddSongModal);
cancelAddSongBtn.addEventListener("click", closeAddSongModal);
addSongBackdrop.addEventListener("click", closeAddSongModal);

// Auth Modal Controls
closeSignupBtn.addEventListener("click", closeSignupModal);
signupBackdrop.addEventListener("click", closeSignupModal);
switchToLoginBtn.addEventListener("click", () => {
    closeSignupModal();
    openLoginModal();
});

closeLoginBtn.addEventListener("click", closeLoginModal);
loginBackdrop.addEventListener("click", closeLoginModal);
switchToSignupBtn.addEventListener("click", () => {
    closeLoginModal();
    openSignupModal();
});

signupForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (signupPassword.value !== signupConfirmPassword.value) {
        setAuthMessage(signupMessage, "Passwords do not match.");
        return;
    }
    try {
        await createAccount(signupName.value, signupEmail.value, signupPassword.value);
    } catch (err) {
        setAuthMessage(signupMessage, err.message);
    }
});

loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    try {
        await loginUser(loginEmail.value, loginPassword.value);
    } catch (err) {
        setAuthMessage(loginMessage, err.message);
    }
});

// Sidebar Navigation
navHome.addEventListener("click", () => {
    stageSecondaryView.style.display = "none";
    setActiveNavItem(navHome);
    applySearchFilter();
});

navExplore.addEventListener("click", () => {
    showSecondaryGrid("Explore Realms & Anthems", songs);
    setActiveNavItem(navExplore);
});

navLibrary.addEventListener("click", () => {
    showSecondaryGrid("Your Library", songs);
    setActiveNavItem(navLibrary);
});

navPlaylists.addEventListener("click", () => {
    showSecondaryGrid("Playlists", songs);
    setActiveNavItem(navPlaylists);
});

navLiked.addEventListener("click", () => {
    const likedList = songs.filter(s => likedSongIds.has(s.id));
    showSecondaryGrid("Liked Songs", likedList);
    setActiveNavItem(navLiked);
});

backToPlayerBtn.addEventListener("click", () => {
    stageSecondaryView.style.display = "none";
    setActiveNavItem(navHome);
});

function setActiveNavItem(activeBtn) {
    [navHome, navExplore, navLibrary, navPlaylists, navLiked].forEach(btn => {
        btn.classList.toggle("active", btn === activeBtn);
    });
}

function showSecondaryGrid(title, songArray) {
    stageSecondaryView.style.display = "block";
    secondaryViewTitle.textContent = title;
    secondarySongGrid.innerHTML = "";

    if (songArray.length === 0) {
        secondarySongGrid.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">No tracks found in this category.</p>`;
        return;
    }

    songArray.forEach(song => {
        const card = document.createElement("div");
        card.className = "grid-song-card";
        card.innerHTML = `
            <img src="${song.poster}" alt="Cover" class="grid-song-thumb">
            <div class="grid-song-title">${song.title}</div>
            <div class="grid-song-artist">${song.artist}</div>
        `;
        card.addEventListener("click", () => {
            const origIndex = songs.findIndex(s => s.id === song.id);
            if (origIndex >= 0) {
                stageSecondaryView.style.display = "none";
                setActiveNavItem(navHome);
                loadSong(origIndex, true);
            }
        });
        secondarySongGrid.appendChild(card);
    });
}


// ========================================================
// 9. RETRO CANVAS STARFIELD (Landing Page)
// ========================================================

function initStarfield() {
    if (!starfieldCanvas) return;
    const ctx = starfieldCanvas.getContext("2d");
    let width = (starfieldCanvas.width = window.innerWidth);
    let height = (starfieldCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = starfieldCanvas.width = window.innerWidth;
        height = starfieldCanvas.height = window.innerHeight;
    });

    const stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() > 0.7 ? 3 : 2,
        color: ["#ffd166", "#ffffff", "#48c774", "#00d2ff"][Math.floor(Math.random() * 4)],
        speed: 0.2 + Math.random() * 0.4
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(s => {
            ctx.fillStyle = s.color;
            ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
            s.y += s.speed;
            if (s.y > height) {
                s.y = 0;
                s.x = Math.random() * width;
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}


// ========================================================
// 10. INITIALIZATION
// ========================================================

function init() {
    initStarfield();
    applyTheme(currentUser ? (currentUser.theme || currentTheme) : currentTheme);

    if (currentUser) {
        showAppScreen();
    } else {
        showLandingScreen();
    }
}

init();
