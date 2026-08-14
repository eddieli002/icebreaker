/**
 * Icebreaker — 應用程式邏輯
 *
 * 純 Vanilla JS，無任何依賴。所有狀態只存在記憶體中，
 * 重新整理即回到首頁（SPEC 明訂不保存使用者資料）。
 */
(function () {
  'use strict';

  var DATA = window.ICEBREAKER_DATA;

  // 題庫載入失敗時直接停止，避免後續一連串 null 錯誤淹沒 console
  if (!DATA || !Array.isArray(DATA.levels) || DATA.levels.length === 0) {
    console.error('[Icebreaker] 題庫載入失敗，請確認 data/questions.js 路徑是否正確。');
    return;
  }

  /** 互動卡出現機率，SPEC 要求約 10%–20% */
  var INTERACTION_RATE = 0.15;

  /** 各層級對應的 CSS 色票變數，索引對應 levels 陣列順序 */
  var LEVEL_COLORS = ['var(--lv1)', 'var(--lv2)', 'var(--lv3)', 'var(--lv4)', 'var(--lv5)'];

  // ---------- DOM 參照 ----------
  var homeView = document.getElementById('view-home');
  var cardView = document.getElementById('view-card');
  var levelList = document.getElementById('level-list');
  var cardEl = document.getElementById('card');
  var cardTypeEl = document.getElementById('card-type');
  var cardQuestionEl = document.getElementById('card-question');
  var cardLevelEl = document.getElementById('card-level');

  // ---------- 狀態 ----------
  var state = {
    levelId: null,          // 目前層級 id
    randomMode: false,      // 「隨便抽一張」：每次抽卡都重新挑層級
    lastText: null,         // 上一張卡的文字，用來避免立即重複
    lastWasInteraction: false // 避免連續兩張互動卡，聊天節奏才不會被打斷
  };

  /**
   * 每個牌堆的剩餘題目。
   * key 為 'level-1'…'level-5' 或 'interaction'，value 是已洗牌的陣列。
   * 抽完才重新洗牌，因此同一 session 內在牌堆用盡前不會重複。
   */
  var queues = {};

  // ---------- 工具函式 ----------

  /** Fisher-Yates 洗牌，回傳新陣列不動到原始題庫 */
  function shuffle(source) {
    var arr = source.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  /**
   * 從指定牌堆抽一張。牌堆空了就重新洗牌。
   * avoidText 是上一張卡的文字：重新洗牌後若下一張正好相同，
   * 會與牌堆中其他位置交換，確保「不立即重複上一題」。
   */
  function drawFromQueue(key, source, avoidText) {
    var q = queues[key];

    if (!q || q.length === 0) {
      q = shuffle(source);
      var lastIdx = q.length - 1;
      if (q.length > 1 && q[lastIdx] === avoidText) {
        var swapIdx = Math.floor(Math.random() * lastIdx);
        q[lastIdx] = q[swapIdx];
        q[swapIdx] = avoidText;
      }
      queues[key] = q;
    }

    // 從尾端取出，等同於依洗牌順序發牌
    return q.pop();
  }

  function getLevelById(id) {
    for (var i = 0; i < DATA.levels.length; i++) {
      if (DATA.levels[i].id === id) return DATA.levels[i];
    }
    return DATA.levels[0];
  }

  function getLevelColor(level) {
    var idx = DATA.levels.indexOf(level);
    return LEVEL_COLORS[idx] || 'var(--accent)';
  }

  // ---------- 畫面切換 ----------

  function showView(target) {
    [homeView, cardView].forEach(function (view) {
      var isTarget = view === target;
      view.classList.toggle('view--active', isTarget);
      // hidden 屬性讓輔助技術也確實忽略非當前畫面
      view.hidden = !isTarget;
    });
    window.scrollTo(0, 0);
  }

  // ---------- 抽卡 ----------

  function drawCard() {
    // 隨機模式下每張卡都重新挑層級，其餘情況固定在使用者選的層級
    var level = state.randomMode
      ? DATA.levels[Math.floor(Math.random() * DATA.levels.length)]
      : getLevelById(state.levelId);

    var hasInteractionCards = Array.isArray(DATA.interactionCards) && DATA.interactionCards.length > 0;
    var useInteraction =
      hasInteractionCards &&
      !state.lastWasInteraction &&
      Math.random() < INTERACTION_RATE;

    var text;
    if (useInteraction) {
      text = drawFromQueue('interaction', DATA.interactionCards, state.lastText);
    } else {
      text = drawFromQueue('level-' + level.id, level.questions, state.lastText);
    }

    state.lastText = text;
    state.lastWasInteraction = useInteraction;

    renderCard(level, text, useInteraction);
  }

  function renderCard(level, text, isInteraction) {
    // 互動卡改用另一個色系，讓使用者不必讀完文字就知道換了卡種
    var color = isInteraction ? 'var(--interaction)' : getLevelColor(level);
    cardView.style.setProperty('--level-color', color);

    cardTypeEl.textContent = isInteraction ? '互動卡' : '問題卡';
    cardQuestionEl.textContent = text;
    cardLevelEl.textContent = state.randomMode
      ? '隨便抽一張 · ' + level.name
      : 'Level ' + level.id + ' · ' + level.name;

    // 移除再強制重排後重新加上，animation 才會在同一元素上重播
    cardEl.classList.remove('card--enter');
    void cardEl.offsetWidth;
    cardEl.classList.add('card--enter');
  }

  function startLevel(levelId, randomMode) {
    state.levelId = levelId;
    state.randomMode = !!randomMode;
    state.lastText = null;
    state.lastWasInteraction = false;

    showView(cardView);
    drawCard();
  }

  // ---------- 首頁層級按鈕 ----------

  function buildLevelButtons() {
    DATA.levels.forEach(function (level, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level';
      btn.style.setProperty('--level-color', LEVEL_COLORS[idx] || 'var(--accent)');

      var num = document.createElement('span');
      num.className = 'level__num';
      num.setAttribute('aria-hidden', 'true');
      num.textContent = String(level.id);

      var textWrap = document.createElement('span');
      textWrap.className = 'level__text';

      var name = document.createElement('span');
      name.className = 'level__name';
      name.textContent = level.name;

      var sub = document.createElement('span');
      sub.className = 'level__sub';
      sub.textContent = level.subtitle || '';

      textWrap.appendChild(name);
      textWrap.appendChild(sub);
      btn.appendChild(num);
      btn.appendChild(textWrap);

      btn.addEventListener('click', function () {
        startLevel(level.id, false);
      });

      levelList.appendChild(btn);
    });
  }

  // ---------- 事件綁定 ----------

  document.getElementById('btn-random').addEventListener('click', function () {
    startLevel(DATA.levels[0].id, true);
  });

  document.getElementById('btn-next').addEventListener('click', drawCard);

  document.getElementById('btn-switch').addEventListener('click', function () {
    showView(homeView);
  });

  document.getElementById('btn-home').addEventListener('click', function () {
    showView(homeView);
  });

  buildLevelButtons();
})();
