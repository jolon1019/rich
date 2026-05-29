// 音效管理器 - 真实骰子音效
const SoundManager = {
    ctx: null,
    _noiseBuffer: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this._noiseBuffer) {
            this._noiseBuffer = this._createNoiseBuffer();
        }
    },

    _createNoiseBuffer() {
        const size = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < size; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    },

    playDiceTick() {
        this.init();
        const now = this.ctx.currentTime;

        const src = this.ctx.createBufferSource();
        src.buffer = this._noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000 + Math.random() * 3000;
        filter.Q.value = 1 + Math.random() * 3;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12 + Math.random() * 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(now);
        src.stop(now + 0.04);
    },

    playDiceResult() {
        this.init();
        const now = this.ctx.currentTime;

        for (let i = 0; i < 5; i++) {
            const delay = now + i * 0.04;
            const src = this.ctx.createBufferSource();
            src.buffer = this._noiseBuffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1500 - i * 200;
            filter.Q.value = 2;

            const gain = this.ctx.createGain();
            const vol = 0.18 - i * 0.03;
            gain.gain.setValueAtTime(vol, delay);
            gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.06);

            src.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            src.start(delay);
            src.stop(delay + 0.06);
        }

        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        const thudFilter = this.ctx.createBiquadFilter();
        thudFilter.type = 'lowpass';
        thudFilter.frequency.value = 400;
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(120, now + 0.18);
        thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
        thudGain.gain.setValueAtTime(0.25, now + 0.18);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        thudOsc.connect(thudFilter);
        thudFilter.connect(thudGain);
        thudGain.connect(this.ctx.destination);
        thudOsc.start(now + 0.18);
        thudOsc.stop(now + 0.4);
    },

    playStep() {
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'highpass';
        filter.frequency.value = 500;

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }
};

// 游戏数据
const CELL_TYPES = {
    START: 'start',
    PROPERTY: 'property',
    CHANCE: 'chance',
    COMMUNITY: 'community',
    STATION: 'station',
    UTILITY: 'utility',
    TAX: 'tax',
    JAIL: 'jail',
    FREE_PARKING: 'free_parking',
    GO_TO_JAIL: 'go_to_jail'
};

// 现代风格地图配置（32格）
const BOARD_CELLS = [
    { id: 0, type: CELL_TYPES.START, name: '起点', description: '经过起点获得2000元' },
    { id: 1, type: CELL_TYPES.PROPERTY, name: '北京', price: 2600, rent: 250, color: '#e74c3c' },
    { id: 2, type: CELL_TYPES.PROPERTY, name: '石家庄', price: 600, rent: 50, color: '#e74c3c' },
    { id: 3, type: CELL_TYPES.CHANCE, name: '?机会', description: '随机事件！' },
    { id: 4, type: CELL_TYPES.PROPERTY, name: '太原', price: 1000, rent: 80, color: '#e74c3c' },
    { id: 5, type: CELL_TYPES.PROPERTY, name: '天津', price: 2000, rent: 200 },
    { id: 6, type: CELL_TYPES.PROPERTY, name: '济南', price: 1000, rent: 80, color: '#3498db' },
    { id: 7, type: CELL_TYPES.PROPERTY, name: '青岛', price: 1200, rent: 100, color: '#3498db' },
    { id: 8, type: CELL_TYPES.COMMUNITY, name: '⚙️公共基金', description: '公共事件！' },
    { id: 9, type: CELL_TYPES.PROPERTY, name: '南京', price: 1400, rent: 120, color: '#3498db' },
    { id: 10, type: CELL_TYPES.UTILITY, name: '🔌电力公司', price: 1500, rent: 150 },
    { id: 11, type: CELL_TYPES.PROPERTY, name: '上海', price: 1400, rent: 120, color: '#f1c40f' },
    { id: 12, type: CELL_TYPES.CHANCE, name: '?机会', description: '随机事件！' },
    { id: 13, type: CELL_TYPES.PROPERTY, name: '杭州', price: 1600, rent: 140, color: '#f1c40f' },
    { id: 14, type: CELL_TYPES.PROPERTY, name: '宁波', price: 1800, rent: 160, color: '#f1c40f' },
    { id: 15, type: CELL_TYPES.STATION, name: '上海虹桥站', price: 2000, rent: 200 },
    { id: 16, type: CELL_TYPES.PROPERTY, name: '福州', price: 1800, rent: 160, color: '#2ecc71' },
    { id: 17, type: CELL_TYPES.JAIL, name: '🛑监狱', description: '探监或服刑中' },
    { id: 18, type: CELL_TYPES.PROPERTY, name: '厦门', price: 2000, rent: 180, color: '#2ecc71' },
    { id: 19, type: CELL_TYPES.PROPERTY, name: '广州', price: 2200, rent: 200, color: '#2ecc71' },
    { id: 20, type: CELL_TYPES.STATION, name: '广州白云机场', price: 2000, rent: 200 },
    { id: 21, type: CELL_TYPES.PROPERTY, name: '深圳', price: 2200, rent: 200, color: '#9b59b6' },
    { id: 22, type: CELL_TYPES.PROPERTY, name: '珠海', price: 2400, rent: 220, color: '#9b59b6' },
    { id: 23, type: CELL_TYPES.JAIL, name: '🏥医院', description: '休息一下~' },
    { id: 24, type: CELL_TYPES.PROPERTY, name: '成都', price: 2600, rent: 240, color: '#9b59b6' },
    { id: 25, type: CELL_TYPES.FREE_PARKING, name: '🅿️免费停车', description: '休息一下~' },
    { id: 26, type: CELL_TYPES.PROPERTY, name: '重庆', price: 2600, rent: 240, color: '#e67e22' },
    { id: 27, type: CELL_TYPES.PROPERTY, name: '西安', price: 2800, rent: 260, color: '#e67e22' },
    { id: 28, type: CELL_TYPES.UTILITY, name: '💧自来水厂', price: 1500, rent: 150 },
    { id: 29, type: CELL_TYPES.PROPERTY, name: '香港', price: 4000, rent: 400, color: '#e67e22' },
    { id: 30, type: CELL_TYPES.CHANCE, name: '?运气', description: '看看运气如何！' },
    { id: 31, type: CELL_TYPES.PROPERTY, name: '澳门', price: 3500, rent: 350, color: '#1abc9c' }
];

