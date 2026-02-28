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
const tempSaveContentBtn = document.getElementById('temp-save-content');
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
const roleManageActions = document.getElementById('role-manage-actions');
const renameRoleBtn = document.getElementById('rename-role-btn');
const deleteRoleBtn = document.getElementById('delete-role-btn');
const addRoleBtn = document.getElementById('add-role-btn');
const subgroupSelectorContainer = document.getElementById('subgroup-selector-container');
const subgroupSelect = document.getElementById('subgroup-select');
const subgroupManageActions = document.getElementById('subgroup-manage-actions');
const renameSubgroupBtn = document.getElementById('rename-subgroup-btn');
const deleteSubgroupBtn = document.getElementById('delete-subgroup-btn');
const addSubgroupBtn = document.getElementById('add-subgroup-btn');
const subcollectionSelectorContainer = document.getElementById('subcollection-selector-container');
const subcollectionSelect = document.getElementById('subcollection-select');
const subcollectionManageActions = document.getElementById('subcollection-manage-actions');
const renameSubcollectionBtn = document.getElementById('rename-subcollection-btn');
const deleteSubcollectionBtn = document.getElementById('delete-subcollection-btn');
const addSubcollectionBtn = document.getElementById('add-subcollection-btn');
const moveRoleUpBtn = document.getElementById('move-role-up-btn');
const moveRoleDownBtn = document.getElementById('move-role-down-btn');
const moveSubgroupUpBtn = document.getElementById('move-subgroup-up-btn');
const moveSubgroupDownBtn = document.getElementById('move-subgroup-down-btn');
const moveSubcollectionUpBtn = document.getElementById('move-subcollection-up-btn');
const moveSubcollectionDownBtn = document.getElementById('move-subcollection-down-btn');
const sugarAppLink = document.getElementById('sugar-app-link');
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${mins}`;
}

const editShortcutBtn = document.getElementById('edit-shortcut-btn');
const addDividerBtn = document.getElementById('add-divider-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const deployBtn = document.getElementById('deploy-btn');
const API_BASE_URL = '__API_BASE_URL__';

// App State
let currentState = {
    isLoggedIn: false,
    currentUser: null,
    activePage: 'landlord-intro',
    currentRole: 'landlord',
    activeSubgroup: null,
    activeSubcollection: null,
    isEditing: false,
    sugarAppUrl: 'https://sugar-app.dev',
    theme: 'light'
};

// DOM Elements
const authSection = document.getElementById('auth-section');
const navTree = document.getElementById('nav-tree');
const docContent = document.getElementById('doc-content');
const breadcrumbCurrent = document.getElementById('current-breadcrumb');
const tocList = document.getElementById('toc-list');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// Initialize
async function init() {
    // 1. Try to load from Server first
    const dataUrl = `${API_BASE_URL}/api/data?_=${Date.now()}`;
    console.log(`[INIT] Fetching data from: ${dataUrl}`);
    try {
        const response = await fetch(dataUrl);
        if (response.ok) {
            const serverData = await response.json();
            if (serverData.rolesData) rolesData = serverData.rolesData;
            if (serverData.mediaAssets) mediaAssets = serverData.mediaAssets;
            if (serverData.sugarAppUrl) currentState.sugarAppUrl = serverData.sugarAppUrl;
            console.log('[INIT] Server data loaded successfully');
        } else {
            console.warn(`[INIT] Server returned status: ${response.status}. Falling back to local data.`);
            throw new Error(`Status ${response.status}`);
        }
    } catch (err) {
        console.error('[INIT] Server data load failed (CORS or Network Error):', err);
        // Fallback to local storage if server is down
        const savedRolesData = localStorage.getItem('sugar_roles_data');
        if (savedRolesData) rolesData = JSON.parse(savedRolesData);
        const savedMedia = localStorage.getItem('sugar_media');
        if (savedMedia) mediaAssets = JSON.parse(savedMedia);
    }

    // 2. Local settings (Theme, Role)
    const savedRole = localStorage.getItem('sugar_current_role');
    const savedTheme = localStorage.getItem('sugar_theme');
    const savedShortcutUrl = localStorage.getItem('sugar_app_url');

    if (savedTheme) {
        currentState.theme = savedTheme;
        applyTheme();
    }

    if (savedShortcutUrl && !currentState.sugarAppUrl) {
        currentState.sugarAppUrl = savedShortcutUrl;
    }

    if (!mediaAssets || mediaAssets.length === 0) {
        mediaAssets = [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
            'https://images.unsplash.com/photo-1554469384-e58fb162020a?w=400'
        ];
    }

    updateShortcutUI();

    const hash = window.location.hash.replace('#', '');
    const path = findPathByPageId(hash);
    const initialRole = (path && path.role) ? path.role : ((savedRole && rolesData[savedRole]) ? savedRole : currentState.currentRole);

    renderRoleSelect();
    switchRole(initialRole, hash);

    // 3. Clerk Initialization
    try {
        if (!window.Clerk) {
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

        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const localSession = isLocal ? JSON.parse(sessionStorage.getItem('local_test_user')) : null;

        if (Clerk.user || localSession) {
            currentState.isLoggedIn = true;
            if (Clerk.user) {
                currentState.currentUser = {
                    name: Clerk.user.fullName || Clerk.user.firstName,
                    email: Clerk.user.primaryEmailAddress.emailAddress
                };
            } else {
                currentState.currentUser = localSession;
            }
        } else {
            currentState.isLoggedIn = false;
            currentState.currentUser = null;
        }

        updateAuthUI();
    } catch (err) {
        console.error('Clerk load failed:', err);
        updateAuthUI(); // Still try to update UI (might show local login if on localhost)
    }

    renderMenu();
    updateEditControlsVisibility();
    // No longer calling loadPage here, as switchRole handles it via targetPageId
    setupEventListeners();
}

async function persistAll() {
    // Save to LocalStorage for session persistence (current browser only)
    localStorage.setItem('sugar_roles_data', JSON.stringify(rolesData));
    localStorage.setItem('sugar_current_role', currentState.currentRole);
    localStorage.setItem('sugar_media', JSON.stringify(mediaAssets));
    localStorage.setItem('sugar_app_url', currentState.sugarAppUrl);
    localStorage.setItem('sugar_theme', currentState.theme);

    // Change button style to indicate unsaved changes
    if (currentState.isLoggedIn && deployBtn) {
        deployBtn.style.background = '#f59e0b'; // Amber color for "pending"
        deployBtn.textContent = '🚀 배포하기*';
    }
}

async function publishSiteData(silent = false) {
    if (!currentState.isLoggedIn) return;

    deployBtn.disabled = true;
    deployBtn.textContent = '⏳ 배포 중...';

    try {
        const dataToSave = {
            rolesData,
            mediaAssets,
            sugarAppUrl: currentState.sugarAppUrl
        };

        const response = await fetch(`${API_BASE_URL}/api/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave)
        });

        if (response.ok) {
            if (!silent) alert('성공적으로 배포되었습니다! 이제 모든 사용자가 변경 사항을 볼 수 있습니다.');
            deployBtn.style.background = 'var(--primary)';
            deployBtn.textContent = '🚀 배포 완료';
            setTimeout(() => {
                deployBtn.textContent = '🚀 배포하기';
            }, 3000);
        } else {
            throw new Error('Server response not ok');
        }
    } catch (err) {
        console.error('Server sync failed:', err);
        if (!silent) alert('배포 중 오류가 발생했습니다: ' + err.message);
        deployBtn.textContent = '🚀 배포 실패 (재시도)';
    } finally {
        deployBtn.disabled = false;
    }
}

