const initialRolesData = {
    landlord: {
        title: '임대인 가이드',
        menu: [
            {
                category: '기본 가이드',
                items: [{ id: 'landlord-intro', title: '시작하기' }]
            },
            {
                category: '주요 메뉴 사용법',
                items: [
                    { id: 'building-mgmt', title: '건물 및 호수 관리' },
                    { id: 'contract-mgmt', title: '계약 관리' },
                    { id: 'tenant-info', title: '세입자 정보' },
                    { id: 'messaging', title: '메시지 전송' },
                    { id: 'payments', title: '납부 관리' }
                ]
            }
        ],
        guides: {
            'landlord-intro': {
                title: '시작하기',
                content: '# 임대인 가이드 시작하기\n본 문서는 임대인을 위한 통합 솔루션 가이드입니다.',
                toc: []
            },
            'building-mgmt': {
                title: '건물 및 호수 관리',
                content: '# 건물 및 호수 관리\n건물과 호수를 효율적으로 관리하는 방법입니다.',
                toc: []
            },
            'contract-mgmt': {
                title: '계약 관리',
                content: '# 계약 관리\n임대차 계약을 관리하고 추적하는 방법입니다.',
                toc: []
            },
            'tenant-info': {
                title: '세입자 정보',
                content: '# 세입자 정보\n세입자의 연락처 및 입주 정보를 확인합니다.',
                toc: []
            },
            'messaging': {
                title: '메시지 전송',
                content: '# 메시지 전송\n세입자에게 메시지를 보내는 방법입니다.',
                toc: []
            },
            'payments': {
                title: '납부 관리',
                content: '# 납부 관리\n임대료 납부 및 미납 상세 관리 방법입니다.',
                toc: []
            }
        }
    },
    tenant: {
        title: '세입자 가이드',
        menu: [
            {
                category: '기초 안내',
                items: [{ id: 'tenant-intro', title: '서비스 안내' }]
            }
        ],
        guides: {
            'tenant-intro': {
                title: '서비스 안내',
                content: '# 세입자 가이드 시작하기\n임차인을 위한 서비스 이용 안내입니다.',
                toc: []
            }
        }
    },
    developer: {
        title: '개발자 일기',
        menu: [
            {
                category: 'API Reference',
                items: [{ id: 'api-intro', title: 'API 시작하기' }]
            }
        ],
        guides: {
            'api-intro': {
                title: 'API 시작하기',
                content: '# 개발자 가이드\nAPI 연동 및 시스템 개발을 위한 문서입니다.',
                toc: []
            }
        }
    },
    partner: {
        title: '파트너 매뉴얼',
        menu: [
            {
                category: '협력사 안내',
                items: [{ id: 'partner-intro', title: '파트너십 개요' }]
            }
        ],
        guides: {
            'partner-intro': {
                title: '파트너십 개요',
                content: '# 파트너 가이드\n협력사분들을 위한 매뉴얼입니다.',
                toc: []
            }
        }
    }
};

let rolesData = JSON.parse(JSON.stringify(initialRolesData));
let menuStructure = rolesData.landlord.menu;
let guideData = rolesData.landlord.guides;
let mediaAssets = [];

const editControls = document.getElementById('edit-controls');
const editBtn = document.getElementById('edit-btn');
const docContentDisplay = document.getElementById('doc-content-display');
const editorContainer = document.getElementById('editor-container');
const contentEditor = document.getElementById('content-editor');
const editorPreview = document.getElementById('editor-preview');
const previewToggleBtn = document.getElementById('preview-toggle');
const cancelEditBtn = document.getElementById('cancel-edit');
const saveContentBtn = document.getElementById('save-content');
const contentWrapper = document.getElementById('content-wrapper');

