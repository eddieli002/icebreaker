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
  var nextBtn = document.getElementById('btn-next');

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

    /*
      舊畫面被 hidden 後，原本停在按鈕上的焦點會掉回 body，
      鍵盤與讀螢幕使用者每次切換畫面都得重新 Tab 一輪。
      因此主動把焦點移進新畫面：
      - 抽卡頁交給「下一題」，使用者可以連續操作
      - 首頁交給畫面容器本身（tabindex="-1"），
        讀螢幕會依 aria-labelledby 朗讀標題，宣告「已經換頁了」
      preventScroll 避免瀏覽器為了聚焦而把畫面捲走。
    */
    var focusTarget = target === cardView ? nextBtn : homeView;
    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
    }
  }

  // ---------- 瀏覽器歷史 ----------

  /*
    手機使用者在抽卡頁按系統返回鍵時，預期是回到首頁而不是離開整個網站。
    做法是進入抽卡頁時推一筆歷史紀錄，但「不改動網址」——
    這樣在 GitHub Pages 子路徑下不必處理 base path，重新整理也不會落到不存在的路徑。
  */
  var historyEnabled = false;

  function pushCardState() {
    if (!window.history || !window.history.pushState) return;
    // 已經在抽卡頁的紀錄上就不再堆疊，否則返回鍵得按好幾次才回得到首頁
    if (window.history.state && window.history.state.icebreaker === 'card') {
      historyEnabled = true;
      return;
    }
    try {
      window.history.pushState({ icebreaker: 'card' }, '');
      historyEnabled = true;
    } catch (err) {
      // file:// 協定下部分瀏覽器會擋 pushState，退回單純切換畫面即可
      historyEnabled = false;
    }
  }

  /** 統一的回首頁入口：有歷史紀錄就走 back()，避免按鈕與返回鍵各走一套而堆疊多餘紀錄 */
  function goHome() {
    if (historyEnabled) {
      window.history.back();
    } else {
      showView(homeView);
    }
  }

  window.addEventListener('popstate', function (event) {
    var entry = event.state;
    // 使用者按了「前進」而且先前確實開過牌局，就還原抽卡頁；其餘一律回首頁
    if (entry && entry.icebreaker === 'card' && state.levelId !== null) {
      showView(cardView);
    } else {
      showView(homeView);
    }
  });

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

    /*
      互動卡取自獨立的 interactionCards 牌堆，不屬於任何層級，
      標成「Level 3 · 深入了解」會讓人誤以為它是該層級的題目，因此另外標示。
    */
    if (isInteraction) {
      cardLevelEl.textContent = '互動卡 · 不分層級';
    } else {
      cardLevelEl.textContent = state.randomMode
        ? '隨便抽一張 · ' + level.name
        : 'Level ' + level.id + ' · ' + level.name;
    }

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

    pushCardState();
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

  nextBtn.addEventListener('click', drawCard);

  document.getElementById('btn-home').addEventListener('click', goHome);

  buildLevelButtons();
})();