function findPathByPageId(pageId) {
    if (!pageId) return null;
    for (const [roleKey, roleData] of Object.entries(rolesData)) {
        if (roleData.menu) {
            for (const cat of roleData.menu) {
                if (cat.items && cat.items.some(i => i.id === pageId)) return { role: roleKey };
            }
        }
        if (roleData.subgroups) {
            for (const sub of roleData.subgroups) {
                if (sub.menu) {
                    for (const cat of sub.menu) {
                        if (cat.items && cat.items.some(i => i.id === pageId)) return { role: roleKey, subgroup: sub.id };
                    }
                }
                if (sub.subcollections) {
                    for (const sc of sub.subcollections) {
                        if (sc.menu) {
                            for (const cat of sc.menu) {
                                if (cat.items && cat.items.some(i => i.id === pageId)) return { role: roleKey, subgroup: sub.id, subcollection: sc.id };
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}

function switchRole(role, targetPageId = null) {
    if (!rolesData[role]) return;

    currentState.currentRole = role;
    if (roleSelect) roleSelect.value = role;

    const roleData = rolesData[role];
    const hasSubgroups = roleData.subgroups && roleData.subgroups.length > 0;

    if (hasSubgroups) {
        subgroupSelectorContainer.style.display = 'block';
        renderSubgroupSelect();
        const lastSubId = localStorage.getItem(`sugar_last_sub_${role}`);

        let subToSelect;
        const path = findPathByPageId(targetPageId);
        if (path && path.role === role && path.subgroup) {
            subToSelect = path.subgroup;
        } else {
            subToSelect = (lastSubId && roleData.subgroups.find(s => s.id === lastSubId)) ? lastSubId : roleData.subgroups[0].id;
        }

        subgroupSelect.value = subToSelect;
        switchSubgroup(subToSelect, targetPageId);
    } else {
        subgroupSelectorContainer.style.display = 'none';
        subcollectionSelectorContainer.style.display = 'none';
        currentState.activeSubgroup = null;
        currentState.activeSubcollection = null;
        menuStructure = roleData.menu;

        guideData = roleData.guides;
        if (!guideData) {
            roleData.guides = {};
            guideData = roleData.guides;
        }

        renderMenu();

        const firstPageId = menuStructure[0]?.items[0]?.id || 'no-page';
        const pageToLoad = targetPageId || firstPageId;
        if (pageToLoad !== 'no-page') {
            loadPage(pageToLoad);
        } else {
            docContentDisplay.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">페이지가 없습니다. 새 페이지를 추가해주세요.</div>';
            breadcrumbCurrent.textContent = '-';
        }
    }

    persistAll();

    if (typeof gtag === 'function') {
        gtag('event', 'role_switch', {
            'role_id': role,
            'role_name': rolesData[role].title
        });
    }
}

function renderRoleSelect() {
    const currentVal = roleSelect.value || currentState.currentRole;
    roleSelect.innerHTML = '';
    Object.keys(rolesData).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = rolesData[key].title;
        roleSelect.appendChild(option);
    });
    if (rolesData[currentVal]) {
        roleSelect.value = currentVal;
    }
}

function addRole() {
    const title = prompt('새 가이드 모음의 이름을 입력하세요 (예: 파트너 가이드):');
    if (!title) return;

    const id = 'role-' + Date.now();
    const firstPageId = 'intro-' + Date.now();

    rolesData[id] = {
        title: title,
        menu: [
            {
                category: '기본 가이드',
                items: [{ id: firstPageId, title: '시작하기' }]
            }
        ],
        guides: {
            [firstPageId]: {
                title: '시작하기',
                content: `# ${title} 시작하기\n새로운 가이드를 작성해보세요.`,
                toc: []
            }
        }
    };

    renderRoleSelect();
    switchRole(id);
    roleSelect.value = id;
    persistAll();
}

function renameRole() {
    const currentRole = currentState.currentRole;
    const newTitle = prompt('가이드 모음의 이름을 수정하세요:', rolesData[currentRole].title);
    if (!newTitle) return;

    rolesData[currentRole].title = newTitle;
    renderRoleSelect();
    persistAll();
}

function deleteRole() {
    const currentRole = currentState.currentRole;
    const roleCount = Object.keys(rolesData).length;

    if (roleCount <= 1) {
        alert('최소 하나 이상의 가이드 모음이 필요합니다.');
        return;
    }

    if (!confirm(`'${rolesData[currentRole].title}' 가이드 모음과 포함된 모든 페이지를 삭제하시겠습니까?`)) return;

    delete rolesData[currentRole];

    const nextRole = Object.keys(rolesData)[0];
    renderRoleSelect();
    switchRole(nextRole);
    persistAll();
}

function moveRole(direction) {
    const keys = Object.keys(rolesData);
    const index = keys.indexOf(currentState.currentRole);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= keys.length) return;

    // Swap keys in rolesData (objects maintain insertion order for string keys in JS)
    const newKeys = [...keys];
    [newKeys[index], newKeys[targetIndex]] = [newKeys[targetIndex], newKeys[index]];

    const newRolesData = {};
    newKeys.forEach(k => newRolesData[k] = rolesData[k]);
    rolesData = newRolesData;

    renderRoleSelect();
    persistAll();
}

function renderSubgroupSelect() {
    const role = currentState.currentRole;
    if (!rolesData[role].subgroups) return;

    subgroupSelect.innerHTML = '';
    rolesData[role].subgroups.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub.id;
        option.textContent = sub.title;
        subgroupSelect.appendChild(option);
    });
}

function switchSubgroup(subId, targetPageId = null) {
    const role = currentState.currentRole;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);
    if (!subgroup) return;

    currentState.activeSubgroup = subId;
    localStorage.setItem(`sugar_last_sub_${role}`, subId);

    if (currentState.isLoggedIn) {
        subgroupManageActions.style.display = 'flex';
        addSubcollectionBtn.style.display = 'block';
    }

    const hasSubcollections = subgroup.subcollections && subgroup.subcollections.length > 0;

    if (hasSubcollections) {
        subcollectionSelectorContainer.style.display = 'block';
        renderSubcollectionSelect();
        const lastSubColId = localStorage.getItem(`sugar_last_subcol_${subId}`);

        let subColToSelect;
        const path = findPathByPageId(targetPageId);
        if (path && path.role === role && path.subgroup === subId && path.subcollection) {
            subColToSelect = path.subcollection;
        } else {
            subColToSelect = (lastSubColId && subgroup.subcollections.find(s => s.id === lastSubColId)) ? lastSubColId : subgroup.subcollections[0].id;
        }

        subcollectionSelect.value = subColToSelect;
        switchSubcollection(subColToSelect, targetPageId);
    } else {
        subcollectionSelectorContainer.style.display = 'none';
        currentState.activeSubcollection = null;
        menuStructure = subgroup.menu;

        renderMenu();
        const firstPageId = menuStructure[0]?.items[0]?.id || 'no-page';
        const pageToLoad = targetPageId || firstPageId;
        if (pageToLoad !== 'no-page') {
            loadPage(pageToLoad);
        } else {
            docContentDisplay.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">페이지가 없습니다. 새 페이지를 추가해주세요.</div>';
        }
    }
}

function renderSubcollectionSelect() {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);
    if (!subgroup || !subgroup.subcollections) return;

    subcollectionSelect.innerHTML = '';
    subgroup.subcollections.forEach(sc => {
        const option = document.createElement('option');
        option.value = sc.id;
        option.textContent = sc.title;
        subcollectionSelect.appendChild(option);
    });
}

