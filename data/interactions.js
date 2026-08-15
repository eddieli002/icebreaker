/**
 * Icebreaker 題庫資料 — Interaction Card
 *
 * 與 Conversation Question 分成兩個檔案，是因為兩者是不同性質的內容：
 * 問題卡讓兩個人「多了解彼此」，互動卡讓兩個人「一起做一件事」。
 * 分開放也讓各自的檔案維持在可讀的長度，編輯時不會互相干擾。
 *
 * ---------- 資料結構 ----------
 *
 * id     穩定識別碼（ix-NN），除錯與未來擴充用，不顯示於畫面
 * text   卡片本文
 * type   互動類型，供題庫管理與內容盤點使用，不影響前台流程：
 *          common  找共同點
 *          guess   猜對方
 *          either  二選一
 *          quick   快速選擇
 *          decide  共同決定
 *          team    小型合作挑戰
 *          predict 輕度預測
 *          share   交換觀點（第一版既有卡片多屬此類）
 * depth  [最小層級, 最大層級]，決定這張卡會在哪些 Level 出現。
 *        Level 1 抽到的互動卡不會突然要求很深的交換，
 *        Level 5 也不會一直出現過於輕的內容。
 *
 * ---------- 設計原則 ----------
 *
 * 不造成尷尬、不強迫親密、不要求敏感資訊、不假設兩人是情侶、
 * 不做人格測驗、不進行配對評分，優先創造「兩個人一起做事情」的感覺。
 *
 * 前 15 張為第一版既有卡片，文字未做改寫，僅補上 type 與 depth。
 */
