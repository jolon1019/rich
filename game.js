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
    { id: 0, type: CELL_TYPES.START, name: '北京', description: '经过起点获得2000元' },
    { id: 1, type: CELL_TYPES.PROPERTY, name: '天津', price: 600, rent: 50, color: '#e74c3c' },
    { id: 2, type: CELL_TYPES.PROPERTY, name: '石家庄', price: 600, rent: 50, color: '#e74c3c' },
    { id: 3, type: CELL_TYPES.CHANCE, name: '?机会', description: '随机事件！' },
    { id: 4, type: CELL_TYPES.PROPERTY, name: '太原', price: 1000, rent: 80, color: '#e74c3c' },
    { id: 5, type: CELL_TYPES.STATION, name: '北京南站', price: 2000, rent: 200 },
    { id: 6, type: CELL_TYPES.PROPERTY, name: '济南', price: 1000, rent: 80, color: '#3498db' },
    { id: 7, type: CELL_TYPES.COMMUNITY, name: '⚙️公共基金', description: '公共事件！' },
    { id: 8, type: CELL_TYPES.PROPERTY, name: '青岛', price: 1200, rent: 100, color: '#3498db' },
    { id: 9, type: CELL_TYPES.PROPERTY, name: '南京', price: 1400, rent: 120, color: '#3498db' },
    { id: 10, type: CELL_TYPES.JAIL, name: '🛑监狱', description: '探监或服刑中' },
    { id: 11, type: CELL_TYPES.PROPERTY, name: '上海', price: 1400, rent: 120, color: '#f1c40f' },
    { id: 12, type: CELL_TYPES.UTILITY, name: '🔌电力公司', price: 1500, rent: 150 },
    { id: 13, type: CELL_TYPES.PROPERTY, name: '杭州', price: 1600, rent: 140, color: '#f1c40f' },
    { id: 14, type: CELL_TYPES.PROPERTY, name: '宁波', price: 1800, rent: 160, color: '#f1c40f' },
    { id: 15, type: CELL_TYPES.STATION, name: '上海虹桥站', price: 2000, rent: 200 },
    { id: 16, type: CELL_TYPES.PROPERTY, name: '福州', price: 1800, rent: 160, color: '#2ecc71' },
    { id: 17, type: CELL_TYPES.CHANCE, name: '?机会', description: '随机事件！' },
    { id: 18, type: CELL_TYPES.PROPERTY, name: '厦门', price: 2000, rent: 180, color: '#2ecc71' },
    { id: 19, type: CELL_TYPES.PROPERTY, name: '广州', price: 2200, rent: 200, color: '#2ecc71' },
    { id: 20, type: CELL_TYPES.FREE_PARKING, name: '🅿️免费停车', description: '休息一下~' },
    { id: 21, type: CELL_TYPES.PROPERTY, name: '深圳', price: 2200, rent: 200, color: '#9b59b6' },
    { id: 22, type: CELL_TYPES.PROPERTY, name: '珠海', price: 2400, rent: 220, color: '#9b59b6' },
    { id: 23, type: CELL_TYPES.COMMUNITY, name: '⚙️公共基金', description: '公共事件！' },
    { id: 24, type: CELL_TYPES.PROPERTY, name: '成都', price: 2600, rent: 240, color: '#9b59b6' },
    { id: 25, type: CELL_TYPES.STATION, name: '广州白云机场', price: 2000, rent: 200 },
    { id: 26, type: CELL_TYPES.PROPERTY, name: '重庆', price: 2600, rent: 240, color: '#e67e22' },
    { id: 27, type: CELL_TYPES.PROPERTY, name: '西安', price: 2800, rent: 260, color: '#e67e22' },
    { id: 28, type: CELL_TYPES.UTILITY, name: '💧自来水厂', price: 1500, rent: 150 },
    { id: 29, type: CELL_TYPES.PROPERTY, name: '香港', price: 4000, rent: 400, color: '#e67e22' },
    { id: 30, type: CELL_TYPES.GO_TO_JAIL, name: '⛔进监狱', description: '去监狱待3回合！' },
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
    { title: '📱手机维修', description: '换屏幕花了350元', money: -350 }
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
    gameStarted: false
};