function switchSubcollection(scId, targetPageId = null) {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);
    const subcol = subgroup.subcollections.find(s => s.id === scId);
    if (!subcol) return;

    currentState.activeSubcollection = scId;
    menuStructure = subcol.menu;
    localStorage.setItem(`sugar_last_subcol_${subId}`, scId);

    if (currentState.isLoggedIn) {
        subcollectionManageActions.style.display = 'flex';
    }

    renderMenu();
    const firstPageId = menuStructure[0]?.items[0]?.id || 'no-page';
    const pageToLoad = targetPageId || firstPageId;
    if (pageToLoad !== 'no-page') {
        loadPage(pageToLoad);
    } else {
        docContentDisplay.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">페이지가 없습니다. 새 페이지를 추가해주세요.</div>';
    }
}

function addSubcollection() {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);

    const title = prompt('새 서브 모음의 이름을 입력하세요:');
    if (!title) return;

    if (!subgroup.subcollections) {
        // Migration
        const currentMenu = JSON.parse(JSON.stringify(subgroup.menu));
        subgroup.subcollections = [{
            id: 'default-sc-' + Date.now(),
            title: '기본 모음',
            menu: currentMenu
        }];
        delete subgroup.menu;
    }

    const id = 'sc-' + Date.now();
    const firstPageId = 'page-' + Date.now();

    subgroup.subcollections.push({
        id: id,
        title: title,
        menu: [{
            category: '기본 가이드',
            items: [{ id: firstPageId, title: '시작하기' }]
        }]
    });

    rolesData[role].guides[firstPageId] = {
        title: '시작하기',
        content: `# ${title} 시작하기\n내용을 입력하세요.`,
        toc: []
    };

    subcollectionSelectorContainer.style.display = 'block';
    renderSubcollectionSelect();
    switchSubcollection(id);
    subcollectionSelect.value = id;
    persistAll();
}