const sidebarControls = document.getElementById('sidebar-controls');
const sidebarActions = document.getElementById('sidebar-actions');
const addPageBtn = document.getElementById('add-page-btn');
const addCatBtn = document.getElementById('add-cat-btn');
const editMenuBtn = document.getElementById('edit-menu-btn');
const mediaLibraryBtn = document.getElementById('media-library-btn');
const mediaModal = document.getElementById('media-modal');
const closeMediaModalBtn = document.getElementById('close-media-modal');
const mediaGrid = document.getElementById('media-grid');
const newMediaUrlInput = document.getElementById('new-media-url');
const addMediaBtn = document.getElementById('add-media-btn');
const mediaFileInput = document.getElementById('media-file-input');
const uploadTriggerBtn = document.getElementById('upload-trigger-btn');
const uploadStatus = document.getElementById('upload-status');
const menuModal = document.getElementById('menu-modal');
const menuJsonEditor = document.getElementById('menu-json-editor');
const closeMenuModalBtn = document.getElementById('close-menu-modal');
const saveMenuBtn = document.getElementById('save-menu');
const appContainer = document.getElementById('app');
const roleSelect = document.getElementById('role-select');
const sugarAppLink = document.getElementById('sugar-app-link');
const editShortcutBtn = document.getElementById('edit-shortcut-btn');

// App State
let currentState = {
    isLoggedIn: false,
    currentUser: null,
    activePage: 'landlord-intro',
    currentRole: 'landlord',
    isEditing: false,
    sugarAppUrl: 'https://sugar-app.dev' // Default URL
};

// DOM Elements
const authSection = document.getElementById('auth-section');
const navTree = document.getElementById('nav-tree');
const docContent = document.getElementById('doc-content');
const breadcrumbCurrent = document.getElementById('current-breadcrumb');
const tocList = document.getElementById('toc-list');

// Initialize
async function init() {
    // Load persisted data
    const savedRolesData = localStorage.getItem('sugar_roles_data');
    const savedRole = localStorage.getItem('sugar_current_role');
    const savedMedia = localStorage.getItem('sugar_media');

    if (savedRolesData) {
        rolesData = JSON.parse(savedRolesData);
    }

    if (savedMedia) {
        mediaAssets = JSON.parse(savedMedia);
    } else {
        mediaAssets = [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
            'https://images.unsplash.com/photo-1554469384-e58fb162020a?w=400'
        ];
    }

    const savedShortcutUrl = localStorage.getItem('sugar_app_url');
    if (savedShortcutUrl) {
        currentState.sugarAppUrl = savedShortcutUrl;
    }
    updateShortcutUI();

    if (savedRole && rolesData[savedRole]) {
        currentState.currentRole = savedRole;
        roleSelect.value = savedRole;
    }

    menuStructure = rolesData[currentState.currentRole].menu;
    guideData = rolesData[currentState.currentRole].guides;
    currentState.activePage = menuStructure[0].items[0].id;

    // Clerk Initialization
    try {
        if (!window.Clerk) {
            // Wait for script to load
            await new Promise(resolve => {
                const check = setInterval(() => {
                    if (window.Clerk) {
                        clearInterval(check);
                        resolve();
                    }
                }, 100);
            });
        }

        await Clerk.load();

        if (Clerk.user) {
            currentState.isLoggedIn = true;
            currentState.currentUser = {
                name: Clerk.user.fullName || Clerk.user.firstName,
                email: Clerk.user.primaryEmailAddress.emailAddress
            };
        } else {
            currentState.isLoggedIn = false;
            currentState.currentUser = null;
        }

        updateAuthUI();
    } catch (err) {
        console.error('Clerk load failed:', err);
    }

    renderMenu();
    updateEditControlsVisibility();
    loadPage(currentState.activePage);
    setupEventListeners();
}

function persistAll() {
    localStorage.setItem('sugar_roles_data', JSON.stringify(rolesData));
    localStorage.setItem('sugar_current_role', currentState.currentRole);
    localStorage.setItem('sugar_media', JSON.stringify(mediaAssets));
    localStorage.setItem('sugar_app_url', currentState.sugarAppUrl);
}

