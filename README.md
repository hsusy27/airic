# AIRIC 內部入口網

中心新進同仁導覽頁：座位圖、第一週待辦、空間規範、常用系統。
純靜態網頁（HTML / CSS / JavaScript），不需要伺服器、不需要資料庫，放上 GitHub Pages 就能用。

---

## 目錄

1. [先看這個：資安提醒](#1-先看這個資安提醒)
2. [密碼保護](#15-密碼保護)
3. [檔案結構](#2-檔案結構)
4. [怎麼在自己電腦上預覽](#3-怎麼在自己電腦上預覽)
5. [上架到 GitHub Pages](#4-上架到-github-pages)
6. [日常維護：改內容](#5-日常維護改內容)
7. [進階：改樣式與圖](#6-進階改樣式與圖)
8. [壞掉了怎麼辦](#7-壞掉了怎麼辦)

---

## 1. 先看這個：資安提醒

這個網站包含 **全體同仁姓名、分機、座位位置**。內網 IP 已依資安考量全數移除。

**GitHub Pages 的網站一律是公開的。** 就算你把 repository 設成 Private，只要開啟 Pages 功能，任何知道網址的人都看得到內容 —— Private 只保護「原始碼」，不保護「已發布的網頁」。搜尋引擎也可能收錄。

我已經在 `index.html` 放了 `<meta name="robots" content="noindex">` 降低被搜尋到的機率，但這只是請求，不是保護。

### 建議做法（依安全性排序）

| 方案 | 做法 | 適合情況 |
|---|---|---|
| **A. 內部 GitHub Enterprise** | 上傳到院內／校內自架的 GitHub，Pages 只有內網看得到 | 最推薦，若貴單位有的話 |
| **B. 內網共用磁碟** | 整包資料夾丟到中心共用磁碟，同仁直接開 `index.html` | 最簡單，完全不外流 |
| **C. 公開 Pages + 密碼鎖（目前版本）** | 上 GitHub Pages，內容加密，要密碼才看得到 | 想要有網址可分享時 |
| **D. 公開 Pages + 把 IP 加回去** | 補上 `ip` 欄位後上傳 | **不建議**，內網位址不應公開 |

目前交付的版本就是 **C**：`data.js` 裡沒有任何 IP。

若日後改放在院內／校內環境（方案 A 或 B），想把 IP 加回來，在座位裡補一個 `ip` 欄位即可，網頁會自動顯示：

```js
{ name: '林恩碩', en: 'Willy', ip: ['10.x.x.x'], ext: '109', group: 'system' },
```

**送出前務必先跟中心資安或行政窗口確認一次。**

---

## 1.5 密碼保護

網站有密碼鎖，**預設密碼是 `airic`**。

### 這個保護做到什麼程度

內容（姓名、分機、規範）是用 **AES-256-GCM 加密**過的，金鑰由密碼經 PBKDF2-SHA256 跑 25 萬次推導出來。

- ✅ 沒有密碼的人，就算把 `data.enc.js` 整個下載走，看到的也只是亂碼
- ✅ 搜尋引擎爬不到內容
- ✅ 密碼不存在任何檔案裡，也不會傳給任何伺服器（解密在使用者瀏覽器內完成）

### 這個保護做不到什麼

- ❌ **無法針對個人撤銷。** 密碼是全中心共用一組，只要有人轉發出去，就等於公開了。發現外流只能換密碼、重新通知所有人。
- ❌ **無法知道誰看過。** 沒有登入紀錄。
- ❌ **擋不住暴力破解。** `airic` 這種常見短字串，有心人拿字典檔跑是有機會試出來的。**正式上線前請換成長一點、不好猜的密碼**，例如 `airic-2026-3F`。

如果需要「只有院內信箱能進、可查存取紀錄、可個別停權」，那要用 Cloudflare Access 或院內網頁空間，不是靠這個密碼。**這道鎖的定位是：擋掉路過的人與搜尋引擎，不是擋有心人士。**

### 換密碼

1. 用瀏覽器打開 `build.html`
2. 在密碼欄輸入新密碼
3. 按「產生加密檔」，會下載一個 `data.enc.js`
4. 覆蓋 `assets/js/data.enc.js`，上傳
5. 通知同仁新密碼

舊密碼在覆蓋的那一刻就失效了。

### 使用者體驗

- 輸入一次密碼後，**同一個瀏覽器分頁內不用再輸入**（存在 sessionStorage）
- 關掉分頁或按導覽列右上的鎖頭圖示，就會鎖回去
- 不會寫入 cookie，也不會留在 localStorage

---

---

## 2. 檔案結構

```
airic-site/
├── index.html               版面結構 + 兩張平面圖（SVG）
├── build.html               內容加密工具（改完內容要用它）
├── README.md                這份文件
├── .gitignore               防止明文資料被上傳（別刪）
├── .nojekyll                告訴 GitHub 不要用 Jekyll 處理（別刪）
└── assets/
    ├── css/
    │   └── style.css        所有樣式
    └── js/
        ├── data.js      ★  網站的全部內容都在這裡（明文，不上傳）
        ├── data.enc.js  ↑  上面那個檔加密後的版本（上傳這個）
        ├── gate.js         密碼鎖
        └── app.js          程式邏輯（不用改）
```

**九成的維護只需要改 `assets/js/data.js`，然後用 `build.html` 重新加密。**

### 明文檔與加密檔的關係

`data.js` 是你編輯的**原始檔**，網站不讀它。
網站讀的是 `data.enc.js` —— 用密碼加密過的亂碼，沒有密碼還原不出來。

```
編輯 data.js  →  build.html 加密  →  data.enc.js  →  上傳
   （本機保留）                        （這個才上傳）
```

`.gitignore` 已經把 `data.js` 排除，正常操作不會不小心把明文推上 GitHub。

---

## 3. 怎麼在自己電腦上預覽

把整個資料夾解壓縮後，**直接對 `index.html` 點兩下** 就會用瀏覽器打開，輸入密碼（預設 `airic`）後全部功能都能正常運作。

改完 `data.js` 存檔後，記得先用 `build.html` 重新加密，再回到瀏覽器按 **F5**。

> 沒看到變化？按 **Ctrl + Shift + R**（Mac 是 **Cmd + Shift + R**）強制清快取重新載入。

---

## 4. 上架到 GitHub Pages

三種方式，**挑一種**就好。沒用過 Git 的話直接看方式一。

### 方式一：網頁介面（推薦給第一次用的人，全程滑鼠點選）

**Step 1 — 建立 repository**

1. 登入 <https://github.com>，右上角 **＋** → **New repository**
2. **Repository name** 填 `airic-portal`（可自訂，只能用英文、數字、`-`）
3. 選 **Public** 或 **Private**（請先看第 1 節的資安提醒）
4. 其他都不用勾，按 **Create repository**

**Step 2 — 上傳檔案**

1. 進到剛建好的 repo，點 **uploading an existing file**（或 **Add file** → **Upload files**）
2. 打開你電腦上的 `airic-site` 資料夾，**把裡面的東西全選**（`index.html`、`README.md`、`.nojekyll`、`assets` 資料夾），直接拖進網頁的虛線框
   > ⚠️ 是拖「資料夾裡面的內容」，不是拖 `airic-site` 資料夾本身。否則網址會多一層變成 `.../airic-site/`。
   > ⚠️ `.nojekyll` 是隱藏檔。Windows 檔案總管請到「檢視」勾選「隱藏的項目」；Mac Finder 按 `Cmd + Shift + .` 顯示隱藏檔。
   > ⚠️ **`assets/js/data.js` 不要上傳**（那是明文）。網頁介面上傳時請手動略過它；用 Git 的話 `.gitignore` 會自動排除。
3. 等檔案都出現後，最下面按 **Commit changes**

**Step 3 — 開啟 Pages**

1. repo 上方選 **Settings**
2. 左邊選單找到 **Pages**
3. **Source** 選 `Deploy from a branch`
4. **Branch** 選 `main`，資料夾選 `/ (root)`，按 **Save**
5. 等 1～3 分鐘，重新整理這個頁面，最上面會出現網址：

```
https://你的帳號.github.io/airic-portal/
```

點進去就是你的網站了。

**Step 4 — 之後要改內容**

1. 在 repo 裡點進 `assets` → `js` → `data.js`
2. 右上角的 **鉛筆圖示 ✏️**（Edit this file）
3. 直接在網頁上修改文字
4. 拉到最下面按 **Commit changes**
5. 等約 1 分鐘，網站就更新了

---

### 方式二：GitHub Desktop（會常常改，推薦這個）

1. 下載安裝 <https://desktop.github.com>，登入 GitHub 帳號
2. **File** → **New repository**，Name 填 `airic-portal`，選一個本機資料夾位置，按 **Create repository**
3. 把 `airic-site` 資料夾裡的所有檔案，複製貼上到剛剛那個本機資料夾
4. 回到 GitHub Desktop，左邊會列出所有變更 → 左下角 Summary 打一句話（例如 `初版上線`）→ 按 **Commit to main**
5. 按上方 **Publish repository** → 選 Public / Private → **Publish**
6. 接著照 **方式一的 Step 3** 開啟 Pages

之後要改：用編輯器改 `data.js` → 存檔 → 回 GitHub Desktop → Commit → 按 **Push origin**。

---

### 方式三：git 指令

```bash
cd airic-site
git init
git add .
git commit -m "初版：AIRIC 內部入口網"
git branch -M main
git remote add origin https://github.com/你的帳號/airic-portal.git
git push -u origin main
```

然後照 **方式一的 Step 3** 開啟 Pages。

之後更新：

```bash
git add .
git commit -m "更新座位圖"
git push
```

---

## 5. 日常維護：改內容

打開 `assets/js/data.js`，用任何純文字編輯器都行（推薦 [VS Code](https://code.visualstudio.com)，會標色比較不容易改錯）。

> **⚠️ 改完一定要重新加密，網站才會變。**
> 改完 `data.js` → 打開 `build.html` → 按「產生加密檔」→ 用下載到的 `data.enc.js` 覆蓋 `assets/js/data.enc.js` → 上傳。
> 只改 `data.js` 而沒有重新加密的話，網站上看到的還是舊內容。

### 共通規則

- 文字要用單引號包起來：`'像這樣'`
- 每一筆資料之間要有逗號 `,`
- 中文可以直接打，不用轉碼
- 文字裡如果要用單引號，前面加反斜線：`'don\'t'`
- `//` 開頭的那行是註解，不會顯示在網頁上

---

### 5.1 換座位 / 換人

找到 `pods:` 區塊。每個座位長這樣：

```js
{ name: '林恩碩', en: 'Willy', ext: '109', group: 'system' },
```

| 欄位 | 意思 | 說明 |
|---|---|---|
| `name` | 姓名 | 必填 |
| `en` | 英文名 | 沒有就整個 `en: '...',` 刪掉 |
| `ip` | 電腦 IP | 預設沒有。內網環境才建議加，多台寫 `ip: ['10.x.x.x', '10.x.x.y'],` |
| `ext` | 分機 | 顯示成黑色標籤 `#109` |
| `desk` | 桌號 | 顯示成灰色標籤，沒分機的座位用這個 |
| `group` | 分組 | 決定左邊那條色線，代號見 5.2 |

**人離職變空位**，把整筆改成：

```js
{ empty: true, ext: '109' },
```

**新人報到**，把 `empty: true` 那筆改回正常格式即可。

---

### 5.2 分組與代表色

`seatGroups:` 區塊已依中心的分組圖例設定完成：

```js
seatGroups: {
  doctor: { label: '高醫師團隊', color: '#9C7A1E' },
  law:    { label: '法規',       color: '#E0A8C0' },
  nlp:    { label: 'NLP',        color: '#B6D7A8' },
  image:  { label: '影像',       color: '#8E7CC3' },
  system: { label: '系統',       color: '#8CD572' },
  admin:  { label: '行政',       color: '#6D9EEB' },
  mkt:    { label: '行銷',       color: '#E06666' },
  signal: { label: '訊號',       color: '#F6B26B' },
  mis:    { label: '醫資組',     color: '#93AEDD' },
  pm:     { label: 'PM',         color: '#E3C400' },
},
```

- `label` 是網頁上顯示的組名，想改直接改。
- `color` 是座位卡左邊那條色線與圖例色塊的顏色。
- **左邊的 key（`doctor`、`law`⋯）不要改**，座位資料是靠它對應的。

**新增一個組**：加一行，然後在座位裡寫 `group: '新代號'`：

```js
robot: { label: '機器人', color: '#5AB0A8' },
```

> 部分顏色我比原簡報圖例加深了一點（法規、醫資組、PM）。
> 原圖例的粉紅 `#EAD1DC`、淡藍 `#B4C7E7`、純黃 `#FFFF00` 做成細色線後幾乎看不見，
> 加深後才分辨得出來。想改回原色直接換 `color` 的色碼即可。

---

### 5.3 改待辦清單

`checklist:` 區塊。要新增一項，複製一整行貼在下面改內容：

```js
{ id: 'acc-mail', title: '開通中心 Email 帳號', desc: '向資訊組領取預設密碼，首次登入請立刻改密碼。' },
```

> **`id` 必須是唯一的英文代號**，例如 `acc-vpn`、`env-desk`。
> 勾選進度是靠 `id` 存在使用者瀏覽器裡的，改了 `id` 等於重置那一項的勾選狀態。

---

### 5.4 改規範

`rules:` 區塊。`cat` 決定它歸在哪個篩選分類：

```js
{
  cat: 'space',                    // attendance 差勤 / space 空間 / security 資安 / forms 表單
  catLabel: '空間使用',             // 顯示的分類名稱
  title: '會議室借用與歸還',
  summary: '有外部人員與會請用外部會議室；散會前務必復原。',   // 收合時看到的一行
  body: [                          // 展開後的條列，一行一句
    '有非中心同仁與會，以「外部會議室」為主。',
    '外部會議室鑰匙位置：BROTHER 事務機上方。',
  ],
},
```

想新增自訂分類，直接寫新的 `cat` 代號（英文），篩選按鈕會自動長出來。

---

### 5.5 改系統連結

`systems:` 區塊。把 `url` 換成真正的網址：

```js
{ name: '差勤與請假系統', desc: '打卡、請假、加班申請', url: 'https://實際網址', icon: 'calendar-clock' },
```

`url` 維持 `'#'` 的話，點下去會跳提示訊息提醒你還沒填。
`icon` 可到 <https://lucide.dev/icons> 查名稱，複製過來即可。

---

### 5.6 改頁首數字、窗口、更新日期

- `meta:` —— 中心名稱、資料更新月份、行政分機
- `heroStats:` —— 首頁那三個大數字
- `contacts:` —— 諮詢窗口清單

---

## 6. 進階：改樣式與圖

### 換主色

打開 `assets/css/style.css`，最上面 `:root {` 裡面找到：

```css
--point: #E4562F;   /* ★ 主色（橘紅） */
```

改成別的色碼，全站的重點色（連結、圖例、平面圖標示）會一起變。

其他常用變數：

| 變數 | 用途 |
|---|---|
| `--point` | 主色橘紅（連結、圖例、標題漸層起點） |
| `--point-lite` | 淺橘（標題漸層終點） |
| `--point-soft` | 主色的極淺底色（標籤、房間色塊） |
| `--paper` | 頁面底色（暖米白） |
| `--ink` | 主要文字色（暖黑） |
| `--deep` | 深色區塊底（待辦清單面板、分機標籤） |
| `--line` | 分隔線 |
| `--signal` | 警示紅（會議室規則那塊） |

### 改首頁標題文案

在 `index.html` 搜尋 `hero__title`：

```html
<h1 class="hero__title">
  探索 <span data-bind="centerShort">AIRIC</span> 團隊，<br>
  <span class="point">開啟您的創新之旅</span>
</h1>
```

`<br>` 是換行，`class="point"` 是橘紅漸層，`class="thin"` 是淡灰細體。
上方的歡迎標籤在 `class="hero__eyebrow"` 那一行。

### 改兩張平面圖

平面圖是用 SVG 手繪在 `index.html` 裡，搜尋 `PLAN 01` 和 `PLAN 02` 就能找到。

**只改文字**很簡單，找到 `<text>` 標籤改中間的字：

```html
<text x="140" y="140" text-anchor="middle" class="dwg-label">外部會議室</text>
```

**要改形狀位置**就得動座標（`x` 越大越右邊，`y` 越大越下面）。座標系是 `viewBox="0 0 1000 520"`，也就是一張 1000×520 的畫布，不管螢幕多大都會等比縮放。

如果之後房間格局大改，比較省事的做法是：用 PowerPoint 重畫 → 匯出成 PNG → 放進 `assets/img/` → 把整段 `<svg>...</svg>` 換成 `<img src="assets/img/plan.png" alt="樓層平面圖">`。

---

## 7. 壞掉了怎麼辦

### 網頁一片空白 / 座位圖不見了

九成是 `data.js` 少了逗號或括號。

1. 在網頁上按 **F12** 打開開發者工具
2. 切到 **Console** 分頁
3. 紅色錯誤訊息會寫 `data.js:123` —— 表示第 123 行附近有問題
4. 回去檢查那一行的 `,` `{` `}` `'` 有沒有少

最常見的三種錯：

| 症狀 | 原因 |
|---|---|
| `Unexpected token` | 少逗號，或多了一個逗號在 `}` 後面 |
| `Unexpected end of input` | 少一個 `}` 或 `]` |
| `Invalid or unexpected token` | 引號沒成對，或中文引號 `’` 混進去了 |

### 改了 data.js 但網站沒變

忘記重新加密了。打開 `build.html` → 產生加密檔 → 覆蓋 `assets/js/data.enc.js`。

### 密碼輸入正確卻進不去

`data.enc.js` 和你用的密碼對不起來（例如換了密碼但只上傳一半的檔案）。重跑一次 `build.html` 產生新的加密檔覆蓋即可。

### GitHub Pages 沒更新

- 等 1～3 分鐘，部署需要時間
- 到 repo 的 **Actions** 分頁看部署有沒有失敗（綠勾 = 成功）
- 瀏覽器按 **Ctrl + Shift + R** 強制重新整理

### 樣式跑掉、只剩純文字

`assets` 資料夾沒上傳成功，或路徑錯了。到 GitHub repo 確認 `assets/css/style.css` 真的存在。

### 想還原

GitHub 每次 commit 都留著。到 repo 點 **Commits** → 找到之前正常的版本 → 點進去可以看當時的檔案內容，複製回來即可。

---

## 附註

- **待辦勾選進度存在使用者自己的瀏覽器**（localStorage），不會上傳、不會共用，換電腦或清快取就會歸零。這是刻意的設計，避免收集個資。
- 網站沒有任何後端、沒有追蹤碼、沒有 cookie。
- 外部資源只有三個：Pretendard 字體、Google Fonts、Lucide 圖示（皆為 CDN）。若中心內網擋外連，字體會自動退回系統預設字型，版面仍可正常使用。