function renameSubcollection() {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const scId = currentState.activeSubcollection;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);
    const subcol = subgroup.subcollections.find(s => s.id === scId);
    if (!subcol) return;

    const newTitle = prompt('서브 모음 이름을 수정하세요:', subcol.title);
    if (!newTitle) return;

    subcol.title = newTitle;
    renderSubcollectionSelect();
    subcollectionSelect.value = scId;
    persistAll();
}

function deleteSubcollection() {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const scId = currentState.activeSubcollection;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);
    const subcollections = subgroup.subcollections;

    if (!subcollections || subcollections.length <= 1) {
        alert('최소 하나 이상의 서브 모음이 필요합니다.');
        return;
    }

    if (!confirm(`'${subcollections.find(s => s.id === scId).title}' 서브 모음을 삭제하시겠습니까?`)) return;

    subgroup.subcollections = subcollections.filter(sc => sc.id !== scId);

    renderSubcollectionSelect();
    switchSubcollection(subgroup.subcollections[0].id);
    persistAll();
}

function moveSubcollection(direction) {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);
    const subcollections = subgroup.subcollections;
    if (!subcollections) return;
    const index = subcollections.findIndex(sc => sc.id === currentState.activeSubcollection);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= subcollections.length) return;

    [subcollections[index], subcollections[targetIndex]] = [subcollections[targetIndex], subcollections[index]];

    renderSubcollectionSelect();
    subcollectionSelect.value = currentState.activeSubcollection;
    persistAll();
}

function addSubgroup() {
    const role = currentState.currentRole;
    const title = prompt('새 서브 메뉴의 이름을 입력하세요 (예: 아파트, 빌라):');
    if (!title) return;

    if (!rolesData[role].subgroups) {
        const currentMenu = JSON.parse(JSON.stringify(rolesData[role].menu));
        rolesData[role].subgroups = [{
            id: 'default-' + Date.now(),
            title: '기본 메뉴',
            menu: currentMenu
        }];
    }

    const id = 'sub-' + Date.now();
    const firstPageId = 'page-' + Date.now();

    rolesData[role].subgroups.push({
        id: id,
        title: title,
        menu: [{
            category: '기본 가이드',
            items: [{ id: firstPageId, title: '시작하기' }]
        }]
    });

    rolesData[role].guides[firstPageId] = {
        title: '시작하기',
        content: `# ${title} 시작하기\n내용을 입력하세요.`,
        toc: []
    };

    subgroupSelectorContainer.style.display = 'block';
    renderSubgroupSelect();
    switchSubgroup(id);
    subgroupSelect.value = id;
    persistAll();
}

function renameSubgroup() {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const subgroup = rolesData[role].subgroups.find(s => s.id === subId);
    if (!subgroup) return;

    const newTitle = prompt('서브 메뉴 이름을 수정하세요:', subgroup.title);
    if (!newTitle) return;

    subgroup.title = newTitle;
    renderSubgroupSelect();
    subgroupSelect.value = subId;
    persistAll();
}

function deleteSubgroup() {
    const role = currentState.currentRole;
    const subId = currentState.activeSubgroup;
    const subgroups = rolesData[role].subgroups;
    if (!subgroups || subgroups.length <= 1) {
        alert('최소 하나 이상의 서브 메뉴가 필요합니다.');
        return;
    }

    if (!confirm(`'${subgroups.find(s => s.id === subId).title}' 서브 메뉴를 삭제하시겠습니까?`)) return;

    rolesData[role].subgroups = subgroups.filter(s => s.id !== subId);

    renderSubgroupSelect();
    switchSubgroup(rolesData[role].subgroups[0].id);
    persistAll();
}