function switchRole(role) {
    if (!rolesData[role]) return;

    currentState.currentRole = role;
    menuStructure = rolesData[role].menu;
    guideData = rolesData[role].guides;

    // Default to first page of the role
    const firstPageId = menuStructure[0].items[0].id;

    renderMenu();
    loadPage(firstPageId);
    persistAll();

    // Track role switch
    if (typeof gtag === 'function') {
        gtag('event', 'role_switch', {
            'role_id': role,
            'role_name': rolesData[role].title
        });
    }
}

function renderMenu() {
    navTree.innerHTML = '';

    if (currentState.isLoggedIn) {
        appContainer.classList.add('is-logged-in');
    } else {
        appContainer.classList.remove('is-logged-in');
    }

    menuStructure.forEach((cat, catIndex) => {
        const catContainer = document.createElement('div');
        catContainer.className = 'nav-category';
        catContainer.dataset.index = catIndex;

        const h4 = document.createElement('h4');
        h4.innerHTML = `
            <span>${cat.category}</span>
            <span class="cat-actions">
                <span class="cat-btn cat-rename" title="카테고리명 수정">✏️</span>
                <span class="cat-btn cat-delete" title="카테고리 삭제">✕</span>
            </span>
        `;

        if (currentState.isLoggedIn) {
            h4.querySelector('.cat-rename').addEventListener('click', () => renameCategory(catIndex));
            h4.querySelector('.cat-delete').addEventListener('click', () => deleteCategory(catIndex));
        }

        catContainer.appendChild(h4);

        const ul = document.createElement('ul');
        ul.dataset.catIndex = catIndex;

        cat.items.forEach((item, itemIndex) => {
            const li = document.createElement('li');
            li.className = 'nav-item-container';

            const a = document.createElement('a');
            a.className = `nav-item ${currentState.activePage === item.id ? 'active' : ''}`;
            a.href = `#${item.id}`;
            a.draggable = currentState.isLoggedIn;

            // Drag and Drop Attributes
            a.dataset.id = item.id;
            a.dataset.catIndex = catIndex;
            a.dataset.itemIndex = itemIndex;

            a.innerHTML = `
                <span class="nav-item-text">${item.title}</span>
                <span class="nav-item-actions">
                    <span class="edit-title-btn" title="제목 수정">✏️</span>
                    <span class="delete-item-btn" title="삭제">✕</span>
                </span>
            `;

            // Event Listeners
            a.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-item-btn') || e.target.classList.contains('edit-title-btn')) return;
                e.preventDefault();
                loadPage(item.id);
            });

            if (currentState.isLoggedIn) {
                // Drag start
                a.addEventListener('dragstart', handleDragStart);
                a.addEventListener('dragend', handleDragEnd);

                // Drop handlers for the container
                li.addEventListener('dragover', handleDragOver);
                li.addEventListener('drop', handleDrop);

                // Edit/Delete handlers
                a.querySelector('.edit-title-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    renamePage(catIndex, itemIndex);
                });
                a.querySelector('.delete-item-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deletePage(catIndex, itemIndex);
                });
            }

            li.appendChild(a);
            ul.appendChild(li);
        });
        catContainer.appendChild(ul);
        navTree.appendChild(catContainer);
    });
}

// Drag and Drop Handlers
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    document.querySelectorAll('.nav-item-container').forEach(el => el.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const sourceCatIndex = parseInt(draggedItem.dataset.catIndex);
    const sourceItemIndex = parseInt(draggedItem.dataset.itemIndex);
    const targetCatIndex = parseInt(this.querySelector('.nav-item').dataset.catIndex);
    const targetItemIndex = parseInt(this.querySelector('.nav-item').dataset.itemIndex);

    if (sourceCatIndex === targetCatIndex && sourceItemIndex === targetItemIndex) return;

    // Move item in structure
    const itemToMove = menuStructure[sourceCatIndex].items.splice(sourceItemIndex, 1)[0];
    menuStructure[targetCatIndex].items.splice(targetItemIndex, 0, itemToMove);

    persistAll();
    renderMenu();
}