// 随机事件
const CHANCE_EVENTS = [
    { title: '🎉恭喜中奖', description: '抽奖中了500元！', money: 500 },
    { title: '💰股票大涨', description: '股票赚了1000元！', money: 1000 },
    { title: '🎁生日礼物', description: '收到贵重礼物，价值300元', money: 300 },
    { title: '🏥医疗账单', description: '体检花了400元', money: -400 },
    { title: '🚗罚单', description: '超速罚款200元', money: -200 },
    { title: '🔧房屋维修', description: '房屋维修费300元', money: -300 },
    { title: '🎨艺术品升值', description: '收藏的画涨了600元！', money: 600 },
    { title: '🎫演唱会门票', description: '抢到票转手赚了250元', money: 250 },
    { title: '📱手机维修', description: '换屏幕花了350元', money: -350 },
    { title: '⛔进监狱', description: '交通违规，进监狱待3回合！', goToJail: true },
    { title: '🏥去医院', description: '身体不适，去医院休息1回合！', goToHospital: true }
];

const COMMUNITY_EVENTS = [
    { title: '🏘️社区分红', description: '社区基金分红200元', money: 200 },
    { title: '🌳公益活动', description: '为环保捐赠100元', money: -100 },
    { title: '💼年终奖', description: '公司发了800元奖金！', money: 800 },
    { title: '🏢物业费', description: '缴纳物业费150元', money: -150 },
    { title: '🛡️保险理赔', description: '保险理赔500元', money: 500 },
    { title: '🎓奖学金', description: '获得助学金400元', money: 400 },
    { title: '🎂生日派对', description: '办派对花了300元', money: -300 }
];

// 游戏状态
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    currentCell: 0,
    diceRolled: false,
    selectedCell: null,
    gameStarted: false,
    hasUpgradedThisTurn: false
};

// DOM元素
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    playerNamesContainer: document.getElementById('player-names'),
    playersStatusContainer: document.getElementById('players-status'),
    gridInput: document.getElementById('grid-input'),
    dice: document.getElementById('dice'),
    diceScene: document.getElementById('dice-scene'),
    endTurnBtn: document.getElementById('end-turn'),
    currentPlayerName: document.getElementById('current-player-name'),
    cellName: document.getElementById('cell-name'),
    cellDescription: document.getElementById('cell-description'),
    cellActions: document.getElementById('cell-actions'),
    menuModal: document.getElementById('menu-modal'),
    eventModal: document.getElementById('event-modal'),
    eventTitle: document.getElementById('event-title'),
    eventDescription: document.getElementById('event-description')
};

// 玩家默认名称
const defaultNames = ['孙小美', '钱夫人', '阿土伯', '金贝贝'];
const playerColors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
const playerIcons = ['🔴', '🔵', '🟡', '🟢'];

// 初始化
function init() {
    setupPlayerCountButtons();
    generatePlayerInputs(4);
    setupEventListeners();
    loadGame();
}

// 设置玩家数量按钮
function setupPlayerCountButtons() {
    const buttons = document.querySelectorAll('.player-count-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const count = parseInt(btn.dataset.count);
            generatePlayerInputs(count);
        });
    });
}

// 生成玩家输入框
function generatePlayerInputs(count) {
    elements.playerNamesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'player-name-input';
        div.innerHTML = `
            <label style="color: ${playerColors[i]}">${playerIcons[i]} 玩家${i + 1}</label>
            <input type="text" id="player-name-${i}" value="${defaultNames[i]}" maxlength="10">
        `;
        elements.playerNamesContainer.appendChild(div);
    }
}

// 设置事件监听器
function setupEventListeners() {
    document.getElementById('start-game').addEventListener('click', startGame);
    elements.diceScene.addEventListener('click', rollDice);
    elements.endTurnBtn.addEventListener('click', endTurn);
    document.getElementById('menu-btn').addEventListener('click', () => showModal('menu'));
    document.getElementById('resume-game').addEventListener('click', () => hideModal('menu'));
    document.getElementById('save-game').addEventListener('click', saveGame);
    document.getElementById('restart-game').addEventListener('click', restartGame);
    document.getElementById('event-confirm').addEventListener('click', () => hideModal('event'));
}