function moveSubgroup(direction) {
    const role = currentState.currentRole;
    const subgroups = rolesData[role].subgroups;
    if (!subgroups) return;
    const index = subgroups.findIndex(s => s.id === currentState.activeSubgroup);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= subgroups.length) return;

    [subgroups[index], subgroups[targetIndex]] = [subgroups[targetIndex], subgroups[index]];

    renderSubgroupSelect();
    subgroupSelect.value = currentState.activeSubgroup;
    persistAll();
}

function renderMenu() {
    navTree.innerHTML = '';

    if (currentState.isLoggedIn) {
        appContainer.classList.add('is-logged-in');
    } else {
        appContainer.classList.remove('is-logged-in');
    }

    if (!menuStructure) {
        console.error('[renderMenu] menuStructure is undefined or null');
        return;
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
            catContainer.draggable = true;
            catContainer.addEventListener('dragstart', handleCatDragStart);
            catContainer.addEventListener('dragover', handleCatDragOver);
            catContainer.addEventListener('drop', handleCatDrop);
            catContainer.addEventListener('dragend', handleCatDragEnd);
            catContainer.addEventListener('dragleave', () => catContainer.classList.remove('drag-over'));

            h4.querySelector('.cat-rename').addEventListener('click', (e) => {
                e.stopPropagation();
                renameCategory(catIndex);
            });
            h4.querySelector('.cat-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteCategory(catIndex);
            });
        }

        catContainer.appendChild(h4);

        const ul = document.createElement('ul');
        ul.dataset.catIndex = catIndex;

        cat.items.forEach((item, itemIndex) => {
            const li = document.createElement('li');
            li.className = 'nav-item-container';

            if (item.type === 'divider') {
                const divider = document.createElement('div');
                divider.className = 'nav-divider-container';
                divider.draggable = currentState.isLoggedIn;
                divider.dataset.id = item.id;
                divider.dataset.catIndex = catIndex;
                divider.dataset.itemIndex = itemIndex;

                divider.innerHTML = `
                    <div class="nav-divider"></div>
                    <div class="nav-divider-actions">
                        <span class="delete-item-btn" title="삭제">✕</span>
                    </div>
                `;

                if (currentState.isLoggedIn) {
                    divider.addEventListener('dragstart', handleDragStart);
                    divider.addEventListener('dragend', handleDragEnd);
                    li.addEventListener('dragover', handleDragOver);
                    li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
                    li.addEventListener('drop', handleDrop);

                    divider.querySelector('.delete-item-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        deletePage(catIndex, itemIndex);
                    });
                }
                li.appendChild(divider);
            } else {
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
                    li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
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
            }
            ul.appendChild(li);
        });
        catContainer.appendChild(ul);
        navTree.appendChild(catContainer);
    });
}

// Drag and Drop Handlers
let draggedItem = null;
let draggedType = null; // 'item' or 'category'

function handleDragStart(e) {
    e.stopPropagation();
    draggedItem = this;
    draggedType = 'item';
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    draggedType = null;
    document.querySelectorAll('.nav-item-container').forEach(el => el.classList.remove('drag-over'));
    document.querySelectorAll('.nav-category').forEach(el => el.classList.remove('drag-over'));
}

