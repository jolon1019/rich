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
    { id: 0, type: CELL_TYPES.START, name: 'GO起点', description: '经过起点获得2000元' },
    { id: 1, type: CELL_TYPES.PROPERTY, name: '老城街区', price: 600, rent: 50, color: '#e74c3c' },
    { id: 2, type: CELL_TYPES.PROPERTY, name: '河畔小区', price: 600, rent: 50, color: '#e74c3c' },
    { id: 3, type: CELL_TYPES.CHANCE, name: '?机会', description: '随机事件！' },
    { id: 4, type: CELL_TYPES.PROPERTY, name: '市中心广场', price: 1000, rent: 80, color: '#e74c3c' },
    { id: 5, type: CELL_TYPES.STATION, name: '中央车站', price: 2000, rent: 200 },
    { id: 6, type: CELL_TYPES.PROPERTY, name: '科技园', price: 1000, rent: 80, color: '#3498db' },
    { id: 7, type: CELL_TYPES.COMMUNITY, name: '⚙️公共基金', description: '公共事件！' },
    { id: 8, type: CELL_TYPES.PROPERTY, name: '文创园区', price: 1200, rent: 100, color: '#3498db' },
    { id: 9, type: CELL_TYPES.PROPERTY, name: '艺术区', price: 1400, rent: 120, color: '#3498db' },
    { id: 10, type: CELL_TYPES.JAIL, name: '🛑监狱', description: '探监或服刑中' },
    { id: 11, type: CELL_TYPES.PROPERTY, name: '美食街', price: 1400, rent: 120, color: '#f1c40f' },
    { id: 12, type: CELL_TYPES.UTILITY, name: '🔌电力公司', price: 1500, rent: 150 },
    { id: 13, type: CELL_TYPES.PROPERTY, name: '购物商城', price: 1600, rent: 140, color: '#f1c40f' },
    { id: 14, type: CELL_TYPES.PROPERTY, name: '娱乐中心', price: 1800, rent: 160, color: '#f1c40f' },
    { id: 15, type: CELL_TYPES.STATION, name: '🚄高铁站', price: 2000, rent: 200 },
    { id: 16, type: CELL_TYPES.PROPERTY, name: '度假村', price: 1800, rent: 160, color: '#2ecc71' },
    { id: 17, type: CELL_TYPES.CHANCE, name: '?机会', description: '随机事件！' },
    { id: 18, type: CELL_TYPES.PROPERTY, name: '高尔夫球场', price: 2000, rent: 180, color: '#2ecc71' },
    { id: 19, type: CELL_TYPES.PROPERTY, name: '游艇码头', price: 2200, rent: 200, color: '#2ecc71' },
    { id: 20, type: CELL_TYPES.FREE_PARKING, name: '🅿️免费停车', description: '休息一下~' },
    { id: 21, type: CELL_TYPES.PROPERTY, name: '金融街', price: 2200, rent: 200, color: '#9b59b6' },
    { id: 22, type: CELL_TYPES.PROPERTY, name: '证券中心', price: 2400, rent: 220, color: '#9b59b6' },
    { id: 23, type: CELL_TYPES.COMMUNITY, name: '⚙️公共基金', description: '公共事件！' },
    { id: 24, type: CELL_TYPES.PROPERTY, name: '总部大厦', price: 2600, rent: 240, color: '#9b59b6' },
    { id: 25, type: CELL_TYPES.STATION, name: '✈️国际机场', price: 2000, rent: 200 },
    { id: 26, type: CELL_TYPES.PROPERTY, name: '别墅区', price: 2600, rent: 240, color: '#e67e22' },
    { id: 27, type: CELL_TYPES.PROPERTY, name: '豪华庄园', price: 2800, rent: 260, color: '#e67e22' },
    { id: 28, type: CELL_TYPES.UTILITY, name: '💧自来水厂', price: 1500, rent: 150 },
    { id: 29, type: CELL_TYPES.PROPERTY, name: '🏰城堡酒店', price: 4000, rent: 400, color: '#e67e22' },
    { id: 30, type: CELL_TYPES.GO_TO_JAIL, name: '⛔进监狱', description: '去监狱待3回合！' },
    { id: 31, type: CELL_TYPES.PROPERTY, name: '🌆摩天大楼', price: 3500, rent: 350, color: '#1abc9c' }
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
    diceFace: document.getElementById('dice-face'),
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
            <label style="color: ${playerColors[i]}">玩家${i + 1}</label>
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

