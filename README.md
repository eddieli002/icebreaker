# Icebreaker Web Game

一個給兩個人使用的手機版破冰聊天遊戲。

打開網頁後選一個聊天深度，就會隨機抽出一張題目卡，兩人輪流回答並自由延伸話題。

**現況：MVP 已完成，可直接部署。**

---

## 特色

- 純靜態網站，不需要後端、資料庫或登入
- 5 個聊天層級，共 100 題，另有 15 張互動卡
- 抽卡採洗牌牌堆，一輪內不會重複，也不會立即抽到上一題
- 「隨便抽一張」模式可跨層級隨機抽題
- 行動優先設計，大字、大按鈕、單手可操作
- 手機系統返回鍵可回到首頁，不會直接離開網站
- 切換畫面時自動搬移鍵盤焦點，鍵盤與讀螢幕使用者不必重新 Tab
- 零第三方依賴，無任何 npm 套件

---

## 專案結構

```text
icebreaker/
├── index.html          # 唯一進入點，含首頁與抽卡頁兩個畫面
├── css/
│   └── style.css       # 全站樣式（行動優先、CSS 變數配色）
├── js/
│   └── app.js          # 抽卡邏輯、防重複、畫面切換
├── data/
│   └── questions.js    # 題庫資料（掛載於 window.ICEBREAKER_DATA）
├── .gitignore          # 排除僅保留於本機的開發文件
├── .nojekyll           # 讓 GitHub Pages 略過 Jekyll 處理
└── README.md           # 本文件
```

### 為什麼題庫是 `.js` 而不是 `.json`

若用 `fetch()` 讀取 `questions.json`，在 `file://` 協定下會被瀏覽器 CORS 政策擋掉，導致直接開啟 HTML 檔時題庫載入失敗。改成 `.js` 並以 `<script>` 掛載全域變數，本機直接開檔與 GitHub Pages 兩種情境都能正常運作，且仍維持純靜態架構。

---

## 本機執行

### 方式一：直接開啟（最快）

用瀏覽器開啟 `index.html` 即可。因為沒有使用 `fetch()`，`file://` 下也能正常運作。

### 方式二：本機 static server（建議）

較貼近實際部署環境：

```bash
cd icebreaker
python -m http.server 8000
```

然後開啟 <http://localhost:8000>。

本機 server 只用於開發測試，網站本身不依賴它。

---

## 部署到 GitHub Pages

### 1. 建立 Git repository

```bash
cd icebreaker
git init
git add .
git commit -m "feat: 完成 Icebreaker MVP"
```

### 2. 推送到 GitHub

在 GitHub 建立新的 repository 後：

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git branch -M main
git push -u origin main
```

### 3. 開啟 Pages

1. 進入 repository 的 `Settings`
2. 左側選單找到 `Pages`
3. Build and deployment 選擇 **Deploy from a branch**
4. Branch 選 **main**，Folder 選 **/ (root)**
5. 儲存

網址格式為 `https://<username>.github.io/<repository-name>/`。

所有資源皆使用相對路徑，因此在 repository 子路徑下可正常運作，**不需要**設定 base URL 或修改任何檔案。

---

## 已驗證項目

以下 24 項已在 headless 瀏覽器（390×844 視窗）中以 `http://` 與 `file://` 兩種協定各跑一次，全數通過：

| 項目 | 結果 |
| --- | --- |
| 5 個 Level，各 20 題 | 通過 |
| 互動卡 15 張 | 通過 |
| 題目文字與原始題庫逐字一致 | 通過 |
| 連抽 600 次無立即重複 | 通過 |
| 一輪 20 題內無重複，抽完自動重新洗牌 | 通過 |
| 不會連續出現兩張互動卡 | 通過 |
| 互動卡比例落在 10%–20% | 通過 |
| 互動卡標籤不會誤標成某個 Level | 通過 |
| 「隨便抽一張」確實跨層級 | 通過 |
| 進入抽卡頁後焦點自動落在「下一題」 | 通過 |
| 回首頁後焦點自動落在首頁容器 | 通過 |
| 進入抽卡頁會推入一筆 history 紀錄 | 通過 |
| 返回鍵 / ← 一次即可回首頁，重複進出不會堆疊紀錄 | 通過 |
| 子路徑（`/icebreaker/…`）下 CSS、JS、題庫皆回傳 200 | 通過 |
| 390px 視窗下無水平捲動（`scrollWidth` = `innerWidth`） | 通過 |
| 無 console error、無未捕捉例外 | 通過 |

### 建議在實機補測

自動化測試無法涵蓋觸控手感，建議在實體手機上確認：

- 按鈕是否好按、拇指是否搆得到
- iPhone 瀏海與底部橫條是否遮住內容（已用 `safe-area-inset` 處理）
- 深色模式下的可讀性（目前僅提供淺色主題）

---

## 修改題庫

編輯 `data/questions.js` 即可，不需要任何建置步驟。

新增題目時請遵守以下題目設計規則：

- 優先使用開放式問題
- 不要像面試
- 不要求敏感個資
- 不假設兩人是情侶、不假設性別或性向
- 每個問題最好能在 5 秒內理解

新增層級時只要在 `levels` 陣列加一筆（含 `id`、`name`、`subtitle`、`questions`），首頁按鈕會自動產生。若層級超過 5 個，請一併在 `css/style.css` 補上對應的 `--lv6` 色票，否則會退回預設的 `--accent` 色。

調整互動卡比例請改 `js/app.js` 的 `INTERACTION_RATE`（預設 `0.15`）。

---

## 已知限制

- 只有淺色主題，尚未支援 Dark Mode
- 重新整理會回到首頁，不保留當前題目（SPEC 明訂不保存使用者資料）
- 沒有「上一題」功能
- 抽題紀錄只存在記憶體，關掉分頁即清空
- 手機實體裝置尚未實測（僅 headless 瀏覽器驗證）
- favicon 以 SVG data URI 提供，極舊版瀏覽器不支援 SVG 圖示時會顯示預設圖示
- 返回鍵支援倚賴 `history.pushState`；若瀏覽器在 `file://` 下擋下該 API，會自動退回「只有 ← 可回首頁」的行為

---

## 後續可考慮

以下皆非第一版必要功能：

- 收藏喜歡的題目
- 情境模式（第一次見面、等餐、散步）
- 自訂題庫
- Dark Mode
- 多語言
- PWA / 離線使用
- 分享網站 QR Code
- 更完整的抽卡動畫