// Category Drag and Drop
function handleCatDragStart(e) {
    draggedItem = this;
    draggedType = 'category';
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleCatDragOver(e) {
    e.preventDefault();
    if (draggedType !== 'category') return;
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleCatDragEnd() {
    handleDragEnd.call(this);
}

function handleCatDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (draggedType !== 'category') return;

    const sourceIndex = parseInt(draggedItem.dataset.index);
    const targetIndex = parseInt(this.dataset.index);

    if (sourceIndex === targetIndex) return;

    const catToMove = menuStructure.splice(sourceIndex, 1)[0];
    menuStructure.splice(targetIndex, 0, catToMove);

    persistAll();
    renderMenu();
}

function handleDragOver(e) {
    e.preventDefault();
    if (draggedType !== 'item') return;
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (draggedType !== 'item') return;

    const sourceCatIndex = parseInt(draggedItem.dataset.catIndex);
    const sourceItemIndex = parseInt(draggedItem.dataset.itemIndex);

    // Target is the li container
    const targetItem = this.querySelector('.nav-item') || this.querySelector('.nav-divider-container');
    if (!targetItem) return;

    const targetCatIndex = parseInt(targetItem.dataset.catIndex);
    const targetItemIndex = parseInt(targetItem.dataset.itemIndex);

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

function addDivider() {
    // Add a divider to the first category by default
    const dividerId = 'divider-' + Date.now();
    menuStructure[0].items.push({
        id: dividerId,
        title: '---',
        type: 'divider'
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
function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '외부 링크';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function getImageDimensions(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = url;
    });
}

function renderMediaLibrary() {
    mediaGrid.innerHTML = '';

    // Normalize mediaAssets to objects
    mediaAssets.forEach((asset, index) => {
        if (typeof asset === 'string') {
            mediaAssets[index] = { url: asset, size: 0 };
        }
    });

    mediaAssets.forEach((asset, index) => {
        const url = asset.url;
        const size = asset.size || 0;

        const item = document.createElement('div');
        item.style.cssText = 'border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: var(--bg-main); position: relative; display: flex; flex-direction: column;';

        const resolutionText = asset.width ? ` • ${asset.width}x${asset.height}` : '';
        const dateText = asset.updatedAt ? `<div style="font-size: 0.6rem; color: var(--text-muted); opacity: 0.8;">${formatDate(asset.updatedAt)}</div>` : '';

        item.innerHTML = `
            <div style="height: 100px; background: url('${url}') center/cover no-repeat;"></div>
            <div style="padding: 0.6rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div class="media-info-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 2px; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                        <div class="media-info-text" style="font-size: 0.65rem; color: var(--text-muted); font-weight: 500;">
                            ${formatBytes(size)}${resolutionText}
                        </div>
                        <span class="edit-res-btn" style="cursor: pointer; font-size: 0.65rem; color: var(--text-muted); padding: 2px;" title="해상도 수정">✏️</span>
                    </div>
                    ${dateText}
                </div>
                <div style="display: flex; gap: 4px;">
                    <button class="btn btn-ghost copy-media-url" style="flex: 1; font-size: 0.65rem; padding: 4px; border: 1px solid var(--border-color); color: var(--text-main);">주소 복사</button>
                    <button class="btn btn-ghost delete-media" style="flex: 1; font-size: 0.65rem; padding: 4px; color: #ef4444; border: 1px solid var(--border-color);">삭제</button>
                </div>
            </div>
        `;

        // Async fetch dimensions if missing
        if (!asset.width && url) {
            getImageDimensions(url).then(dims => {
                if (dims.width > 0) {
                    asset.width = dims.width;
                    asset.height = dims.height;
                    const infoEl = item.querySelector('.media-info-text');
                    if (infoEl) {
                        infoEl.innerHTML = `${formatBytes(size)} • ${dims.width}x${dims.height}`;
                    }
                    persistAll();
                }
            });
        }

        item.querySelector('.edit-res-btn').addEventListener('click', () => {
            const newRes = prompt('새 해상도를 입력하세요 (가로x세로):', `${asset.width || 0}x${asset.height || 0}`);
            if (newRes) {
                const parts = newRes.split('x');
                if (parts.length === 2) {
                    const w = parseInt(parts[0].trim());
                    const h = parseInt(parts[1].trim());
                    if (!isNaN(w) && !isNaN(h)) {
                        asset.width = w;
                        asset.height = h;
                        asset.updatedAt = new Date().toISOString();
                        persistAll();
                        renderMediaLibrary();
                    } else {
                        alert('숫자를 입력해주세요.');
                    }
                } else {
                    alert('형식이 올바르지 않습니다 (예: 1024x768).');
                }
            }
        });

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

async function addMedia() {
    const url = newMediaUrlInput.value.trim();
    if (!url) return;

    const dims = await getImageDimensions(url);
    mediaAssets.unshift({
        url,
        size: 0,
        width: dims.width || 0,
        height: dims.height || 0,
        updatedAt: new Date().toISOString()
    });
    newMediaUrlInput.value = '';
    persistAll();
    renderMediaLibrary();
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }

    // Check file size (limit to 5MB for KV safety)
    if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기가 너무 큽니다 (최대 5MB).');
        return;
    }

    uploadStatus.textContent = '업로드 중...';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('업로드 실패');

        const result = await response.json();

        const dims = await getImageDimensions(URL.createObjectURL(file));

        mediaAssets.unshift({
            url: result.url,
            size: result.size,
            name: file.name,
            width: dims.width,
            height: dims.height,
            updatedAt: new Date().toISOString()
        });

        persistAll();
        renderMediaLibrary();
        uploadStatus.textContent = '완료!';
        setTimeout(() => uploadStatus.textContent = '', 3000);
    } catch (err) {
        console.error(err);
        uploadStatus.textContent = '실패: ' + err.message;
        alert('업로드 중 오류가 발생했습니다: ' + err.message);
    }
}


function loadPage(pageId) {
    const data = guideData[pageId];
    if (!data) return;

    currentState.activePage = pageId;
    currentState.isEditing = false;

    // Update URL hash without jumping
    if (window.location.hash !== `#${pageId}`) {
        history.pushState(null, null, `#${pageId}`);
    }

    // Render Markdown to HTML
    let htmlContent = marked.parse(data.content.trim());

    // Fix legacy/broken image URLs and relative paths
    if (API_BASE_URL && !API_BASE_URL.startsWith('__')) {
        // Fix old domain if applicable
        const legacyOrigin = 'https://site-blogs.iamjeesun.workers.dev';
        htmlContent = htmlContent.replace(new RegExp(legacyOrigin + '/media/', 'g'), `${API_BASE_URL}/media/`);

        // Fix relative paths
        htmlContent = htmlContent.replace(/src="\/media\//g, `src="${API_BASE_URL}/media/`);
        htmlContent = htmlContent.replace(/\(\/media\//g, `(${API_BASE_URL}/media/`);
    }

    docContentDisplay.innerHTML = htmlContent;
    applyMediaDimensions(docContentDisplay);
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

    // Close mobile menu if active
    if (sidebar.classList.contains('active')) {
        toggleMobileMenu();
    }
}

function toggleMobileMenu() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

function toggleTheme() {
    currentState.theme = currentState.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    persistAll();
}

function applyTheme() {
    if (currentState.theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = '🌙';
    }
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

        // Use both CSS class and explicit JS display for maximum reliability
        if (roleManageActions) roleManageActions.style.setProperty('display', 'flex', 'important');
        if (addRoleBtn) addRoleBtn.style.setProperty('display', 'block', 'important');
        if (subgroupManageActions) subgroupManageActions.style.setProperty('display', 'flex', 'important');
        if (addSubgroupBtn) addSubgroupBtn.style.setProperty('display', 'block', 'important');
        if (subcollectionManageActions) subcollectionManageActions.style.setProperty('display', 'flex', 'important');
        if (addSubcollectionBtn) addSubcollectionBtn.style.setProperty('display', 'block', 'important');

        if (deployBtn) deployBtn.style.display = 'inline-block';
    } else {
        editControls.classList.remove('active');
        sidebarControls.style.display = 'none';
        sidebarActions.style.display = 'none';

        if (roleManageActions) roleManageActions.style.display = 'none';
        if (addRoleBtn) addRoleBtn.style.display = 'none';
        if (subgroupManageActions) subgroupManageActions.style.display = 'none';
        if (addSubgroupBtn) addSubgroupBtn.style.display = 'none';
        if (subcollectionManageActions) subcollectionManageActions.style.display = 'none';
        if (addSubcollectionBtn) addSubcollectionBtn.style.display = 'none';

        if (deployBtn) deployBtn.style.display = 'none';
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
        applyMediaDimensions(editorPreview);
        contentEditor.style.display = 'none';
        editorPreview.style.display = 'block';
        previewToggleBtn.textContent = '수정하기 (Editor)';
    }
}

function applyMediaDimensions(container) {
    if (!container) return;
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;

        // Try to find matching asset in mediaAssets
        let asset = mediaAssets.find(a => a.url === src);

        // If no exact match, try matching by filename/key (resilience against domain changes)
        if (!asset && src.includes('/media/')) {
            const key = src.split('/media/').pop();
            asset = mediaAssets.find(a => a.url && a.url.endsWith('/' + key));
        }

        if (asset && asset.width && asset.height) {
            img.style.width = asset.width + 'px';
            img.style.height = 'auto';
            img.width = asset.width;
            img.height = asset.height;
            img.style.maxWidth = '100%';
        }
    });
}

function exitEditMode() {
    currentState.isEditing = false;
    contentWrapper.classList.remove('editing');
    editorContainer.classList.remove('active');
    if (currentState.isLoggedIn) {
        editControls.classList.add('active');
    }
}

function tempSaveEdits() {
    const markdownContent = contentEditor.value;
    if (!guideData[currentState.activePage]) return;

    guideData[currentState.activePage].content = markdownContent;

    // Render Preview
    if (editorPreview.style.display === 'block') {
        editorPreview.innerHTML = marked.parse(markdownContent);
        applyMediaDimensions(editorPreview);
    }

    persistAll();

    // Show temporary status
    const originalText = tempSaveContentBtn.textContent;
    tempSaveContentBtn.textContent = '✅ 저장됨';
    setTimeout(() => {
        tempSaveContentBtn.textContent = originalText;
    }, 2000);

    console.log(`Temporarily saved (local) Markdown for ${currentState.activePage}`);
}

async function saveEdits() {
    const markdownContent = contentEditor.value;
    if (!guideData[currentState.activePage]) return;

    guideData[currentState.activePage].content = markdownContent;

    // Render Markdown to HTML and update display
    docContentDisplay.innerHTML = marked.parse(markdownContent);
    applyMediaDimensions(docContentDisplay);

    persistAll();

    // Now Sync to Server (This fulfills "저장" part of the requirement)
    if (currentState.isLoggedIn) {
        await publishSiteData(true); // Silent save to server
    }

    console.log(`Saved and synced Markdown for ${currentState.activePage}`);
    exitEditMode();
}


function setupEventListeners() {
    // Edit logic
    editBtn.addEventListener('click', enterEditMode);
    previewToggleBtn.addEventListener('click', togglePreview);
    cancelEditBtn.addEventListener('click', exitEditMode);
    tempSaveContentBtn.addEventListener('click', tempSaveEdits);
    saveContentBtn.addEventListener('click', saveEdits);

    // Menu management
    editMenuBtn.addEventListener('click', openMenuEditor);
    closeMenuModalBtn.addEventListener('click', () => menuModal.classList.remove('active'));
    saveMenuBtn.addEventListener('click', saveMenuStructure);
    addPageBtn.addEventListener('click', addPage);
    addCatBtn.addEventListener('click', addCategory);
    addDividerBtn.addEventListener('click', addDivider);
    themeToggleBtn.addEventListener('click', toggleTheme);
    deployBtn.addEventListener('click', publishSiteData);

    // Mobile menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    sidebarOverlay.addEventListener('click', toggleMobileMenu);

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

    subgroupSelect.addEventListener('change', (e) => {
        switchSubgroup(e.target.value);
    });

    subcollectionSelect.addEventListener('change', (e) => {
        switchSubcollection(e.target.value);
    });

    editShortcutBtn.addEventListener('click', editShortcut);

    // Role management
    addRoleBtn.addEventListener('click', addRole);
    renameRoleBtn.addEventListener('click', renameRole);
    deleteRoleBtn.addEventListener('click', deleteRole);

    // Subgroup management
    addSubgroupBtn.addEventListener('click', addSubgroup);
    renameSubgroupBtn.addEventListener('click', renameSubgroup);
    deleteSubgroupBtn.addEventListener('click', deleteSubgroup);

    // Subcollection management
    addSubcollectionBtn.addEventListener('click', addSubcollection);
    renameSubcollectionBtn.addEventListener('click', renameSubcollection);
    deleteSubcollectionBtn.addEventListener('click', deleteSubcollection);

    // Order management
    moveRoleUpBtn.addEventListener('click', () => moveRole(-1));
    moveRoleDownBtn.addEventListener('click', () => moveRole(1));
    moveSubgroupUpBtn.addEventListener('click', () => moveSubgroup(-1));
    moveSubgroupDownBtn.addEventListener('click', () => moveSubgroup(1));
    moveSubcollectionUpBtn.addEventListener('click', () => moveSubcollection(-1));
    moveSubcollectionDownBtn.addEventListener('click', () => moveSubcollection(1));

    // Handle back/forward buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && guideData[hash] && currentState.activePage !== hash) {
            loadPage(hash);
        }
    });
}

function updateAuthUI() {
    const signInDiv = document.getElementById('clerk-sign-in');
    const userButtonDiv = document.getElementById('clerk-user-button');

    // Check if we have a Clerk user OR a local test session
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '::1' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('172.') ||
        window.location.hostname.startsWith('10.');
    const localSession = isLocal ? JSON.parse(sessionStorage.getItem('local_test_user')) : null;

    if (Clerk.user || localSession) {
        signInDiv.innerHTML = '';
        if (Clerk.user) {
            if (typeof Clerk.mountUserButton === 'function') {
                Clerk.mountUserButton(userButtonDiv, {
                    afterSignOutUrl: window.location.href
                });
            }
            currentState.currentUser = {
                name: Clerk.user.fullName || Clerk.user.firstName,
                email: Clerk.user.primaryEmailAddress.emailAddress
            };
        } else if (localSession) {
            userButtonDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${localSession.name} (Test)</span>
                    <button id="local-logout-btn" class="btn btn-ghost" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">로그아웃</button>
                </div>
            `;
            currentState.currentUser = localSession;
            document.getElementById('local-logout-btn')?.addEventListener('click', () => {
                sessionStorage.removeItem('local_test_user');
                location.reload();
            });
        }

        currentState.isLoggedIn = true;
        appContainer.classList.add('is-logged-in');
    } else {
        userButtonDiv.innerHTML = '';

        // Standard Login Button
        signInDiv.innerHTML = '<button id="explicit-login-btn" class="btn btn-outline">로그인</button>';
        document.getElementById('explicit-login-btn')?.addEventListener('click', () => {
            if (typeof Clerk.openSignIn === 'function') {
                Clerk.openSignIn();
            } else {
                alert('로그인 모듈을 불러오는 중입니다. 잠시 후 상단 "로그인" 버튼을 다시 클릭해 주세요.');
            }
        });

        // Add Local Test Login for localhost
        if (isLocal) {
            const testLoginDiv = document.createElement('div');
            testLoginDiv.style.cssText = 'margin-top: 0.5rem; display: flex; gap: 0.5rem;';
            testLoginDiv.innerHTML = `
                <input type="text" id="test-email-input" placeholder="test 이메일 입력" 
                    style="padding: 0.3rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-main); color: var(--text-main);">
                <button id="test-login-btn" class="btn btn-ghost" style="font-size: 0.75rem; padding: 0.3rem 0.5rem;">테스트 로그인</button>
            `;
            signInDiv.appendChild(testLoginDiv);

            document.getElementById('test-login-btn')?.addEventListener('click', () => {
                const email = document.getElementById('test-email-input').value.trim();
                if (email.includes('test')) {
                    const testUser = {
                        name: '테스트 계정',
                        email: email
                    };
                    sessionStorage.setItem('local_test_user', JSON.stringify(testUser));
                    location.reload();
                } else {
                    alert('이메일에 "test"가 포함되어야 합니다.');
                }
            });
        }

        // Also try to mount the standard Clerk button if possible
        if (typeof Clerk.mountSignInButton === 'function') {
            const mountDiv = document.createElement('div');
            mountDiv.style.marginTop = '0.5rem';
            signInDiv.appendChild(mountDiv);
            Clerk.mountSignInButton(mountDiv, {
                mode: 'modal'
            });
        }

        currentState.isLoggedIn = false;
        currentState.currentUser = null;
        appContainer.classList.remove('is-logged-in');
    }
    updateEditControlsVisibility();
}


init();
