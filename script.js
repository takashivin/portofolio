function copyToClipboard(ip, port = '') {
    const textToCopy = port ? `${ip}:${port}` : ip;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 2000);
    });
}

function calculateAge() {
    const encodedDate = "MjAxMi0wMy0wNQ==";
    const birthDate = new Date(atob(encodedDate));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) { age--; }

    if (isNaN(age)) {
        document.getElementById('age-text').innerText = 'N/A tahun';
    } else {
        document.getElementById('age-text').innerText = age + ' tahun';
    }
}
calculateAge();

const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    sidebar.classList.toggle('active'); 
    menuBtn.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target)) {
        sidebar.classList.remove('active'); 
        menuBtn.classList.remove('active');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active'); 
        menuBtn.classList.remove('active');
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('show'); }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -30px 0px" });

document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

const triggerCtscan = document.getElementById('trigger-ctscan');
const imageModal = document.getElementById('imageModal');
const closeModal = document.getElementById('closeModal');
const ctscanImg = document.getElementById('ctscan-img');
const loadingText = document.getElementById('loadingText');

ctscanImg.classList.add('drm-protected');

triggerCtscan.addEventListener('click', () => {
    imageModal.classList.add('active');
    
    if (!ctscanImg.getAttribute('src')) {
        ctscanImg.src = ctscanBase64;
        
        ctscanImg.onload = () => { 
            loadingText.style.display = 'none'; 
            ctscanImg.style.display = 'block'; 
        };
    }
});

const hideModal = () => { imageModal.classList.remove('active'); };

closeModal.addEventListener('click', hideModal);

imageModal.addEventListener('click', (e) => { 
    if (e.target === imageModal) hideModal(); 
});

imageModal.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

window.addEventListener('blur', () => {
    if (imageModal.classList.contains('active') && ctscanImg.style.display === 'block') {
        ctscanImg.classList.add('drm-blur');
    }
});

window.addEventListener('focus', () => {
    ctscanImg.classList.remove('drm-blur');
});

document.addEventListener('keydown', (e) => {
    if (imageModal.classList.contains('active')) {
        if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'p')) {
            e.preventDefault();
        }
        if (e.key === 'Escape') {
            hideModal();
        }
    }
});

async function fetchServerStatus() {
    const javaIP = 'relations-webmaster.gl.joinmc.link';
    const bedrockIP = 'relations-webmaster.gl.at.ply.gg';
    const bedrockPort = '51633';

    const javaStatus = document.getElementById('java-status');
    const javaDot = document.getElementById('java-dot');
    const javaText = document.getElementById('java-text');
    
    const bedrockStatus = document.getElementById('bedrock-status');
    const bedrockDot = document.getElementById('bedrock-dot');
    const bedrockText = document.getElementById('bedrock-text');

    const playerText = document.getElementById('mc-players');
    const versionText = document.getElementById('mc-version');

    let isJavaOnline = false;
    let isBedrockOnline = false;
    let currentPlayers = 0;
    let maxPlayers = 0;
    let serverVersion = 'Crossplay 1.20+';

    try {
        const resJava = await fetch(`https://api.mcstatus.io/v2/status/java/${javaIP}`);
        const dataJava = await resJava.json();
        
        if (dataJava.online) {
            isJavaOnline = true;
            javaStatus.className = 'mini-status online';
            javaDot.className = 'status-dot online';
            javaText.innerText = 'Online';
            
            currentPlayers = dataJava.players.online;
            maxPlayers = dataJava.players.max;
            if (dataJava.version) serverVersion = dataJava.version.name_raw;
        } else {
            javaStatus.className = 'mini-status offline';
            javaDot.className = 'status-dot offline';
            javaText.innerText = 'Offline';
        }
    } catch (error) {
        javaStatus.className = 'mini-status offline';
        javaDot.className = 'status-dot offline';
        javaText.innerText = 'Offline';
    }

    try {
        const resBedrock = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${bedrockIP}:${bedrockPort}`);
        const dataBedrock = await resBedrock.json();
        
        if (dataBedrock.online) {
            isBedrockOnline = true;
            bedrockStatus.className = 'mini-status online';
            bedrockDot.className = 'status-dot online';
            bedrockText.innerText = 'Online';
            
            if (!isJavaOnline) {
                currentPlayers = dataBedrock.players.online;
                maxPlayers = dataBedrock.players.max;
                if (dataBedrock.version) serverVersion = dataBedrock.version.name;
            }
        } 
    } catch (error) {
    }

    if (!isBedrockOnline && isJavaOnline) {
        bedrockStatus.className = 'mini-status online';
        bedrockDot.className = 'status-dot online';
        bedrockText.innerText = 'Online';
        isBedrockOnline = true;
    } else if (!isBedrockOnline && !isJavaOnline) {
        bedrockStatus.className = 'mini-status offline';
        bedrockDot.className = 'status-dot offline';
        bedrockText.innerText = 'Offline';
    }

    if (isJavaOnline || isBedrockOnline) {
        playerText.innerText = `${currentPlayers}/${maxPlayers}`;
        versionText.innerText = serverVersion;
    } else {
        playerText.innerText = '-';
        versionText.innerText = '-';
    }
}

async function refreshManual() {
    const btn = document.getElementById('refreshBtn');
    const icon = document.getElementById('refreshIcon');
    
    btn.disabled = true;
    icon.classList.add('spin-anim');

    await fetchServerStatus();

    setTimeout(() => {
        icon.classList.remove('spin-anim');
        btn.disabled = false;
    }, 600);
}

fetchServerStatus();
setInterval(fetchServerStatus, 15000);
