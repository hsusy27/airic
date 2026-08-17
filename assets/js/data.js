/* ==========================================================================
   AIRIC 內部入口網 — 網站內容資料檔
   --------------------------------------------------------------------------
   ★ 這是「你唯一需要常改的檔案」。
     改完存檔 → 推上 GitHub → 網站就更新了，不用碰 HTML / CSS。

   基本規則：
     1. 每一筆資料用大括號 { } 包起來，用逗號 , 分隔。
     2. 文字要用單引號 ' ' 包住。中文可以直接打。
     3. 文字裡如果要用到單引號，請寫成 \'
     4. 最後一筆後面多一個逗號沒關係，少一個大括號會壞掉。
     5. 改壞了？打開網頁按 F12 看 Console 的紅字，會告訴你第幾行。
   ========================================================================== */

const SITE = {

  /* ────────────────────────────────────────────────────────────
     [1] 網站基本資訊
     ──────────────────────────────────────────────────────────── */
  meta: {
    centerName: '人工智慧暨機器人創新中心',
    centerShort: 'AIRIC',
    centerEn: 'AI & Robotics Innovation Center',
    updated: '2026.08',            // 顯示在頁尾的資料更新月份
    adminExt: '101',               // 行政窗口分機
  },

  /* ────────────────────────────────────────────────────────────
     [2] 首頁三個重點數字（想改文案就改這裡）
     ──────────────────────────────────────────────────────────── */
  heroStats: [
    { value: '44', label: '成員席次' },
    { value: '9', label: '專業分組' },
    { value: '3', label: '會議室' },
  ],

  /* ────────────────────────────────────────────────────────────
     [3] 諮詢窗口（About 區塊）
     ──────────────────────────────────────────────────────────── */
  contacts: [
    { name: '張詩聖', en: 'Director', role: '中心主任', desc: '中心整體策略與對外事務' },
    { name: '行政組', en: 'Admin', role: '行政與會議室借用', desc: '請假、報帳、備品、門禁卡' },
    { name: '系統組', en: 'IT', role: '帳號／網路／設備', desc: '網路、帳號、NAS' },
  ],

  /* ────────────────────────────────────────────────────────────
     [4] 報到第一週待辦清單
        - id 一定要唯一（進度存在瀏覽器裡就是靠 id）
        - 想加一項就複製一整行 { ... }, 貼在下面改內容
     ──────────────────────────────────────────────────────────── */
  checklist: [
    {
      group: '帳號與網路',
      icon: 'key-round',
      items: [
        { id: 'acc-mail', title: '開通院內帳號' },
        { id: 'acc-ip', title: '開通中心 NAS 帳號', desc: '向系統組領取帳號密碼。' },
        { id: 'acc-wifi', title: '連上中心 Wi-Fi', desc: '連線資訊與密碼向資訊組索取，勿外傳。' },
      ],
    },
    {
      group: '設備與空間',
      icon: 'laptop',
      items: [
        { id: 'env-card', title: '門禁卡設定', desc: '給予行政組識別證，進行門禁卡設定。' },
        { id: 'env-print', title: '設定事務機列印', desc: '中心共 2 台 ，參考SOP教學進行驅動與連線設定。' },
        { id: 'env-tour', title: '走一次中心空間', desc: '確認會議室、備品區、冰箱、逃生窗口位置。' },
      ],
    },
    {
      group: '規範與人際',
      icon: 'shield-check',
      items: [
        { id: 'rul-nda', title: '簽署保密協定與資安守則', desc: '研究資料不得上傳未授權雲端或公開 AI 工具。' },
        { id: 'rul-att', title: '確認自己適用哪一套差勤系統', desc: '醫院聘與計畫聘使用不同系統，第一天就要問清楚。' },
        { id: 'rul-hi', title: '加入中心通訊群組並自我介紹', desc: '公告、專案頻道都在群組裡，請打聲招呼。' },
      ],
    },
  ],

  /* ────────────────────────────────────────────────────────────
     [5] 空間使用注意事項（平面圖旁邊的提醒）
     ──────────────────────────────────────────────────────────── */
  floorNotes: {
    meeting: [
      '有「非中心同仁」與會，一律優先使用「外部會議室」。',
      '會議室借用狀況請詢問行政組。',
      '使用完畢：清除白板、資材歸位、垃圾帶走，門保持開啟。',
      '外部會議室鑰匙放在正門門口旁。',
    ],
    supplies: [
      '冰箱內的東西請貼標籤，註明「名字 / 日期」。',
      '微波爐用完請蓋起來。',
      '墨水及 A4 紙放在事務機正對面的桌上。',
      '備品快用完請「先」告知行政組，申請需要時間。',
      '不會使用或需要替換耗材，直接來問即可。',
    ],
  },

  /* ────────────────────────────────────────────────────────────
     [6] 座位圖
     --------------------------------------------------------------
     seatGroups：座位的分組與代表色，對應中心的分組圖例。
     ──────────────────────────────────────────────────────────── */
  seatGroups: {
    /* 顏色沿用中心分組圖例。左邊的 key（doctor / law …）是程式用的代號，不要改；
       label 是顯示出來的組名，color 是座位卡左側色條與圖例色塊。
       ※ 括號內是原簡報圖例的色碼，部分因為太淺、細線上看不清楚，
         我在不改變辨識度的前提下加深了一點。 */
    doctor: { label: '核醫', color: '#9C7A1E' },   // 原座位表深金色
    law:    { label: '法規',       color: '#E0A8C0' },   // 圖例 #EAD1DC（另有一格為 #00FFFF）
    nlp:    { label: 'NLP',        color: '#B6D7A8' },   // 圖例 #B6D7A8
    image:  { label: '影像',       color: '#8E7CC3' },   // 圖例 #8E7CC3
    system: { label: '系統',       color: '#8CD572' },   // 圖例 #8CD572
    admin:  { label: '行政',       color: '#6D9EEB' },   // 圖例 #6D9EEB
    mkt:    { label: '行銷',       color: '#E06666' },   // 圖例 #E06666
    signal: { label: '訊號',       color: '#F6B26B' },   // 圖例 #F6B26B
    mis:    { label: '醫資',     color: '#93AEDD' },   // 圖例 #B4C7E7
    pm:     { label: 'PM',         color: '#E3C400' },   // 圖例 #FFFF00
  },

  /* 牆面設備（畫在座位圖最上方那一排）
     kind: 'device' 設備 ｜ 'door' 門 ｜ 'plain' 其他
     需要顯示設備 IP 時，補上 ip: ['10.x.x.x'] 即可 */
  facilities: [
    { name: '事務機', kind: 'device' },
    { name: '冰箱', kind: 'plain' },
    { name: '側門', kind: 'door' },
    { name: '事務機 1', kind: 'device' },
    { name: '公用電腦／WIFI', kind: 'device' },
    { name: 'NAS / WIFI', kind: 'device' },
    { name: '主門', kind: 'door' },
    { name: '事務機 2', kind: 'device' },
  ],

  /* 座位島（由左到右，對應你原本的 Excel 座位表）
     每個 pod 有兩排 columns，每排由上到下列出座位。
     一個座位可寫的欄位：
       name 姓名 ／ en 英文名
       ext  分機 ／ desk 桌號 ／ group 對應上面 seatGroups 的 key
       empty: true 代表空位
     ★ 換人只要改 name / en / ext 就好 ★

     ※ 內網 IP 已依資安考量全數移除。
       若日後改放在院內／校內環境，想把 IP 加回來，
       在座位裡補上 ip: ['10.x.x.x'] 即可，網頁會自動顯示。   */
  pods: [
    {
      id: 'A',
      columns: [
        {
          desk: '12561',
          seats: [
            { name: '吳國禎', ext: '147', group: 'doctor' },
            { empty: true, desk: '12561' },
            { name: '郭伃健', desk: '12566', group: 'doctor' },
            { name: '陳奕瑾', desk: '12565', group: 'doctor' },
          ],
        },
        {
          desk: '12562',
          seats: [
            { name: '陳岱吟', ext: '146', group: 'doctor' },
            { name: '張朝任', desk: '12562', group: 'doctor' },
            { name: '葉依純', desk: '12564', group: 'doctor' },
            { name: '葉佩純', desk: '12563', group: 'doctor' },
          ],
        },
      ],
    },
    {
      id: 'B',
      columns: [
        {
          desk: '12529',
          seats: [
            { name: '劉芸伊', en: 'Zoe', ext: '137', group: 'law' },
            { name: '郭乃維', en: 'Sunny', ext: '139', group: 'law' },
            { name: '張妙芬', en: 'Amy', ext: '141', group: 'law' },
            { name: '劉于國', en: 'Mike', ext: '143', group: 'law' },
          ],
        },
        {
          desk: '12528',
          seats: [
            { name: '李家禎', en: 'Ben', ext: '136', group: 'nlp' },
            { empty: true, ext: '138' },
            { name: '吳如玉', en: 'Gina', ext: '140', group: 'mis' },
            { name: '張裕鑫', ext: '142', group: 'mis' },
          ],
        },
      ],
    },
    {
      id: 'C',
      columns: [
        {
          desk: '12527',
          seats: [
            { empty: true, ext: '131' },
            { name: '蘇孟翰', en: 'Mark', ext: '133', group: 'nlp' },
            { name: '侯詩彥', en: 'James H', ext: '135', group: 'nlp' },
          ],
        },
        {
          desk: '12524',
          seats: [
            { name: '張進良', en: 'Thomas', ext: '130', group: 'nlp' },
            { name: '徐銓汎', en: 'Jason', ext: '132', group: 'signal' },
            { name: '童岱和', en: 'Tom', ext: '134', group: 'signal' },
          ],
        },
      ],
      note: '逃生窗口',
    },
    {
      id: 'D',
      columns: [
        {
          desk: '12523',
          seats: [
            { name: 'ALI', ext: '121', group: 'image' },
            { name: '葉宸妤', en: 'Kelly', ext: '123', group: 'image' },
            { name: '方銳', ext: '125', group: 'signal' },
            { name: '吳亞倫', en: 'Allen', ext: '127', group: 'signal', desk: '12586' },
          ],
        },
        {
          desk: '12522',
          seats: [
            { empty: true, ext: '120' },
            { name: '賴亭諭', en: 'Noen', ext: '122', group: 'image' },
            { name: '阮登科', en: 'Khoa', ext: '124', group: 'image' },
            { name: '林敬庭', en: 'Kurt', ext: '126', group: 'image' },
          ],
        },
      ],
    },
    {
      id: 'E',
      columns: [
        {
          desk: '12587',
          seats: [
            { name: '林恩碩', en: 'Willy', ext: '109', group: 'system' },
            { name: '蔡函妤', en: 'Jenny', ext: '111', group: 'system' },
            { name: '蕭輔廣', en: 'Hokou', ext: '117', group: 'system' },
            { name: '楊博皓', en: 'Leonard', ext: '119', group: 'system' },
          ],
        },
        {
          desk: '12585',
          seats: [
            { name: '林亭妤', en: 'Tianna', ext: '108', group: 'system' },
            { name: '蔡欣樺', en: 'Wendy', ext: '110', group: 'system' },
            { name: '朱育德', en: 'Nick', ext: '116', group: 'system' },
            { name: '王韋竣', en: 'Welt', ext: '118', group: 'pm' },
          ],
        },
      ],
    },
    {
      id: 'F',
      front: [
        { name: '王之妍', desk: '12584', group: 'mkt' },
        { name: '黃宜筠', desk: '12534', group: 'mkt' },
      ],
      columns: [
        {
          desk: '12584',
          seats: [
            { name: '徐詩媛', en: 'Blythe', ext: '101', group: 'admin' },
            { empty: true, ext: '102' },
            { name: '張芷菱', en: 'Tiffany', ext: '105', group: 'pm' },
            { name: '吳映賢', en: 'Shian', ext: '107', group: 'admin' },
          ],
        },
        {
          desk: '12534',
          seats: [
            { name: '周怡均', en: 'Rain', ext: '100', group: 'pm' },
            { name: '黃俊皓', en: 'Aaron', ext: '103', group: 'pm' },
            { name: '陳建瑋', ext: '104', group: 'pm' },
            { name: '江靜娟', en: 'Queenie', ext: '106', group: 'pm', desk: '12533' },
          ],
        },
      ],
    },
  ],

  /* 座位圖最右側的獨立空間 */
  rooms: [
    { name: 'AIC 第一會議室', ext: '169', tone: 'room' },
    { name: '張詩聖 主任', ext: '168', desk: '12535', tone: 'office' },
  ],

  /* ────────────────────────────────────────────────────────────
     [6.5] 桌上電話撥號規則
     ──────────────────────────────────────────────────────────── */
  phone: {
    inside:  '直接撥電話上的 CID 號碼（3 碼）。',
    outside: '先按 3–15 線，再撥下面的號碼。',
    rules: [
      { label: '學校',        value: '889 + 分機',    note: '共 4 碼' },
      { label: '醫院',        value: '分機',          note: '共 5 碼' },
      { label: '簡碼',        value: '881 + 6 碼',    note: '3G' },
      { label: '外縣市／手機', value: '16 線 + 電話號碼', note: '' },
    ],

    /* ────────────────────────────────────────────────────────────
       電話分線面板（子母機／DSS 擴充台）
       --------------------------------------------------------------
       取代原本內建畫的電話手繪圖。面板一顆一顆照實際按鍵順序排下來
       （由上到下、由左到右），點下去會顯示這顆鍵對應的分機／線路號碼。

       一顆按鍵可以寫：
         key      按鍵編號（面板上印的數字，必填，不用照順序但顯示會照你排的順序）
         ext      對應的分機或線路號碼（必填，沒有就用 empty）
         outside  true 代表這是外線／總機線，會多顯示一個「外線」小標籤，一般分機不用寫
         empty    true 代表這顆鍵還沒設定／空著，畫面會顯示成空鍵、不能點

       ★ 這份對照表是我依你提供的面板照片與分機表推回來的初版，
         第 16～24 鍵照片上看不到標籤，先留空，請對照實體面板確認並修改。
       ──────────────────────────────────────────────────────────── */
    panel: [
      { key: 1,  ext: '12561' },
      { key: 2,  ext: '12562' },
      { key: 3,  ext: '12527' },
      { key: 4,  ext: '12528' },
      { key: 5,  ext: '12529' },
      { key: 6,  ext: '12533' },
      { key: 7,  ext: '12534' },
      { key: 8,  ext: '12535' },
      { key: 9,  ext: '12522' },
      { key: 10, ext: '12523' },
      { key: 11, ext: '12524' },
      { key: 12, ext: '12584' },
      { key: 13, ext: '12585' },
      { key: 14, ext: '12586' },
      { key: 15, ext: '12587' },
      { key: 16, outside: true },

    ],
  },

  /* ────────────────────────────────────────────────────────────
     [7] 規範知識庫
        cat 決定篩選分類，可用：attendance / forms / security / space
     ──────────────────────────────────────────────────────────── */
  rules: [
    {
      cat: 'attendance',
      catLabel: '差勤請假',
      title: '差勤打卡（雙軌制）',
      summary: '醫院聘與計畫聘使用不同差勤系統，報到第一天請先確認自己屬於哪一種。',
      body: [
        '【醫院聘任同仁】使用院內差勤管理系統；請假、忘記打卡依醫院人資處規範線上簽核。',
        '【計畫聘任同仁】使用計畫專用線上「計畫同仁假勤系統」。',
        '【計畫聘任同仁】專任助理打卡網址 : https://vwebap02.cmu.edu.tw/Plan_StuWorkAmt_Apply/login_full_time.aspx',
        '【計畫聘任同仁】臨時工打卡網址 : https://vwebap02.cmu.edu.tw/Plan_StuWorkAmt_Apply/login.aspx ',
        '不確定自己是哪一種，請洽行政組（分機 101）。',
      ],
    },
    {
      cat: 'attendance',
      catLabel: '差勤請假',
      title: '排班及假勤介紹',
      summary: '醫院聘與計畫聘使用相同假勤規範。',
      img: 'assets/img/rule1.png',  // 👈 新增這行：放圖片網址（沒有圖片的項目不寫這行即可） 
      body: [
        '【遲到/早退】扣全勤及實際缺勤時數。',
        '【上班/非上班時間參與演講】不能報加班及申請改班，唯有工作人員可以報加班。',
        '詳細規範請看 : AD-007_非醫師從業人員考勤作業管理辦法 1130306.pdf。',
      ],
    },     
    {
      cat: 'attendance',
      catLabel: '差勤請假',
      title: '出差與差旅費報銷',
      summary: '出差前先送申請單，結束後 10 個工作天內完成請款。',
      body: [
        '出差前：於A03請假單進行公假公費差旅申請。',
        '出差後：交通費：高鐵票需附票根，並打醫院統編(52600770)。',
        '報帳期限：出差結束後 10 個工作天內，將單據黏貼於憑證頁送行政組。',
      ],
    },
    {
      cat: 'space',
      catLabel: '空間使用',
      title: '會議室借用與歸還',
      summary: '有外部人員與會請用外部會議室；散會前務必復原。',
      body: [
        '有非中心同仁與會，以「外部會議室」為主。',
        '外部會議室鑰匙位置：前門旁邊的牆上。',
        '借用狀況請洽行政組確認。',
        '使用完後：清除白板文字、資材歸位、垃圾帶走，其中第一會議室之會議室門保持開啟。',
        '第二會議室目前暫時作為備品區。',
      ],
    },
    {
      cat: 'space',
      catLabel: '空間使用',
      title: '茶點區與第二會議室備品區',
      summary: '冰箱食物要貼名字日期，備品快用完請提前說。',
      body: [
        '冰箱內物品請貼標籤，註明名字與日期，未標示者定期清除。',
        '微波爐使用完請蓋起來並擦拭。',
        '墨水與 A4 紙放在事務機正對面桌上。',
        '備品申請需要作業時間，請在用完之前先告知行政組。',
        '垃圾請自行丟棄，保持公共區域整潔。',
      ],
    },
    {
      cat: 'security',
      catLabel: '其他規範',
      title: '資訊安全與資料管理',
      summary: '研究資料不得外流至未授權平台，離座請鎖定螢幕。',
      body: [
        '禁止將研究數據或程式碼上傳至未授權的公有雲、個人倉庫或公開 AI 工具。',
        '離開座位請鎖定螢幕（Windows：Win + L／macOS：Ctrl + Cmd + Q）。',
        '密碼長度至少 12 碼並含大小寫、數字與符號。',
        '收到可疑郵件或連結，先回報系統組再處理。',
      ],
    },
         {
      cat: 'security',
      catLabel: '其他規範',
      title: '服裝及雨具',
      summary: '',
      img: 'assets/img/rule2.png',  // 👈 新增這行：放圖片網址（沒有圖片的項目不寫這行即可） 
      body: [
        '1.雨具請晾在樓梯間或自己的位置。',
        '2.識別證請記得佩戴在身上。',
        '3.新進同仁記得去借醫技袍。',
      ],
    },
    {
      cat: 'forms',
      catLabel: '相關路徑',
      title: '常用行政表單路徑',
      summary: '耗材採購、設備借用、門禁卡補發、經費請款。',
      body: [
        '耗材申請 → 可以前往院內系統中「衛材申請作業」進行小領單申請',
        '設備借用單 → 通知行政組並前往「設備借用系統」進行申請',
        '門禁卡補發 → 需自行前往人事室申請',
        '經費請款 → 請先與靜娟知會，如可以後續行政組會進行申請',
        '（表單檔案請放到 GitHub 的 files 資料夾，再把連結貼到 data.js 的 systems 區塊。）',
      ],
    },
  ],

  /* ────────────────────────────────────────────────────────────
     [8] 常用系統連結
        ★ 把 url 換成你們真正的網址；沒有網址就先留 '#' ★
     ──────────────────────────────────────────────────────────── */
  systems: [
    { name: '計畫同仁假勤系統', desc: '打卡、請假、加班申請', url: 'http://10.65.51.163:3000/#', icon: 'calendar-clock' },
    { name: '設備借用系統', desc: '硬體被借用及個人資產管理', url: 'http://10.65.51.163:3000/#', icon: 'file-check-2' },
    { name: '中心共用雲端硬碟', desc: '簡報範本、Logo、資料夾', url: '#', icon: 'folder-open' },
    { name: 'AIRIC 對外官網', desc: '官網', url: 'https://airic.cmuh.org.tw/', icon: 'door-open' },
    { name: 'AIRIC Linkedin', desc: '商務社群網站', url: 'https://www.linkedin.com/company/aic_cmuh/?viewAsMember=true', icon: 'wrench' },
    { name: '中心 NAS', desc: '共用檔案空間，路徑洽系統組', url: '#', icon: 'hard-drive' },
  ],
};