// 开始游戏
function startGame() {
    const count = document.querySelectorAll('.player-count-btn.active')[0].dataset.count;
    const startingMoneyInput = document.getElementById('starting-money');
    const startingMoney = Math.max(1000, parseInt(startingMoneyInput.value) || 10000);
    gameState.players = [];
    
    for (let i = 0; i < parseInt(count); i++) {
        const nameInput = document.getElementById(`player-name-${i}`);
        gameState.players.push({
            id: i,
            name: nameInput.value || defaultNames[i],
            icon: playerIcons[i],
            money: startingMoney,
            position: 0,
            properties: [],
            inJail: false,
            jailTurns: 0,
            inHospital: false,
            hospitalTurns: 0
        });
    }
    
    gameState.currentPlayerIndex = 0;
    gameState.currentCell = 0;
    gameState.diceRolled = false;
    gameState.gameStarted = true;
    
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.add('active');
    
    generateGridInput();
    updateUI();
    saveGame();
}

// 找到环形布局中的格子按钮
function findCellButton(index) {
    const topContainer = document.getElementById('board-top');
    const rightContainer = document.getElementById('board-right');
    const bottomContainer = document.getElementById('board-bottom');
    const leftContainer = document.getElementById('board-left');
    
    // 查找顶部
    if (index >= 0 && index <= 8) {
        return topContainer.children[index];
    }
    // 查找右侧
    if (index >= 9 && index <= 16) {
        return rightContainer.children[index - 9];
    }
    // 查找底部（反向）
    if (index >= 17 && index <= 25) {
        return bottomContainer.children[25 - index];
    }
    // 查找左侧（反向）
    if (index >= 26 && index <= 31) {
        return leftContainer.children[31 - index];
    }
    return null;
}

// 设置格子的默认背景色
function setCellDefaultBackground(btn, cell) {
    // 地产格子初始状态：浅色背景，只显示边框色
    if (cell.type === CELL_TYPES.PROPERTY) {
        btn.style.background = '#f5f0e6';
        btn.style.color = '#5d4e37';
        // 保留边框颜色
        if (cell.color) {
            btn.style.borderColor = cell.color;
        }
        return;
    }
    
    // 其他类型格子保持彩色背景
    switch (cell.type) {
        case CELL_TYPES.START:
            btn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)';
            btn.style.color = 'white';
            break;
        case CELL_TYPES.COMMUNITY:
            btn.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)';
            btn.style.color = 'white';
            break;
        case CELL_TYPES.CHANCE:
            btn.style.background = 'linear-gradient(135deg, #f9ca24 0%, #f0932b 100%)';
            btn.style.color = '#333';
            break;
        case CELL_TYPES.JAIL:
            btn.style.background = 'linear-gradient(135deg, #7f8c8d 0%, #95a5a6 100%)';
            btn.style.color = 'white';
            break;
        case CELL_TYPES.GO_TO_JAIL:
            btn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
            btn.style.color = 'white';
            break;
        case CELL_TYPES.FREE_PARKING:
            btn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            btn.style.color = 'white';
            break;
        case CELL_TYPES.TAX:
            btn.style.background = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
            btn.style.color = 'white';
            break;
        case CELL_TYPES.STATION:
            btn.style.background = 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)';
            btn.style.color = 'white';
            break;
        case CELL_TYPES.UTILITY:
            btn.style.background = 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)';
            btn.style.color = 'white';
            break;
        default:
            btn.style.background = '#f5f0e6';
            btn.style.color = '#5d4e37';
    }
}

function buildCellContent(cell, index) {
    const btn = findCellButton(index);
    if (!btn) return;

    let html = '';
    
    // 添加图标
    if (cell.type === CELL_TYPES.START) {
        html += '<div class="cell-icon" style="font-size:20px;">🚩</div>';
    } else if (cell.type === CELL_TYPES.JAIL) {
        html += '<div class="cell-icon" style="font-size:20px;">🏥</div>';
    } else if (cell.type === CELL_TYPES.FREE_PARKING) {
        html += '<div class="cell-icon" style="font-size:20px;">⛲</div>';
    } else if (cell.type === CELL_TYPES.TAX) {
        html += '<div class="cell-icon" style="font-size:20px;">💰</div>';
    } else if (cell.type === CELL_TYPES.CHANCE) {
        html += '<div class="cell-icon" style="font-size:20px;">🎴</div>';
    } else if (cell.type === CELL_TYPES.COMMUNITY) {
        html += '<div class="cell-icon" style="font-size:20px;">📦</div>';
    } else if (cell.type === CELL_TYPES.STATION) {
        html += '<div class="cell-icon" style="font-size:20px;">🚂</div>';
    } else if (cell.type === CELL_TYPES.UTILITY) {
        html += '<div class="cell-icon" style="font-size:20px;">⚡</div>';
    }

    html += `<span class="cell-name">${cell.name}</span>`;
    
    // 显示价格（如果是地产或车站且未拥有）
    if ((cell.type === CELL_TYPES.PROPERTY || cell.type === CELL_TYPES.STATION) && cell.price && cell.owner === undefined) {
        html += `<div class="cell-price">${cell.price}</div>`;
    }

    if (cell.owner !== undefined) {
        const owner = gameState.players.find(p => p.id === cell.owner);
        if (owner) {
            btn.style.background = playerColors[owner.id] || '#ccc';
            btn.style.color = 'white';
            html += `<span class="owner-icon" style="border:2px solid ${playerColors[owner.id]}">${owner.icon}</span>`;
        }
    } else {
        // 重置为默认背景色
        setCellDefaultBackground(btn, cell);
    }

    if (cell.type === CELL_TYPES.PROPERTY && cell.buildingLevel > 0) {
        const levelEmojis = ['', '🏠', '🏡', '🏘️', '🏢', '🏬', '🏰'];
        html += `<span class="building-icon">${levelEmojis[cell.buildingLevel]}</span>`;
    }

    const playersHere = gameState.players.filter(p => p.position === index);
    if (playersHere.length > 0) {
        html += '<div class="player-markers">';
        playersHere.forEach(p => {
            html += `<span class="player-marker" style="background:${playerColors[p.id]};border:2px solid rgba(255,255,255,0.8);">${p.icon}</span>`;
        });
        html += '</div>';
    }

    btn.innerHTML = html;
}

