// 核心元素获取
const audioPlayer = document.getElementById('audioPlayer');
const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('before-music');
const nextBtn = document.getElementById('last-music');
const progressBar = document.getElementById('progressBar');
const progressWrap = document.getElementById('progressWrap');
const currentTimeEl = document.getElementById('currentTime');
const volumnTogger = document.getElementById('volumn-togger');
const volumnBtn = document.getElementById('volumn');
const playModeBtn = document.getElementById('playMode');
const listBtn = document.getElementById('list');
const musicListEl = document.getElementById('musicList');
const listContainer = document.getElementById('listContainer');
const mvBtn = document.getElementById('MV');
const mvPlayerEl = document.getElementById('mvPlayer');
const closeMvBtn = document.getElementById('closeMv');
const speedEl = document.getElementById('speed');
const recordImg = document.getElementById('recordImg');
const musicTitleEl = document.getElementById('musicTitle');
const musicAuthorEl = document.getElementById('musicAuthor');

const musicResources = [
    {
        id: 0,
        title: "耀斑",
        author: "HOYO-MiX/YMIR",
        mp3: "./mp3/HOYO-MiX _ YMIR - 耀斑.mp3",
        mp4: "./mp4/耀斑.mp4",
        cover: "./img/record_0.jpg",
        bg: "./img/bg_0.png"
    },
    {
        id: 1,
        title: "轻涟 La vaguelette",
        author: "HOYO-MiX",
        mp3: "./mp3/HOYO-MiX - 轻涟 La vaguelette.mp3",
        mp4: "./mp4/轻涟 La vaguelette.mp4",
        cover: "./img/record_1.jpg",
        bg: "./img/bg_1.jpg"
    },
    {
        id: 2,
        title: "切り咲く",
        author: "鸣潮先约电台/幸祜",
        mp3: "./mp3/鸣潮先约电台__ 幸祜 - 切り咲く.mp3",
        mp4: "./mp4/切り咲く.mp4",
        cover: "./img/record_2.jpg",
        bg: "./img/bg_2.jpg"
    },
    {
        id: 3,
        title: "夜空ノ雪",
        author: "雪姬",
        mp3: "./mp3/music3.mp3",
        mp4: "./mp4/video3.mp4",
        cover: "./img/record3.jpg",
        bg: "./img/bg3.png"
    },
];

// 全局状态
let currentIndex = 0; // 当前播放索引
let isPlaying = false; // 播放状态
let playMode = 0; // 0-顺序，1-单曲循环，2-随机
let isMuted = false; // 静音状态

// 页面初始化
function initPage() {
    renderMusicList(); // 渲染播放列表
    loadMusic(currentIndex); // 加载默认歌曲
    bindEvents(); // 绑定所有事件
    // 初始化音量显示
    audioPlayer.volume = volumnTogger.value / 100;
    isMuted = audioPlayer.volume === 0;
    volumnBtn.style.backgroundImage = isMuted ? "url('./img/静音.png')" : "url('./img/音量.png')";
    injectRotateAnimation(); // 注入黑胶片旋转动画
}

// 渲染播放列表
function renderMusicList() {
    listContainer.innerHTML = '';
    musicResources.forEach((music, index) => {
        const li = document.createElement('li');
        li.style.padding = '8px 0';
        li.style.borderBottom = '1px solid rgba(255,255,255,0.2)';
        li.style.cursor = 'pointer';
        li.style.opacity = index === currentIndex ? '1' : '0.7';
        li.style.transition = 'opacity 0.3s';
        li.innerHTML = `
            <span>${music.title}</span> - 
            <span style="font-size: 0.8rem; opacity: 0.8;">${music.author}</span>
        `;
        li.addEventListener('click', () => {
            currentIndex = index;
            loadMusic(currentIndex);
            playMusic();
            musicListEl.style.display = 'none';
        });
        listContainer.appendChild(li);
    });
}

// 加载音乐（切换歌曲时更新封面、背景、标题）
function loadMusic(index) {
    const music = musicResources[index];
    if (!music) return;

    // 更新音频源
    audioPlayer.src = music.mp3;
    // 确保浏览器加载新的元数据
    audioPlayer.load();
    // 更新页面信息
    musicTitleEl.textContent = music.title;
    musicAuthorEl.textContent = music.author;
    // 更新黑胶片封面
    recordImg.style.backgroundImage = `url('${music.cover}')`;
    document.getElementById('blur-bg').style.backgroundImage = `url('${music.bg}')`;
    // 重置进度条
    progressBar.style.width = '0%';
    // 更新列表选中状态
    updateListSelectedStyle();
}

// 播放音乐
function playMusic() {
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.style.backgroundImage = "url('./img/暂停.png')";
    recordImg.style.animation = "rotate 8s linear infinite"; // 启动旋转
}

// 暂停音乐
function pauseMusic() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.style.backgroundImage = "url('./img/继续播放.png')";
    recordImg.style.animation = "none"; // 停止旋转
}