// DOM元素
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    playerNamesContainer: document.getElementById('player-names'),
    playersStatusContainer: document.getElementById('players-status'),
    gridInput: document.getElementById('grid-input'),
    dice: document.getElementById('dice'),
    rollDiceBtn: document.getElementById('roll-dice'),
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
const playerIcons = ['👩', '👸', '👴', '👧'];

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
    elements.rollDiceBtn.addEventListener('click', rollDice);
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
    gameState.players = [];
    
    for (let i = 0; i < parseInt(count); i++) {
        const nameInput = document.getElementById(`player-name-${i}`);
        gameState.players.push({
            id: i,
            name: nameInput.value || defaultNames[i],
            icon: playerIcons[i],
            money: 10000,
            position: 0,
            properties: [],
            inJail: false,
            jailTurns: 0
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

function buildCellContent(cell, index) {
    const btn = elements.gridInput.children[index];
    if (!btn) return;

    let html = `<span class="cell-name">${cell.name}</span>`;

    if (cell.owner !== undefined) {
        const owner = gameState.players.find(p => p.id === cell.owner);
        if (owner) {
            btn.style.backgroundColor = playerColors[owner.id] || '#ccc';
            btn.style.color = 'white';
            html += `<span class="owner-icon" style="border:2px solid ${playerColors[owner.id]}">${owner.icon}</span>`;
        }
    } else {
        btn.style.backgroundColor = '';
        btn.style.color = '';
    }

    if (cell.hasHouse) {
        html += '<span style="font-size:10px;margin-top:1px;">🏠</span>';
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

// 生成位置选择网格
function generateGridInput() {
    elements.gridInput.innerHTML = '';
    for (let i = 0; i < 32; i++) {
        const btn = document.createElement('button');
        btn.className = 'grid-btn';
        const cell = BOARD_CELLS[i];

        if (cell.color) {
            btn.style.borderColor = cell.color;
            btn.style.borderWidth = '3px';
        }

        btn.title = cell.name;
        btn.addEventListener('click', () => selectCell(i));
        elements.gridInput.appendChild(btn);
        buildCellContent(cell, i);
    }
}

// 选择格子 - 仅用于查看信息，不能改变位置
function selectCell(cellIndex) {
    if (!gameState.diceRolled) return;
    
    gameState.selectedCell = cellIndex;
    
    // 更新选中状态
    document.querySelectorAll('.grid-btn').forEach((btn, idx) => {
        btn.classList.toggle('selected', idx === cellIndex);
    });
    
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
            desc = `${owner.icon} 已被 ${owner.name} 拥有${cell.hasHouse ? ' (🏠有房子)' : ''}`;
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

    elements.dice.dataset.step = 0;
    elements.dice.classList.add('rolling');
    elements.rollDiceBtn.disabled = true;

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

        const player = gameState.players[gameState.currentPlayerIndex];

        if (player.inJail) {
            player.jailTurns--;
            if (player.jailTurns <= 0) {
                player.inJail = false;
                showEvent('出狱了', '服刑期满，释放出狱！');
            } else {
                showEvent('服刑中', `还有${player.jailTurns}回合才能出狱`);
                elements.endTurnBtn.disabled = false;
                updateUI();
                return;
            }
        }

        const fromPos = player.position;

        const moveInterval = setInterval(() => {
            const step = parseInt(elements.dice.dataset.step || 0) + 1;
            elements.dice.dataset.step = step;

            const movedTo = (fromPos + step) % 32;
            player.position = movedTo;

            updateGridButtons();

            document.querySelectorAll('.grid-btn').forEach((btn) => {
                btn.classList.remove('move-highlight');
            });
            elements.gridInput.children[movedTo]?.classList.add('move-highlight');

            if (step >= diceValue) {
                clearInterval(moveInterval);
                elements.dice.dataset.step = 0;

                let passedStart = fromPos + diceValue >= 32;

                if (passedStart) {
                    player.money += 2000;
                    showEvent('经过起点', '获得2000元！');
                }

                const newCell = BOARD_CELLS[movedTo];
                if (newCell.owner === player.id && newCell.newlyPurchased) {
                    newCell.newlyPurchased = false;
                }

                document.querySelectorAll('.grid-btn').forEach((btn, idx) => {
                    btn.classList.remove('move-highlight');
                    btn.classList.toggle('selected', idx === movedTo);
                });

                updateUI();
                handleCellEvent(movedTo);
            }
        }, 200);
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
        case CELL_TYPES.GO_TO_JAIL:
            player.inJail = true;
            player.jailTurns = 3;
            player.position = 10;
            // 更新选中状态
            document.querySelectorAll('.grid-btn').forEach((btn, idx) => {
                btn.classList.toggle('selected', idx === 10);
            });
            showEvent('进监狱', '去监狱待3回合！');
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
    if (cell.owner !== undefined) {
        if (cell.owner !== player.id) {
            // 别人的地，交租金
            const rent = calculateRent(cell);
            player.money -= rent;
            gameState.players[cell.owner].money += rent;
            showEvent('支付租金', `向${gameState.players[cell.owner].icon} ${gameState.players[cell.owner].name}支付${rent}元`);
        } else {
            // 自己的地
            if (cell.hasHouse) {
                // 已经有房子了
                const infoDiv = document.createElement('div');
                infoDiv.style.padding = '10px';
                infoDiv.style.backgroundColor = '#e8f5e9';
                infoDiv.style.borderRadius = '8px';
                infoDiv.style.color = '#2e7d32';
                infoDiv.textContent = `${player.icon} 已有房产，坐等收租！`;
                elements.cellActions.appendChild(infoDiv);
            } else if (cell.newlyPurchased) {
                // 刚购买，还需要再来一次才能建房
                const infoDiv = document.createElement('div');
                infoDiv.style.padding = '10px';
                infoDiv.style.backgroundColor = '#e3f2fd';
                infoDiv.style.borderRadius = '8px';
                infoDiv.style.color = '#1565c0';
                infoDiv.textContent = '🏗️ 下次经过时可建房';
                elements.cellActions.appendChild(infoDiv);
            } else if (cell.type === CELL_TYPES.PROPERTY && player.money >= cell.price) {
                // 已拥有且非新购买，可以建房
                const buildBtn = document.createElement('button');
                buildBtn.className = 'btn primary';
                buildBtn.textContent = `🏠 建房 (${cell.price}元)`;
                buildBtn.addEventListener('click', () => buildHouse(cell));
                elements.cellActions.appendChild(buildBtn);
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

// 计算租金
function calculateRent(cell) {
    if (cell.hasHouse) {
        return cell.rent * 5;
    }
    return cell.rent;
}

// 购买地产
function buyProperty(cell) {
    const player = gameState.players[gameState.currentPlayerIndex];
    if (player.money >= cell.price) {
        player.money -= cell.price;
        player.properties.push(cell.id);
        cell.owner = player.id;
        cell.newlyPurchased = true; // 标记为新购买
        showEvent('购买成功', `${player.icon} 成功购买${cell.name}！下次经过可建房`);
        updateCellDisplay(cell);
        updateUI();
        saveGame();
        // 购买成功后自动结束回合
        setTimeout(endTurn, 1500);
    }
}

// 建造房屋
function buildHouse(cell) {
    const player = gameState.players[gameState.currentPlayerIndex];
    if (player.money >= cell.price) {
        player.money -= cell.price;
        cell.hasHouse = true;
        showEvent('建房成功', `${player.icon} 在${cell.name}盖了房子！`);
        updateCellDisplay(cell);
        updateUI();
        saveGame();
        // 建房成功后自动结束回合
        setTimeout(endTurn, 1500);
    }
}

// 更新格子显示
function updateCellDisplay(cell) {
    let desc = cell.description || '';
    if (cell.owner !== undefined) {
        const owner = gameState.players.find(p => p.id === cell.owner);
        if (owner) {
            desc = `🏠 已被 ${owner.name} 拥有${cell.hasHouse ? ' (有房子)' : ''}`;
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
    player.money += event.money;
    showEvent(event.title, event.description);
}

// 处理公共事件
function handleCommunityEvent(player) {
    const event = COMMUNITY_EVENTS[Math.floor(Math.random() * COMMUNITY_EVENTS.length)];
    player.money += event.money;
    showEvent(event.title, event.description);
}



// 结束回合
function endTurn() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    gameState.diceRolled = false;
    gameState.selectedCell = null;
    elements.rollDiceBtn.disabled = false;
    
    document.querySelectorAll('.grid-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    updateUI();
    saveGame();
    
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
                    delete cell.hasHouse;
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
        <div style="font-size:18px;font-weight:bold;margin-bottom:8px;">${currentPlayer.icon} ${currentPlayer.name} 的回合</div>
        <div class="money" style="font-size:24px;">${currentPlayer.money}元</div>
        <div class="properties">🏠 ${currentPlayer.properties.length}处地产${currentPlayer.inJail ? ' | 🔒 监狱中' : ''}</div>
        <div style="margin-top:10px;font-size:12px;color:#666;">
            其他玩家：
            ${gameState.players.map((p, i) => {
                if (i !== gameState.currentPlayerIndex) {
                    return `<span style="color:${playerColors[i]}">${p.icon} ${p.name}(${p.money})</span>`;
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
            Object.assign(BOARD_CELLS, data.boardCells);
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