// 生成位置选择网格（环形布局）
function generateGridInput() {
    const topContainer = document.getElementById('board-top');
    const rightContainer = document.getElementById('board-right');
    const bottomContainer = document.getElementById('board-bottom');
    const leftContainer = document.getElementById('board-left');
    
    topContainer.innerHTML = '';
    rightContainer.innerHTML = '';
    bottomContainer.innerHTML = '';
    leftContainer.innerHTML = '';
    
    // 环形布局分配：
    // 顶部：0-8 (9格)
    for (let i = 0; i <= 8; i++) {
        addCellToContainer(topContainer, i);
    }
    
    // 右侧：9-16 (8格)
    for (let i = 9; i <= 16; i++) {
        addCellToContainer(rightContainer, i);
    }
    
    // 底部：17-25 (9格，反向)
    for (let i = 25; i >= 17; i--) {
        addCellToContainer(bottomContainer, i);
    }
    
    // 左侧：26-31 (6格，反向)
    for (let i = 31; i >= 26; i--) {
        addCellToContainer(leftContainer, i);
    }
}

// 添加格子到容器
function addCellToContainer(container, index) {
    const btn = document.createElement('button');
    btn.className = 'grid-btn';
    const cell = BOARD_CELLS[index];

    // 地产格子初始状态：浅色背景，只显示边框色
    if (cell.type === CELL_TYPES.PROPERTY) {
        btn.style.background = '#f5f0e6';
        btn.style.color = '#5d4e37';
        if (cell.color) {
            btn.style.borderColor = cell.color;
            btn.style.borderWidth = '3px';
        }
    } else {
        // 其他类型格子保持彩色背景
        switch (cell.type) {
            case CELL_TYPES.START:
                btn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)';
                btn.style.color = 'white';
                break;
            case CELL_TYPES.COMMUNITY:
                btn.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)';
                btn.style.color = 'white';
                break;
            case CELL_TYPES.CHANCE:
                btn.style.background = 'linear-gradient(135deg, #f9ca24 0%, #f0932b 100%)';
                btn.style.color = '#333';
                break;
            case CELL_TYPES.JAIL:
                btn.style.background = 'linear-gradient(135deg, #7f8c8d 0%, #95a5a6 100%)';
                btn.style.color = 'white';
                break;
            case CELL_TYPES.GO_TO_JAIL:
                btn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                btn.style.color = 'white';
                break;
            case CELL_TYPES.FREE_PARKING:
                btn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
                btn.style.color = 'white';
                break;
            case CELL_TYPES.TAX:
                btn.style.background = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
                btn.style.color = 'white';
                break;
            case CELL_TYPES.STATION:
                btn.style.background = 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)';
                btn.style.color = 'white';
                break;
            case CELL_TYPES.UTILITY:
                btn.style.background = 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)';
                btn.style.color = 'white';
                break;
        }
    }

    btn.title = cell.name;
    btn.addEventListener('click', () => selectCell(index));
    container.appendChild(btn);
    buildCellContent(cell, index);
}

// 选择格子 - 仅用于查看信息，不能改变位置
function selectCell(cellIndex) {
    if (!gameState.diceRolled) return;
    
    gameState.selectedCell = cellIndex;
    
    // 更新选中状态
    document.querySelectorAll('.grid-btn').forEach((btn) => {
        btn.classList.remove('selected');
    });
    const selectedBtn = findCellButton(cellIndex);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // 只显示格子信息，但不触发购买/移动等操作
    showCellInfo(cellIndex);
}

// 显示格子信息
function showCellInfo(cellIndex) {
    const cell = BOARD_CELLS[cellIndex];
    const player = gameState.players[gameState.currentPlayerIndex];
    
    elements.cellName.textContent = cell.name;
    
    // 显示拥有者信息
    let desc = cell.description || '';
    if (cell.owner !== undefined) {
        const owner = gameState.players.find(p => p.id === cell.owner);
        if (owner) {
            const levelEmojis = ['', '🏠', '🏡', '🏘️', '🏢', '🏬', '🏰'];
            const levelNames = ['', '平房', '小洋楼', '联排别墅', '高层公寓', '商业大厦', '城堡'];
            const level = cell.buildingLevel || 0;
            if (level > 0) {
                const rent = calculateRent(cell);
                desc = `${owner.icon} 已被 ${owner.name} 拥有 (${levelEmojis[level]}${levelNames[level]}，租金${rent}元)`;
            } else {
                desc = `${owner.icon} 已被 ${owner.name} 拥有`;
            }
        }
    } else if (cell.type === CELL_TYPES.PROPERTY || cell.type === CELL_TYPES.STATION || cell.type === CELL_TYPES.UTILITY) {
        desc = `💰 售价: ${cell.price}元`;
    }
    elements.cellDescription.textContent = desc;
    
    // 清空操作区
    elements.cellActions.innerHTML = '';
    
    // 只有当格子是玩家当前位置时才显示操作按钮
    if (cellIndex === player.position) {
        if (cell.type === CELL_TYPES.PROPERTY || cell.type === CELL_TYPES.STATION || cell.type === CELL_TYPES.UTILITY) {
            handlePropertyCell(cell, player);
        }
    }
}