function addPage() {
    const title = prompt('새 페이지 제목을 입력하세요:');
    if (!title) return;

    const id = 'page-' + Date.now();
    const newPage = { id, title };

    // Add to first category or create one
    if (menuStructure.length === 0) {
        menuStructure.push({ category: '새 카테고리', items: [] });
    }
    menuStructure[0].items.push(newPage);

    // Add to data
    guideData[id] = {
        title: title,
        content: `# ${title}\n새로운 페이지 내용을 입력하세요.`,
        toc: []
    };

    persistAll();
    renderMenu();
    loadPage(id);
}


function deletePage(catIndex, itemIndex) {
    const item = menuStructure[catIndex].items[itemIndex];
    if (!confirm(`'${item.title}' 페이지를 삭제하시겠습니까?`)) return;

    menuStructure[catIndex].items.splice(itemIndex, 1);
    delete guideData[item.id];

    persistAll();
    if (currentState.activePage === item.id) {
        loadPage('intro');
    }
    renderMenu();
}


function renamePage(catIndex, itemIndex) {
    const item = menuStructure[catIndex].items[itemIndex];
    const newTitle = prompt('새 제목을 입력하세요:', item.title);
    if (!newTitle) return;

    item.title = newTitle;
    guideData[item.id].title = newTitle;

    persistAll();
    renderMenu();
    loadPage(item.id);
}

function addCategory() {
    const title = prompt('새 카테고리 이름을 입력하세요:');
    if (!title) return;

    menuStructure.push({
        category: title,
        items: []
    });

    persistAll();
    renderMenu();
}

function renameCategory(catIndex) {
    const cat = menuStructure[catIndex];
    const newTitle = prompt('카테고리 이름을 수정하세요:', cat.category);
    if (!newTitle) return;

    cat.category = newTitle;
    persistAll();
    renderMenu();
}

function deleteCategory(catIndex) {
    const cat = menuStructure[catIndex];
    if (cat.items.length > 0) {
        if (!confirm(`'${cat.category}' 카테고리에 포함된 모든 페이지도 함께 삭제됩니다. 계속하시겠습니까?`)) return;
        // Clean up guideData
        cat.items.forEach(item => delete guideData[item.id]);
    } else {
        if (!confirm(`'${cat.category}' 카테고리를 삭제하시겠습니까?`)) return;
    }

    menuStructure.splice(catIndex, 1);
    persistAll();
    renderMenu();
    loadPage('intro');
}

// Media Library Functions
function renderMediaLibrary() {
    mediaGrid.innerHTML = '';
    mediaAssets.forEach((url, index) => {
        const item = document.createElement('div');
        item.style.cssText = 'border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: #fff; position: relative;';

        item.innerHTML = `
            <div style="height: 100px; background: url('${url}') center/cover no-repeat;"></div>
            <div style="padding: 0.5rem;">
                <button class="btn btn-ghost copy-media-url" style="width: 100%; font-size: 0.7rem; padding: 4px;">주소 복사</button>
                <button class="btn btn-ghost delete-media" style="width: 100%; font-size: 0.7rem; padding: 4px; color: #ef4444;">삭제</button>
            </div>
        `;

        item.querySelector('.copy-media-url').addEventListener('click', () => {
            navigator.clipboard.writeText(url).then(() => alert('이미지 주소가 복사되었습니다.'));
        });

        item.querySelector('.delete-media').addEventListener('click', () => {
            if (confirm('이 미디어를 삭제하시겠습니까?')) {
                mediaAssets.splice(index, 1);
                persistAll();
                renderMediaLibrary();
            }
        });

        mediaGrid.appendChild(item);
    });
}