// 切换播放/暂停
function togglePlayPause() {
    isPlaying ? pauseMusic() : playMusic();
}

// 上一曲
function prevMusic() {
    currentIndex = (currentIndex - 1 + musicResources.length) % musicResources.length;
    loadMusic(currentIndex);
    playMusic();
}

// 下一曲
function nextMusic() {
    if (playMode === 2) { // 随机播放
        currentIndex = Math.floor(Math.random() * musicResources.length);
    } else { // 顺序/单曲循环
        currentIndex = (currentIndex + 1) % musicResources.length;
    }
    loadMusic(currentIndex);
    playMusic();
}

// 切换播放模式
function togglePlayMode() {
    playMode = (playMode + 1) % 3;
    switch(playMode) {
        case 0:
            playModeBtn.style.backgroundImage = "url('./img/mode1.png')";
            break;
        case 1:
            playModeBtn.style.backgroundImage = "url('./img/mode2.png')";
            break;
        case 2:
            playModeBtn.style.backgroundImage = "url('./img/mode3.png')";
            break;
    }
}

// 调整音量
function adjustVolumn() {
    audioPlayer.volume = volumnTogger.value / 100;
    isMuted = audioPlayer.volume === 0;
    // 更新音量图标
    volumnBtn.style.backgroundImage = isMuted ? "url('./img/静音.png')" : "url('./img/音量.png')";
}

// 切换静音
function toggleMute() {
    isMuted = !isMuted;
    audioPlayer.muted = isMuted;
    volumnTogger.value = isMuted ? 0 : 80;
    volumnBtn.style.backgroundImage = isMuted ? "url('./img/静音.png')" : "url('./img/音量.png')";
}

// 进度条跳转（满足实验要求：跳转到指定时间播放）
function seekProgress(e) {
    const rect = progressWrap.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    let seekRatio = clickX / progressWidth;
    if (seekRatio < 0) seekRatio = 0;
    if (seekRatio > 1) seekRatio = 1;
    if (audioPlayer.duration && isFinite(audioPlayer.duration)) {
        audioPlayer.currentTime = seekRatio * audioPlayer.duration;
    }
    progressBar.style.width = `${seekRatio * 100}%`;
}

// 播放MV
function playMV() {
    const currentMusic = musicResources[currentIndex];
    videoPlayer.src = currentMusic.mp4;
    mvPlayerEl.style.display = 'block';
    videoPlayer.play();
}

// 关闭MV
function closeMV() {
    mvPlayerEl.style.display = 'none';
    videoPlayer.pause();
    videoPlayer.src = '';
}

// 调整播放速度
function togglePlaySpeed() {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentSpeedIndex = speeds.indexOf(audioPlayer.playbackRate);
    const nextSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
    audioPlayer.playbackRate = speeds[nextSpeedIndex];
    speedEl.textContent = `${speeds[nextSpeedIndex]}x`;
}

// 更新列表选中样式
function updateListSelectedStyle() {
    const lis = listContainer.querySelectorAll('li');
    lis.forEach((li, index) => {
        li.style.opacity = index === currentIndex ? '1' : '0.7';
    });
}

// 注入黑胶片旋转动画（CSS3技术，满足实验要求）
function injectRotateAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// 绑定所有事件
function bindEvents() {
    // 核心控制事件
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevMusic);
    nextBtn.addEventListener('click', nextMusic);
    // 进度条事件
    progressWrap.addEventListener('click', seekProgress);
    // 音量事件
    volumnTogger.addEventListener('input', adjustVolumn);
    const volumnBtn = document.getElementById('volumn');
    volumnBtn.addEventListener('click', toggleMute);
    // 播放模式事件
    playModeBtn.addEventListener('click', togglePlayMode);
    // 播放列表事件
    listBtn.addEventListener('click', () => {
        musicListEl.style.display = musicListEl.style.display === 'block' ? 'none' : 'block';
    });
    // MV事件
    mvBtn.addEventListener('click', playMV);
    closeMvBtn.addEventListener('click', closeMV);
    // 播放速度事件
    speedEl.addEventListener('click', togglePlaySpeed);
    // 音频进度更新事件
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration && isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
            const progressRatio = audioPlayer.currentTime / audioPlayer.duration;
            progressBar.style.width = `${progressRatio * 100}%`;
        }
        // 更新当前时间显示（当前时间总是可用）
        const minutes = Math.floor(audioPlayer.currentTime / 60);
        const seconds = Math.floor(audioPlayer.currentTime % 60);
        currentTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });
    // 音频播放结束事件
    audioPlayer.addEventListener('ended', () => {
        if (playMode === 1) { // 单曲循环
            audioPlayer.currentTime = 0;
            playMusic();
        } else { // 顺序/随机播放
            nextMusic();
        }
    });
}

// 页面加载完成后初始化
window.onload = initPage;