// 显示骰子面（3D旋转到对应数字）
// 六面定位：正面=1, 背面=6, 顶面=2, 底面=5, 右面=3, 左面=4
const DICE_ROTATIONS = {
    1: { x: '0deg',    y: '0deg'    },
    2: { x: '90deg',   y: '0deg'    },
    3: { x: '0deg',    y: '90deg'   },
    4: { x: '0deg',    y: '-90deg'  },
    5: { x: '-90deg',  y: '0deg'    },
    6: { x: '0deg',    y: '-180deg' }
};

function showDiceFace(value) {
    const rot = DICE_ROTATIONS[value];
    elements.dice.style.setProperty('--final-x', `rotateX(${rot.x})`);
    elements.dice.style.setProperty('--final-y', `rotateY(${rot.y})`);
    elements.dice.dataset.face = value;
}

function setDiceFaceDirect(value) {
    const rot = DICE_ROTATIONS[value];
    elements.dice.style.transform = `translateZ(-50px) rotateX(${rot.x}) rotateY(${rot.y})`;
    elements.dice.dataset.face = value;
}

function setDiceRandomFace() {
    const v = Math.floor(Math.random() * 6) + 1;
    const rot = DICE_ROTATIONS[v];
    elements.dice.style.transform = `translateZ(-50px) rotateX(${rot.x}) rotateY(${rot.y})`;
    return v;
}

// 摇骰子
function rollDice() {
    if (gameState.diceRolled) return;

    const player = gameState.players[gameState.currentPlayerIndex];

    // 如果玩家在监狱或医院中，直接处理，不摇骰子
    const shouldSkip = handleJailOrHospital(player);
    if (shouldSkip) {
        elements.endTurnBtn.disabled = false;
        updateUI();
        return;
    }

    elements.dice.dataset.step = 0;
    elements.dice.classList.add('rolling');
    gameState.hasUpgradedThisTurn = false;

    let rollCount = 0;
    const rollInterval = setInterval(() => {
        setDiceRandomFace();
        SoundManager.playDiceTick();
        rollCount++;
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            finishRoll();
        }
    }, 50);

    function finishRoll() {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        elements.dice.classList.remove('rolling');
        setDiceFaceDirect(diceValue);
        SoundManager.playDiceResult();
        gameState.diceRolled = true;

        const fromPos = player.position;

        // 延迟开始移动，让骰子先显示结果
        setTimeout(() => {
            const moveInterval = setInterval(() => {
                const step = parseInt(elements.dice.dataset.step || 0) + 1;
                elements.dice.dataset.step = step;

                const movedTo = (fromPos + step) % 32;
                player.position = movedTo;

                // 每走一步播放音效
                SoundManager.playStep();

                updateGridButtons();

                document.querySelectorAll('.grid-btn').forEach((btn) => {
                    btn.classList.remove('move-highlight');
                });
                const movedBtn = findCellButton(movedTo);
                if (movedBtn) {
                    movedBtn.classList.add('move-highlight');
                }

                if (step >= diceValue) {
                    clearInterval(moveInterval);
                    elements.dice.dataset.step = 0;

                    let passedStart = fromPos + diceValue >= 32;
                    let landedOnStart = movedTo === 0;

                    // 只有经过起点但没有停在起点时才给奖励
                    if (passedStart && !landedOnStart) {
                        player.money += 2000;
                        showEvent('经过起点', '获得2000元！');
                    }

                    const newCell = BOARD_CELLS[movedTo];
                    if (newCell.owner === player.id && newCell.newlyPurchased) {
                        newCell.newlyPurchased = false;
                    }

                    document.querySelectorAll('.grid-btn').forEach((btn) => {
                        btn.classList.remove('move-highlight');
                        btn.classList.remove('selected');
                    });
                    const selectedBtn = findCellButton(movedTo);
                    if (selectedBtn) {
                        selectedBtn.classList.add('selected');
                    }

                    updateUI();
                    handleCellEvent(movedTo);
                }
            }, 500);
        }, 300);
    }
}

// 处理格子事件
function handleCellEvent(cellIndex) {
    const cell = BOARD_CELLS[cellIndex];
    const player = gameState.players[gameState.currentPlayerIndex];
    
    elements.cellName.textContent = cell.name;
    
    // 显示拥有者信息
    let desc = cell.description || '';
    if (cell.owner !== undefined) {
        const owner = gameState.players.find(p => p.id === cell.owner);
        if (owner) {
            desc = `${owner.icon} 已被 ${owner.name} 拥有${cell.hasHouse ? ' (🏠有房子)' : ''}`;
        }
    } else if (cell.type === CELL_TYPES.PROPERTY || cell.type === CELL_TYPES.STATION || cell.type === CELL_TYPES.UTILITY) {
        desc = `💰 售价: ${cell.price}元`;
    }
    elements.cellDescription.textContent = desc;
    
    elements.cellActions.innerHTML = '';
    
    switch (cell.type) {
        case CELL_TYPES.START:
            // 停在起点也获得2000元
            player.money += 2000;
            showEvent('到达起点', '获得2000元！');
            break;
        case CELL_TYPES.JAIL:
            // 路过监狱或医院不用进，只是休息
            if (cell.name === '🛑监狱') {
                showEvent('探监', '路过监狱，休息一下~');
            } else {
                showEvent('休息', '在医院休息一下~');
            }
            break;
        case CELL_TYPES.PROPERTY:
        case CELL_TYPES.STATION:
        case CELL_TYPES.UTILITY:
            handlePropertyCell(cell, player);
            break;
        case CELL_TYPES.CHANCE:
            handleChanceEvent(player);
            break;
        case CELL_TYPES.COMMUNITY:
            handleCommunityEvent(player);
            break;
        case CELL_TYPES.TAX:
            player.money -= 500;
            showEvent('缴税', '缴纳税金500元');
            break;
    }
    
    updateUI();
    saveGame();
}