function addMedia() {
    const url = newMediaUrlInput.value.trim();
    if (!url) return;

    mediaAssets.unshift(url);
    newMediaUrlInput.value = '';
    persistAll();
    renderMediaLibrary();
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }

    // Check file size (limit to 2MB for localStorage safety)
    if (file.size > 2 * 1024 * 1024) {
        alert('파일 크기가 너무 큽니다 (최대 2MB).');
        return;
    }

    uploadStatus.textContent = '업로드 중...';

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64String = event.target.result;
        mediaAssets.unshift(base64String);
        persistAll();
        renderMediaLibrary();
        uploadStatus.textContent = '완료!';
        setTimeout(() => uploadStatus.textContent = '', 2000);
    };
    reader.onerror = () => {
        alert('파일을 읽는 중 오류가 발생했습니다.');
        uploadStatus.textContent = '';
    };
    reader.readAsDataURL(file);
}


function loadPage(pageId) {
    const data = guideData[pageId];
    if (!data) return;

    currentState.activePage = pageId;
    currentState.isEditing = false;

    // Render Markdown to HTML
    const htmlContent = marked.parse(data.content.trim());
    docContentDisplay.innerHTML = htmlContent;
    breadcrumbCurrent.textContent = data.title;

    // Update Controls Visibility
    updateEditControlsVisibility();
    exitEditMode();

    // Update TOC (Simple simulation based on original data)
    renderTOC(data.toc);

    // Update Menu Active State
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('href') === `#${pageId}`) {
            el.classList.add('active');
        }
    });

    // Track page view in GA
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            'page_title': data.title,
            'page_location': window.location.href,
            'role': currentState.currentRole
        });
    }

    window.scrollTo(0, 0);
}

function updateShortcutUI() {
    sugarAppLink.href = currentState.sugarAppUrl;
    if (currentState.isLoggedIn) {
        editShortcutBtn.style.display = 'inline-block';
    } else {
        editShortcutBtn.style.display = 'none';
    }
}

function editShortcut(e) {
    if (e) e.preventDefault();
    const newUrl = prompt('Sugar app 바로 가기 URL을 입력하세요:', currentState.sugarAppUrl);
    if (newUrl !== null && newUrl.trim() !== '') {
        currentState.sugarAppUrl = newUrl.trim();
        persistAll();
        updateShortcutUI();
    }
}

function renderTOC(tocItems) {
    tocList.innerHTML = '';
    tocItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#`;
        a.textContent = item;
        li.appendChild(a);
        tocList.appendChild(li);
    });
}

function updateEditControlsVisibility() {
    if (currentState.isLoggedIn) {
        editControls.classList.add('active');
        sidebarControls.style.display = 'block';
        sidebarActions.style.display = 'flex';
    } else {
        editControls.classList.remove('active');
        sidebarControls.style.display = 'none';
        sidebarActions.style.display = 'none';
    }
    updateShortcutUI();
}

function openMenuEditor() {
    menuJsonEditor.value = JSON.stringify(menuStructure, null, 4);
    menuModal.classList.add('active');
}

function saveMenuStructure() {
    try {
        const newStructure = JSON.parse(menuJsonEditor.value);
        if (!Array.isArray(newStructure)) throw new Error('Root must be an array');

        menuStructure.length = 0;
        newStructure.forEach(item => menuStructure.push(item));

        renderMenu();
        menuModal.classList.remove('active');
    } catch (e) {
        alert('JSON 형식이 올바르지 않습니다: ' + e.message);
    }
}


function enterEditMode() {
    currentState.isEditing = true;
    contentWrapper.classList.add('editing');
    editorContainer.classList.add('active');

    // Always start in editor mode
    contentEditor.style.display = 'block';
    editorPreview.style.display = 'none';
    previewToggleBtn.textContent = '미리보기';

    contentEditor.value = guideData[currentState.activePage].content.trim();
    editControls.classList.remove('active');
}

