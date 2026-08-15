/**
 * Icebreaker — 應用程式邏輯
 *
 * 純 Vanilla JS，無任何依賴。所有狀態只存在記憶體中，
 * 重新整理即回到首頁（SPEC 明訂不保存使用者資料）。
 *
 * 這個 App 同時支援兩種使用方式，程式邏輯刻意不去偏袒任何一種：
 *   模式 A 話題啟動器：抽一題 → 聊開 → 暫時離開 App
 *   模式 B 雙人互動遊戲：抽一題 → 回答 → 下一題 → 穿插互動卡 → 繼續
 * 因此「下一題」保持顯眼，延伸建議則做成使用者主動點擊才出現的次要入口。
 */
(function () {
  'use strict';

  var QUESTIONS = window.ICEBREAKER_QUESTIONS;
  var INTERACTIONS = window.ICEBREAKER_INTERACTIONS;

  // 題庫載入失敗時直接停止，避免後續一連串 null 錯誤淹沒 console
  if (!QUESTIONS || !Array.isArray(QUESTIONS.levels) || QUESTIONS.levels.length === 0) {
    console.error('[Icebreaker] 題庫載入失敗，請確認 data/questions.js 路徑是否正確。');
    return;
  }

  // 互動卡缺席不是致命錯誤：少了穿插節奏，但問題卡仍可正常玩
  if (!Array.isArray(INTERACTIONS)) {
    console.error('[Icebreaker] 互動卡載入失敗，請確認 data/interactions.js 路徑是否正確。');
    INTERACTIONS = [];
  }

  var LEVELS = QUESTIONS.levels;

  /** 互動卡出現機率，SPEC 要求約 10%–20% */
  var INTERACTION_RATE = 0.15;

  /**
   * 連續幾張問題卡之後，強制穿插一張互動卡。
   * 只靠 15% 機率有機會連開十幾題都不出現互動卡，
   * 整場就退化成一長串問答，這條規則是節奏的下限保證。
   *
   * 數值需與 INTERACTION_RATE 一起看：強制穿插會把互動卡實際比例推高。
   * 以 p = 0.15、上限 N 計算，問題卡的平均連續長度為
   *   E[L] = Σ(k=1..N-1) k·p·(1-p)^(k-1) + N·(1-p)^(N-1)
   * 互動卡佔比即 1 / (E[L] + 1)。上限設 5 會得到 21.2%，超出 SPEC 的 10%–20%；
   * 設 6 則為 19.4%，落在區間內（實測值見 README）。
   */
  var MAX_QUESTIONS_IN_A_ROW = 6;

  /** 各層級對應的 CSS 色票變數，索引對應 levels 陣列順序 */
  var LEVEL_COLORS = ['var(--lv1)', 'var(--lv2)', 'var(--lv3)', 'var(--lv4)', 'var(--lv5)'];

  /**
   * 延伸建議的呈現順序與標籤。
   * story → meaning → connection 是刻意的：
   * 先讓對方講出具體經驗，再談背後的想法，最後才把話題交還給另一個人。
   */
  var FOLLOWUP_ORDER = ['story', 'meaning', 'connection'];
  var FOLLOWUP_LABELS = {
    story: '往故事聊',
    meaning: '往想法聊',
    connection: '換你說說'
  };

  // ---------- DOM 參照 ----------
  var homeView = document.getElementById('view-home');
  var cardView = document.getElementById('view-card');
  var levelList = document.getElementById('level-list');
  var cardEl = document.getElementById('card');
  var cardTypeEl = document.getElementById('card-type');
  var cardQuestionEl = document.getElementById('card-question');
  var cardLevelEl = document.getElementById('card-level');
  var nextBtn = document.getElementById('btn-next');
  var followUpEl = document.getElementById('followup');
  var followUpLabelEl = document.getElementById('followup-label');
  var followUpTextEl = document.getElementById('followup-text');
  var followUpToggle = document.getElementById('btn-followup');
  var followUpBtnLabel = document.getElementById('followup-btn-label');

  // ---------- 狀態 ----------
  var state = {
    levelId: null,             // 目前層級 id，選定後不會自己改變
    lastText: null,            // 上一張卡的文字，用來避免立即重複
    lastWasInteraction: false, // 避免連續兩張互動卡，聊天節奏才不會被打斷
    questionsInARow: 0,        // 已連續出現幾張問題卡
    currentQuestion: null,     // 目前的問題物件；抽到互動卡時為 null
    followUpIndex: -1          // 已展開到第幾則延伸，-1 表示尚未展開
  };

  /**
   * 每個牌堆的剩餘卡片。
   * key 為 'level-1'…'level-5' 或 'interaction-1'…'interaction-5'，value 是已洗牌的陣列。
   * 互動卡依層級各自成堆，是因為每個層級可抽的互動卡範圍不同（見 depth 欄位）。
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
      if (q.length > 1 && q[lastIdx].text === avoidText) {
        var swapIdx = Math.floor(Math.random() * lastIdx);
        var tmp = q[lastIdx];
        q[lastIdx] = q[swapIdx];
        q[swapIdx] = tmp;
      }
      queues[key] = q;
    }

    // 從尾端取出，等同於依洗牌順序發牌
    return q.pop();
  }

  function getLevelById(id) {
    for (var i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].id === id) return LEVELS[i];
    }
    return LEVELS[0];
  }

  function getLevelColor(level) {
    var idx = LEVELS.indexOf(level);
    return LEVEL_COLORS[idx] || 'var(--accent)';
  }

  /**
   * 取出適用於指定層級的互動卡。
   * depth 為 [最小層級, 最大層級]，讓 Level 1 不會抽到過深的互動，
   * Level 5 也不會一直出現過輕的內容。沒標 depth 的卡視為全層級適用。
   */
  function interactionsForLevel(levelId) {
    return INTERACTIONS.filter(function (card) {
      if (!Array.isArray(card.depth)) return true;
      return levelId >= card.depth[0] && levelId <= card.depth[1];
    });
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

  // ---------- 延伸聊天（Follow-up）----------

  /** 目前題目實際可用的延伸方向；題庫某題若缺其中一類也不會壞掉 */
  function availableFollowUps() {
    var question = state.currentQuestion;
    if (!question || !question.followUps) return [];
    return FOLLOWUP_ORDER.filter(function (key) {
      return typeof question.followUps[key] === 'string' && question.followUps[key];
    });
  }

  /** 換新卡片時把延伸區收回初始狀態；互動卡沒有延伸內容，整個入口會被隱藏 */
  function resetFollowUp() {
    var keys = availableFollowUps();

    state.followUpIndex = -1;
    followUpEl.hidden = true;
    followUpLabelEl.textContent = '';
    followUpTextEl.textContent = '';

    followUpToggle.hidden = keys.length === 0;
    followUpToggle.setAttribute('aria-expanded', 'false');
    followUpBtnLabel.textContent = '延伸一下';
  }

  /**
   * 顯示下一則延伸建議。
   * 一次只顯示一則，避免把三則同時堆到卡片上讓畫面變得密集；
   * 三則都看過之後就把入口收起來，不做無限循環，
   * 因為那只會讓使用者反覆看到同樣的內容。
   */
  function showNextFollowUp() {
    var keys = availableFollowUps();
    if (keys.length === 0) return;

    state.followUpIndex++;
    if (state.followUpIndex >= keys.length) return;

    var key = keys[state.followUpIndex];
    followUpLabelEl.textContent = FOLLOWUP_LABELS[key];
    followUpTextEl.textContent = state.currentQuestion.followUps[key];
    followUpEl.hidden = false;
    followUpToggle.setAttribute('aria-expanded', 'true');

    if (state.followUpIndex >= keys.length - 1) {
      followUpToggle.hidden = true;
    } else {
      followUpBtnLabel.textContent = '再換一個';
    }
  }

  // ---------- 抽卡 ----------

  function drawCard() {
    // 層級由使用者選定後就固定，抽卡不會自己跳到更深或更淺的層級
    var level = getLevelById(state.levelId);
    var pool = interactionsForLevel(level.id);

    /*
      互動卡的出現條件：
      1. 這個層級真的有可用的互動卡
      2. 上一張不是互動卡（不連續出現）
      3. 已經連續 MAX_QUESTIONS_IN_A_ROW 張問題卡（強制穿插），或擲骰命中機率
    */
    var forced = state.questionsInARow >= MAX_QUESTIONS_IN_A_ROW;
    var useInteraction =
      pool.length > 0 &&
      !state.lastWasInteraction &&
      (forced || Math.random() < INTERACTION_RATE);

    var item;
    if (useInteraction) {
      item = drawFromQueue('interaction-' + level.id, pool, state.lastText);
      state.questionsInARow = 0;
      state.currentQuestion = null;
    } else {
      item = drawFromQueue('level-' + level.id, level.questions, state.lastText);
      state.questionsInARow++;
      state.currentQuestion = item;
    }

    state.lastText = item.text;
    state.lastWasInteraction = useInteraction;

    renderCard(level, item, useInteraction);
  }

  function renderCard(level, item, isInteraction) {
    // 互動卡改用另一個色系，讓使用者不必讀完文字就知道換了卡種
    var color = isInteraction ? 'var(--interaction)' : getLevelColor(level);
    cardView.style.setProperty('--level-color', color);

    cardTypeEl.textContent = isInteraction ? '互動卡' : '問題卡';
    cardQuestionEl.textContent = item.text;
    // 互動卡已依 depth 篩選成符合目前深度，顯示所在層級不會造成誤導
    cardLevelEl.textContent = 'Level ' + level.id + ' · ' + level.name;

    resetFollowUp();

    // 移除再強制重排後重新加上，animation 才會在同一元素上重播
    cardEl.classList.remove('card--enter');
    void cardEl.offsetWidth;
    cardEl.classList.add('card--enter');
  }

  function startLevel(levelId) {
    state.levelId = levelId;
    state.lastText = null;
    state.lastWasInteraction = false;
    state.questionsInARow = 0;
    state.currentQuestion = null;

    pushCardState();
    showView(cardView);
    drawCard();
  }

  // ---------- 首頁層級按鈕 ----------

  function buildLevelButtons() {
    LEVELS.forEach(function (level, idx) {
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
        startLevel(level.id);
      });

      levelList.appendChild(btn);
    });
  }

  // ---------- 事件綁定 ----------

  /*
    「幫我選一題」：替還沒想好深度的人隨機挑一個層級。
    挑定後就固定在該層級，之後的每一張卡都來自同一個深度，
    不會在遊玩途中突然跳到更深的層級。
  */
  document.getElementById('btn-random').addEventListener('click', function () {
    var pick = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    startLevel(pick.id);
  });

  nextBtn.addEventListener('click', drawCard);

  followUpToggle.addEventListener('click', showNextFollowUp);

  document.getElementById('btn-home').addEventListener('click', goHome);

  buildLevelButtons();
})();