// 处理地产格子
function handlePropertyCell(cell, player) {
    if (cell.type === CELL_TYPES.STATION) {
        handleStationCell(cell, player);
        return;
    }
    
    if (cell.owner !== undefined) {
        if (cell.owner !== player.id) {
            // 别人的地，交租金
            const rent = calculateRent(cell);
            player.money -= rent;
            gameState.players[cell.owner].money += rent;
            showEvent('支付租金', `向${gameState.players[cell.owner].icon} ${gameState.players[cell.owner].name}支付${rent}元`);
        } else {
            // 自己的地
            if (cell.newlyPurchased) {
                // 刚购买，还需要再来一次才能建房
                const infoDiv = document.createElement('div');
                infoDiv.style.padding = '10px';
                infoDiv.style.backgroundColor = '#e3f2fd';
                infoDiv.style.borderRadius = '8px';
                infoDiv.style.color = '#1565c0';
                infoDiv.textContent = '🏗️ 下次经过时可建房';
                elements.cellActions.appendChild(infoDiv);
            } else if (cell.type === CELL_TYPES.PROPERTY) {
                const currentLevel = cell.buildingLevel || 0;
                const upgradeCost = Math.floor(cell.price * (1 + currentLevel * 0.5));
                const maxLevel = 5;
                
                if (gameState.hasUpgradedThisTurn) {
                    // 本回合已升级过
                    const infoDiv = document.createElement('div');
                    infoDiv.style.padding = '10px';
                    infoDiv.style.backgroundColor = '#fff3e0';
                    infoDiv.style.borderRadius = '8px';
                    infoDiv.style.color = '#e65100';
                    infoDiv.textContent = '⏳ 本回合已升级过，下次经过可继续升级';
                    elements.cellActions.appendChild(infoDiv);
                } else if (currentLevel < maxLevel && player.money >= upgradeCost) {
                    const upgradeBtn = document.createElement('button');
                    upgradeBtn.className = 'btn primary';
                    const levelEmojis = ['🏠', '🏡', '🏘️', '🏢', '🏬', '🏰'];
                    upgradeBtn.textContent = `${levelEmojis[currentLevel + 1]} 升级为${levelEmojis[currentLevel + 1]} (${upgradeCost}元)`;
                    upgradeBtn.addEventListener('click', () => buildHouse(cell));
                    elements.cellActions.appendChild(upgradeBtn);
                } else if (currentLevel >= maxLevel) {
                    const infoDiv = document.createElement('div');
                    infoDiv.style.padding = '10px';
                    infoDiv.style.backgroundColor = '#e8f5e9';
                    infoDiv.style.borderRadius = '8px';
                    infoDiv.style.color = '#2e7d32';
                    infoDiv.textContent = `${player.icon} 建筑已达最高等级！`;
                    elements.cellActions.appendChild(infoDiv);
                }
            }
        }
    } else {
        // 未购买的地，只有当前玩家能买
        if (player.money >= cell.price) {
            const buyBtn = document.createElement('button');
            buyBtn.className = 'btn primary';
            buyBtn.textContent = `💰 购买 (${cell.price}元)`;
            buyBtn.addEventListener('click', () => buyProperty(cell));
            elements.cellActions.appendChild(buyBtn);
        } else {
            const infoDiv = document.createElement('div');
            infoDiv.style.padding = '10px';
            infoDiv.style.backgroundColor = '#fff3e0';
            infoDiv.style.borderRadius = '8px';
            infoDiv.style.color = '#e65100';
            infoDiv.textContent = '💸 资金不足，无法购买';
            elements.cellActions.appendChild(infoDiv);
        }
    }
}