function togglePreview() {
    const isShowingPreview = editorPreview.style.display === 'block';

    if (isShowingPreview) {
        // Switch back to editor
        editorPreview.style.display = 'none';
        contentEditor.style.display = 'block';
        previewToggleBtn.textContent = '미리보기';
    } else {
        // Render and show preview
        editorPreview.innerHTML = marked.parse(contentEditor.value);
        contentEditor.style.display = 'none';
        editorPreview.style.display = 'block';
        previewToggleBtn.textContent = '수정하기 (Editor)';
    }
}

function exitEditMode() {
    currentState.isEditing = false;
    contentWrapper.classList.remove('editing');
    editorContainer.classList.remove('active');
    if (currentState.isLoggedIn) {
        editControls.classList.add('active');
    }
}

function saveEdits() {
    const markdownContent = contentEditor.value;
    guideData[currentState.activePage].content = markdownContent;

    // Render Markdown to HTML and update display
    docContentDisplay.innerHTML = marked.parse(markdownContent);

    persistAll();
    console.log(`Saved Markdown for ${currentState.activePage}`);
    exitEditMode();
}


function setupEventListeners() {
    // Edit logic
    editBtn.addEventListener('click', enterEditMode);
    previewToggleBtn.addEventListener('click', togglePreview);
    cancelEditBtn.addEventListener('click', exitEditMode);
    saveContentBtn.addEventListener('click', saveEdits);

    // Menu management
    editMenuBtn.addEventListener('click', openMenuEditor);
    closeMenuModalBtn.addEventListener('click', () => menuModal.classList.remove('active'));
    saveMenuBtn.addEventListener('click', saveMenuStructure);
    addPageBtn.addEventListener('click', addPage);
    addCatBtn.addEventListener('click', addCategory);

    // Media management
    mediaLibraryBtn.addEventListener('click', () => {
        renderMediaLibrary();
        mediaModal.classList.add('active');
    });
    closeMediaModalBtn.addEventListener('click', () => mediaModal.classList.remove('active'));
    addMediaBtn.addEventListener('click', addMedia);
    uploadTriggerBtn.addEventListener('click', () => mediaFileInput.click());
    mediaFileInput.addEventListener('change', handleFileUpload);

    // Handle search (Basic simulation)
    document.getElementById('search-input').addEventListener('input', (e) => {
        console.log('Searching for:', e.target.value);
    });

    roleSelect.addEventListener('change', (e) => {
        switchRole(e.target.value);
    });

    editShortcutBtn.addEventListener('click', editShortcut);
}

function updateAuthUI() {
    const signInDiv = document.getElementById('clerk-sign-in');
    const userButtonDiv = document.getElementById('clerk-user-button');

    if (Clerk.user) {
        signInDiv.innerHTML = '';
        Clerk.mountUserButton(userButtonDiv, {
            afterSignOutUrl: window.location.href
        });

        currentState.isLoggedIn = true;
        currentState.currentUser = {
            name: Clerk.user.fullName || Clerk.user.firstName,
            email: Clerk.user.primaryEmailAddress.emailAddress
        };
    } else {
        userButtonDiv.innerHTML = '';

        // Clear and add a reliable sign-in button
        signInDiv.innerHTML = '<button id="explicit-login-btn" class="btn btn-outline">로그인</button>';
        document.getElementById('explicit-login-btn').addEventListener('click', () => {
            Clerk.openSignIn();
        });

        // Also try to mount the standard Clerk button if possible
        const mountDiv = document.createElement('div');
        signInDiv.appendChild(mountDiv);
        Clerk.mountSignInButton(mountDiv, {
            mode: 'modal'
        });

        currentState.isLoggedIn = false;
        currentState.currentUser = null;
    }
}


init();