window.ICEBREAKER_INTERACTIONS = [
  // ---------- 第一版既有卡片（文字沿用，不做改寫）----------
  { id: 'ix-01', text: '猜猜對方最常點的飲料，再一起公布答案。', type: 'guess', depth: [1, 3] },
  { id: 'ix-02', text: '各自想一個最想旅行的城市，數到三一起說。', type: 'quick', depth: [1, 3] },
  { id: 'ix-03', text: '10 秒內各自說三件最近讓自己開心的小事。', type: 'quick', depth: [1, 3] },
  { id: 'ix-04', text: '各自推薦一間真的會再去一次的餐廳。', type: 'share', depth: [1, 3] },
  { id: 'ix-05', text: '猜猜對方是計畫派還是隨性派，再讓對方公布答案。', type: 'guess', depth: [1, 4] },
  { id: 'ix-06', text: '各自用三個詞形容自己的理想週末。', type: 'share', depth: [1, 4] },
  { id: 'ix-07', text: '數到三，同時選：海邊、山上或城市。', type: 'quick', depth: [1, 3] },
  { id: 'ix-08', text: '各自推薦一首現在最適合播放的歌。', type: 'share', depth: [1, 3] },
  { id: 'ix-09', text: '各自說一件最近很想做、但一直還沒去做的事。', type: 'share', depth: [2, 5] },
  { id: 'ix-10', text: '互相推薦一道「下次一定要去吃」的食物。', type: 'share', depth: [1, 3] },
  { id: 'ix-11', text: '各自選：早起旅行或睡飽旅行，數到三一起回答。', type: 'either', depth: [1, 3] },
  { id: 'ix-12', text: '各自猜對方手機裡最常使用的 App 類型。', type: 'guess', depth: [1, 3] },
  { id: 'ix-13', text: '30 秒內一起找出三個共同喜歡的東西。', type: 'common', depth: [1, 4] },
  { id: 'ix-14', text: '各自說一個自己很無聊但其實很喜歡的小習慣。', type: 'share', depth: [2, 4] },
  { id: 'ix-15', text: '幫對方從今天的聊天內容取一個暫時的綽號。', type: 'team', depth: [2, 5] },

  // ---------- 找共同點 ----------
  { id: 'ix-16', text: '30 秒內找出三個你們都喜歡的食物。', type: 'common', depth: [1, 3] },
  { id: 'ix-17', text: '看看彼此的手機桌面，找出一個兩個人都有的 App。', type: 'common', depth: [1, 3] },
  { id: 'ix-18', text: '一起想出一個你們都去過、而且都喜歡的地方。', type: 'common', depth: [1, 4] },
  { id: 'ix-19', text: '找出一個你們都還沒去過、但都想去的地方。', type: 'common', depth: [1, 4] },
  { id: 'ix-20', text: '一起找出一件你們都不太喜歡做、但還是得做的事。', type: 'common', depth: [2, 4] },
  { id: 'ix-21', text: '找出一件你們的看法完全一樣的小事。', type: 'common', depth: [2, 4] },
  { id: 'ix-22', text: '一起找出三個你們都覺得被高估的東西。', type: 'common', depth: [2, 4] },

  // ---------- 猜對方 ----------
  { id: 'ix-23', text: '猜猜看對方比較喜歡海邊還是山上，再公布答案。', type: 'guess', depth: [1, 3] },
  { id: 'ix-24', text: '猜猜對方一週大概會外食幾次，再一起公布。', type: 'guess', depth: [1, 3] },
  { id: 'ix-25', text: '猜猜對方今天早上起床後做的第一件事，再讓對方公布。', type: 'guess', depth: [1, 3] },
  { id: 'ix-26', text: '猜猜對方最近一次熬夜是為了什麼。', type: 'guess', depth: [2, 4] },
  { id: 'ix-27', text: '猜猜對方做決定時比較靠直覺還是靠分析。', type: 'guess', depth: [3, 5] },
  { id: 'ix-28', text: '猜猜對方比較怕麻煩別人，還是比較怕被別人麻煩。', type: 'guess', depth: [3, 5] },

  // ---------- 二選一 ----------
  { id: 'ix-29', text: '旅行時，你們會選：行程排滿，還是留很多空白時間？先各自選，再說原因。', type: 'either', depth: [1, 4] },
  { id: 'ix-30', text: '出去玩時，你們會選：住得好一點，還是吃得好一點？先選再說。', type: 'either', depth: [1, 4] },
  { id: 'ix-31', text: '吃飯時，你們會選：吃熟悉的店，還是試沒吃過的店？先選再說原因。', type: 'either', depth: [1, 3] },
  { id: 'ix-32', text: '你們會選：做了再想，還是想清楚才做？選完各自說說為什麼。', type: 'either', depth: [2, 5] },
  { id: 'ix-33', text: '相處時，你們會選：安靜待著也很自在，還是一直有話聊？各自選完再交換原因。', type: 'either', depth: [2, 5] },
  { id: 'ix-34', text: '你們會選：朋友很多但大多普通，還是朋友很少但都很深？', type: 'either', depth: [3, 5] },
  { id: 'ix-35', text: '被誤會的時候，你們會選：解釋到底，還是算了不解釋？先各自選。', type: 'either', depth: [3, 5] },

  // ---------- 快速選擇 ----------
  { id: 'ix-36', text: '不用想太久：早起旅行 vs 睡到自然醒？', type: 'quick', depth: [1, 3] },
  { id: 'ix-37', text: '輪流快答，不准想：山 vs 海、貓 vs 狗、夏天 vs 冬天。', type: 'quick', depth: [1, 3] },
  { id: 'ix-38', text: '三秒內，各自說出一個現在最想喝的東西。', type: 'quick', depth: [1, 3] },
  { id: 'ix-39', text: '三秒內，各自說出一個現在最想去的地方。', type: 'quick', depth: [1, 3] },
  { id: 'ix-40', text: '不用想太久：傳訊息 vs 直接打電話？', type: 'quick', depth: [1, 4] },
  { id: 'ix-41', text: '各自用一個詞形容今天，數到三一起說出來。', type: 'quick', depth: [1, 4] },

  // ---------- 共同決定 ----------
  { id: 'ix-42', text: '如果現在突然多出兩個小時，你們一起決定最想去哪裡。', type: 'decide', depth: [1, 4] },
  { id: 'ix-43', text: '一起決定一首現在最適合放來聽的歌。', type: 'decide', depth: [1, 3] },
  { id: 'ix-44', text: '一起決定：如果還有下次，你們會想一起做什麼？', type: 'decide', depth: [2, 4] },
  { id: 'ix-45', text: '一起挑一個地方，當作「有機會要去看看」的口袋名單。', type: 'decide', depth: [2, 4] },
  { id: 'ix-46', text: '一起決定一件你們都願意試試看、但都還沒做過的小事。', type: 'decide', depth: [2, 4] },

  // ---------- 小型合作挑戰 ----------
  { id: 'ix-47', text: '輪流說一個想吃的東西，直到找到一個兩個人現在都願意去吃的。', type: 'team', depth: [1, 4] },
  { id: 'ix-48', text: '輪流各說一個字，合力接出一句完整通順的話。', type: 'team', depth: [1, 3] },
  { id: 'ix-49', text: '輪流說出一個兩個人都知道的名人，看誰先想不出來。', type: 'team', depth: [1, 4] },
  { id: 'ix-50', text: '一分鐘內，一起列出十件今天就可以做的小事。', type: 'team', depth: [1, 4] },
  { id: 'ix-51', text: '輪流講一句話，合力編出一個三十秒的小故事。', type: 'team', depth: [1, 4] },
  { id: 'ix-52', text: '一起想出五個可以形容對方的詞，但不能重複。', type: 'team', depth: [2, 4] },

  // ---------- 輕度預測 ----------
  { id: 'ix-53', text: '先猜對方週末比較可能宅在家還是跑出去，再一起公布答案。', type: 'predict', depth: [1, 4] },
  { id: 'ix-54', text: '先猜對方是不是那種會提前到場的人，再公布答案。', type: 'predict', depth: [1, 4] },
  { id: 'ix-55', text: '猜猜對方接下來一個月，最可能去做的一件新嘗試。', type: 'predict', depth: [2, 4] },
  { id: 'ix-56', text: '猜猜對方明年的這個時候，生活可能會有什麼不一樣。', type: 'predict', depth: [3, 5] },
  { id: 'ix-57', text: '先猜對方比較容易因為做了什麼後悔，還是因為沒做什麼後悔。', type: 'predict', depth: [3, 5] }
];