// 处理车站格子
function handleStationCell(cell, player) {
    // 随机选择一个城市格子（只选择属性为PROPERTY的格子）
    const cityCells = BOARD_CELLS.filter(c => c.type === CELL_TYPES.PROPERTY);
    const randomCity = cityCells[Math.floor(Math.random() * cityCells.length)];
    const targetIndex = BOARD_CELLS.findIndex(c => c.id === randomCity.id);
    
    if (cell.owner !== undefined) {
        if (cell.owner !== player.id) {
            // 别人的车站，需要支付费用
            // 计算距离：从当前车站到目标城市的距离
            const currentStationIndex = BOARD_CELLS.findIndex(c => c.id === cell.id);
            const distance = Math.abs(targetIndex - currentStationIndex);
            const cost = distance * 100;
            
            player.money -= cost;
            // 拥有者享受70%的收入
            const ownerIncome = Math.floor(cost * 0.7);
            gameState.players[cell.owner].money += ownerIncome;
            
            // 移动到目标城市
            player.position = targetIndex;
            
            showEvent('乘坐车站', `支付${cost}元，前往${randomCity.name}！${gameState.players[cell.owner].icon}获得${ownerIncome}元`);
        } else {
            // 自己的车站，免费传送
            player.position = targetIndex;
            showEvent('乘坐自己的车站', `免费前往${randomCity.name}！`);
        }
    } else {
        // 未购买的车站，免费传送
        player.position = targetIndex;
        
        if (player.money >= cell.price) {
            const buyBtn = document.createElement('button');
            buyBtn.className = 'btn primary';
            buyBtn.textContent = `💰 购买车站 (${cell.price}元)`;
            buyBtn.addEventListener('click', () => buyProperty(cell));
            elements.cellActions.appendChild(buyBtn);
            
            showEvent('车站传送', `免费前往${randomCity.name}！可选择购买该车站`);
        } else {
            showEvent('车站传送', `免费前往${randomCity.name}！`);
        }
    }
    
    updateUI();
    updateGridButtons();
}

// 计算租金
function calculateRent(cell) {
    const level = cell.buildingLevel || 0;
    return Math.floor(cell.rent * (1 + level * 1.5));
}

// 购买地产
function buyProperty(cell) {
    const player = gameState.players[gameState.currentPlayerIndex];
    if (player.money >= cell.price) {
        player.money -= cell.price;
        player.properties.push(cell.id);
        cell.owner = player.id;
        cell.newlyPurchased = true; // 标记为新购买
        cell.buildingLevel = 0;
        showEvent('购买成功', `${player.icon} 成功购买${cell.name}！下次经过可建房`);
        updateCellDisplay(cell);
        updateUI();
        saveGame();
        // 购买成功后自动结束回合
        setTimeout(endTurn, 1500);
    }
}

// 建造/升级房屋
function buildHouse(cell) {
    const player = gameState.players[gameState.currentPlayerIndex];
    const currentLevel = cell.buildingLevel || 0;
    const upgradeCost = Math.floor(cell.price * (1 + currentLevel * 0.5));
    const maxLevel = 5;
    
    if (currentLevel < maxLevel && player.money >= upgradeCost && !gameState.hasUpgradedThisTurn) {
        player.money -= upgradeCost;
        cell.buildingLevel = currentLevel + 1;
        gameState.hasUpgradedThisTurn = true;
        const levelEmojis = ['', '🏠', '🏡', '🏘️', '🏢', '🏬', '🏰'];
        const levelNames = ['', '平房', '小洋楼', '联排别墅', '高层公寓', '商业大厦', '城堡'];
        showEvent('升级成功', `${player.icon} 在${cell.name}建造了${levelNames[cell.buildingLevel]}${levelEmojis[cell.buildingLevel]}！`);
        updateCellDisplay(cell);
        updateUI();
        saveGame();
        // 升级成功后自动结束回合
        setTimeout(endTurn, 1500);
    }
}

// 更新格子显示
function updateCellDisplay(cell) {
    let desc = cell.description || '';
    if (cell.owner !== undefined) {
        const owner = gameState.players.find(p => p.id === cell.owner);
        if (owner) {
            const levelEmojis = ['', '🏠', '🏡', '🏘️', '🏢', '🏬', '🏰'];
            const levelNames = ['', '平房', '小洋楼', '联排别墅', '高层公寓', '商业大厦', '城堡'];
            const level = cell.buildingLevel || 0;
            if (level > 0) {
                desc = `${levelEmojis[level]} 已被 ${owner.name} 拥有 (${levelNames[level]})`;
            } else {
                desc = `已被 ${owner.name} 拥有`;
            }
        }
    } else if (cell.type === CELL_TYPES.PROPERTY || cell.type === CELL_TYPES.STATION || cell.type === CELL_TYPES.UTILITY) {
        desc = `💰 售价: ${cell.price}元`;
    }
    elements.cellDescription.textContent = desc;
    elements.cellActions.innerHTML = '';
    const player = gameState.players[gameState.currentPlayerIndex];
    handlePropertyCell(cell, player);
}

// 处理机会事件
function handleChanceEvent(player) {
    const event = CHANCE_EVENTS[Math.floor(Math.random() * CHANCE_EVENTS.length)];
    if (event.goToJail) {
        player.inJail = true;
        player.jailTurns = 3;
        player.position = 10;
        // 更新选中状态
        document.querySelectorAll('.grid-btn').forEach((btn, idx) => {
            btn.classList.toggle('selected', idx === 10);
        });
        updateGridButtons();
        showEvent(event.title, event.description);
    } else if (event.goToHospital) {
        player.inHospital = true;
        player.hospitalTurns = 1;
        player.position = 23;
        // 更新选中状态
        document.querySelectorAll('.grid-btn').forEach((btn, idx) => {
            btn.classList.toggle('selected', idx === 23);
        });
        updateGridButtons();
        showEvent(event.title, event.description);
    } else {
        player.money += event.money;
        showEvent(event.title, event.description);
    }
}

// 处理公共事件
function handleCommunityEvent(player) {
    const event = COMMUNITY_EVENTS[Math.floor(Math.random() * COMMUNITY_EVENTS.length)];
    player.money += event.money;
    showEvent(event.title, event.description);
}