// 生成位置选择网格
function generateGridInput() {
    elements.gridInput.innerHTML = '';
    for (let i = 0; i < 32; i++) {
        const btn = document.createElement('button');
        btn.className = 'grid-btn';
        const cell = BOARD_CELLS[i];
        
        // 设置颜色边框
        if (cell.color) {
            btn.style.borderColor = cell.color;
            btn.style.borderWidth = '3px';
        }
        
        // 如果有拥有者，显示小标记
        let ownerMark = '';
        if (cell.owner !== undefined) {
            const owner = gameState.players.find(p => p.id === cell.owner);
            if (owner) {
                btn.style.backgroundColor = playerColors[owner.id] || '#ccc';
                btn.style.color = 'white';
            }
        }
        
        btn.title = cell.name;
        btn.innerHTML = `<span style="font-size:8px;line-height:1.2">${cell.name}</span>`;
        btn.addEventListener('click', () => selectCell(i));
        elements.gridInput.appendChild(btn);
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
            desc = `🏠 已被 ${owner.name} 拥有${cell.hasHouse ? ' (有房子)' : ''}`;
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

// 摇骰子
function rollDice() {
    if (gameState.diceRolled) return;
    
    elements.dice.classList.add('rolling');
    elements.rollDiceBtn.disabled = true;
    
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const tempValue = Math.floor(Math.random() * 6) + 1;
        elements.diceFace.textContent = tempValue;
        rollCount++;
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            finishRoll();
        }
    }, 50);
    
    function finishRoll() {
        const value = Math.floor(Math.random() * 6) + 1;
        elements.diceFace.textContent = value;
        elements.dice.classList.remove('rolling');
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
        
        // 播放移动动画
        const startPosition = player.position;
        let steps = value;
        let currentStep = 0;
        
        const moveInterval = setInterval(() => {
            const currentPos = (startPosition + currentStep) % 32;
            
            // 高亮当前格子
            document.querySelectorAll('.grid-btn').forEach((btn, idx) => {
                btn.classList.toggle('move-highlight', idx === currentPos);
                btn.classList.remove('selected');
            });
            
            currentStep++;
            
            if (currentStep > steps) {
                clearInterval(moveInterval);
                
                // 计算最终位置
                let newPosition = (startPosition + steps) % 32;
                let passedStart = startPosition + steps >= 32;
                
                if (passedStart) {
                    player.money += 2000;
                    showEvent('经过起点', '获得2000元！');
                }
                
                player.position = newPosition;
                
                // 如果停在自己的地块且是新购买的，清除新购买标记
                const newCell = BOARD_CELLS[newPosition];
                if (newCell.owner === player.id && newCell.newlyPurchased) {
                    newCell.newlyPurchased = false;
                }
                
                // 选中最终位置
                document.querySelectorAll('.grid-btn').forEach((btn, idx) => {
                    btn.classList.remove('move-highlight');
                    btn.classList.toggle('selected', idx === newPosition);
                });
                
                updateUI();
                handleCellEvent(newPosition);
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
            desc = `🏠 已被 ${owner.name} 拥有${cell.hasHouse ? ' (有房子)' : ''}`;
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
            showEvent('支付租金', `向${gameState.players[cell.owner].name}支付${rent}元`);
        } else {
            // 自己的地
            if (cell.hasHouse) {
                // 已经有房子了
                const infoDiv = document.createElement('div');
                infoDiv.style.padding = '10px';
                infoDiv.style.backgroundColor = '#e8f5e9';
                infoDiv.style.borderRadius = '8px';
                infoDiv.style.color = '#2e7d32';
                infoDiv.textContent = '✅ 已有房产，坐等收租！';
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
        showEvent('购买成功', `成功购买${cell.name}！下次经过可建房`);
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
        showEvent('建房成功', `在${cell.name}盖了房子！`);
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
                showEvent('游戏结束', `${gameState.players[0].name}获胜！`);
            } else {
                showEvent('破产', `${bankruptPlayer.name}破产了！`);
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
    const buttons = elements.gridInput.querySelectorAll('.grid-btn');
    buttons.forEach((btn, i) => {
        const cell = BOARD_CELLS[i];
        
        // 重置
        btn.style.backgroundColor = '';
        btn.style.color = '';
        
        // 如果有拥有者，显示颜色
        if (cell.owner !== undefined) {
            const owner = gameState.players.find(p => p.id === cell.owner);
            if (owner) {
                btn.style.backgroundColor = playerColors[owner.id] || '#ccc';
                btn.style.color = 'white';
            }
        }
    });
}

// 更新玩家状态
function updatePlayersStatus() {
    elements.playersStatusContainer.innerHTML = '';
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const div = document.createElement('div');
    div.className = `player-card player-color-${gameState.currentPlayerIndex}`;
    
    div.innerHTML = `
        <div style="font-size:18px;font-weight:bold;margin-bottom:8px;">🎯 ${currentPlayer.name} 的回合</div>
        <div class="money" style="font-size:24px;">${currentPlayer.money}元</div>
        <div class="properties">🏠 ${currentPlayer.properties.length}处地产${currentPlayer.inJail ? ' | 🔒 监狱中' : ''}</div>
        <div style="margin-top:10px;font-size:12px;color:#666;">
            其他玩家：
            ${gameState.players.map((p, i) => {
                if (i !== gameState.currentPlayerIndex) {
                    return `<span style="color:${playerColors[i]}">${p.name}(${p.money})</span>`;
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