// 处理监狱或医院状态
function handleJailOrHospital(player, shouldDecrement = true) {
    if (player.inJail) {
        if (shouldDecrement) {
            player.jailTurns--;
            if (player.jailTurns <= 0) {
                player.inJail = false;
                showEvent('出狱了', '服刑期满，释放出狱！');
                return false; // 不需要跳过回合
            } else {
                showEvent('服刑中', `还有${player.jailTurns}回合才能出狱`);
                return true; // 需要跳过回合
            }
        } else {
            showEvent('服刑中', `还有${player.jailTurns}回合才能出狱`);
            return true; // 需要跳过回合
        }
    }

    if (player.inHospital) {
        if (shouldDecrement) {
            player.hospitalTurns--;
            if (player.hospitalTurns <= 0) {
                player.inHospital = false;
                showEvent('出院了', '身体康复，出院啦！');
                return false; // 不需要跳过回合
            } else {
                showEvent('住院中', `还有${player.hospitalTurns}回合才能出院`);
                return true; // 需要跳过回合
            }
        } else {
            showEvent('住院中', `还有${player.hospitalTurns}回合才能出院`);
            return true; // 需要跳过回合
        }
    }

    return false; // 不在监狱或医院
}

// 结束回合
function endTurn() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    gameState.diceRolled = false;
    gameState.selectedCell = null;
    gameState.hasUpgradedThisTurn = false;
    
    document.querySelectorAll('.grid-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    updateUI();
    saveGame();
    
    // 检查新玩家是否在监狱或医院中
    const newPlayer = gameState.players[gameState.currentPlayerIndex];
    const shouldSkip = handleJailOrHospital(newPlayer, false);
    
    if (shouldSkip) {
        elements.endTurnBtn.disabled = false;
        updateUI();
        // 延迟一下，让弹窗显示出来
        setTimeout(() => {
        }, 100);
    }
    
    checkBankruptcy();
}

// 检查破产
function checkBankruptcy() {
    for (let i = gameState.players.length - 1; i >= 0; i--) {
        if (gameState.players[i].money < 0) {
            const bankruptPlayer = gameState.players[i];
            
            BOARD_CELLS.forEach(cell => {
                if (cell.owner === bankruptPlayer.id) {
                    delete cell.owner;
                    delete cell.buildingLevel;
                    delete cell.newlyPurchased;
                }
            });
            
            gameState.players.splice(i, 1);
            
            if (gameState.currentPlayerIndex >= i) {
                gameState.currentPlayerIndex = Math.max(0, gameState.currentPlayerIndex - 1);
            }
            
            if (gameState.players.length === 1) {
                showEvent('游戏结束', `${gameState.players[0].icon} ${gameState.players[0].name}获胜！`);
            } else {
                showEvent('破产', `${bankruptPlayer.icon} ${bankruptPlayer.name}破产了！`);
            }
            
            updateUI();
        }
    }
}

// 显示弹窗
function showEvent(title, description) {
    elements.eventTitle.textContent = title;
    elements.eventDescription.textContent = description;
    showModal('event');
}

function showModal(type) {
    if (type === 'menu') {
        elements.menuModal.classList.add('active');
    } else if (type === 'event') {
        elements.eventModal.classList.add('active');
    }
}

function hideModal(type) {
    if (type === 'menu') {
        elements.menuModal.classList.remove('active');
    } else if (type === 'event') {
        elements.eventModal.classList.remove('active');
    }
}

// 更新UI
function updateUI() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    elements.currentPlayerName.textContent = currentPlayer.name;
    updatePlayersStatus();
    updateGridButtons();
}

// 更新格子按钮显示
function updateGridButtons() {
    BOARD_CELLS.forEach((cell, i) => buildCellContent(cell, i));
}

// 更新玩家状态
function updatePlayersStatus() {
    elements.playersStatusContainer.innerHTML = '';
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const div = document.createElement('div');
    div.className = `player-card player-color-${gameState.currentPlayerIndex}`;
    
    div.innerHTML = `
        <div style="font-size:22px;font-weight:bold;margin-bottom:8px;"><span style="font-size:26px;">${currentPlayer.icon}</span> ${currentPlayer.name} 的回合</div>
        <div class="money" style="font-size:24px;">${currentPlayer.money}元</div>
        <div class="properties">🏠 ${currentPlayer.properties.length}处地产${currentPlayer.inJail ? ' | 🔒 监狱中' : ''}${currentPlayer.inHospital ? ' | 🏥 住院中' : ''}</div>
        <div style="margin-top:10px;font-size:13px;color:#666;">
            其他玩家：
            ${gameState.players.map((p, i) => {
                if (i !== gameState.currentPlayerIndex) {
                    return `<span style="color:${playerColors[i]}"><span style="font-size:16px;">${p.icon}</span> ${p.name}(${p.money})</span>`;
                }
                return '';
            }).join(' | ')}
        </div>
    `;
    
    elements.playersStatusContainer.appendChild(div);
}

// 保存游戏
function saveGame() {
    const saveData = {
        gameState: gameState,
        boardCells: BOARD_CELLS
    };
    localStorage.setItem('richmanGame', JSON.stringify(saveData));
}

// 加载游戏
function loadGame() {
    const saved = localStorage.getItem('richmanGame');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // 只加载游戏状态，不覆盖棋盘配置，因为棋盘可能在代码中更新了
            Object.assign(gameState, data.gameState);
        } catch (e) {
            console.error('加载失败', e);
        }
    }
}

// 重新开始
function restartGame() {
    localStorage.removeItem('richmanGame');
    location.reload();
}

// 启动
init();
