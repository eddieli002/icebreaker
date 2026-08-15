/**
 * Icebreaker 題庫資料 — Conversation Question
 *
 * 刻意採用 .js 而非 .json：純靜態網站若用 fetch 讀取 JSON，
 * 在 file:// 協定下會被瀏覽器的 CORS 政策擋掉，
 * 改用 <script> 掛載全域變數可讓本機直接開檔與 GitHub Pages 兩種情境都正常運作。
 *
 * ---------- 資料結構 ----------
 *
 * levels[]
 *   id        層級編號，同時決定首頁排序與配色
 *   name      層級名稱
 *   subtitle  首頁按鈕副標
 *   questions[]
 *     id        穩定識別碼（lN-MM），除錯與未來擴充用，不顯示於畫面
 *     text      題目本文
 *     topic     內部 metadata，供題庫管理使用，不影響前台流程
 *     followUps 延伸聊天建議，使用者主動點擊「延伸一下」才會出現
 *       story      往故事延伸：鼓勵講出具體經驗，而不是停在抽象回答
 *       meaning    往想法延伸：了解答案背後的原因、感受或價值
 *       connection 建立彼此連結：讓另一方也分享，避免變成單向問答
 *
 * 三則 follow-up 依 story → meaning → connection 的順序輪流呈現。
 * 未來若要擴充 metadata（tone、sensitivity、情境適用等），
 * 直接在題目物件上加欄位即可，不需要改動 js/app.js 的抽卡邏輯。
 *
 * 題目本文（text）完全沿用第一版原文，未做任何改寫。
 */
window.ICEBREAKER_QUESTIONS = {
  levels: [
    {
      id: 1,
      name: '輕鬆暖身',
      // 首頁層級按鈕的副標，取自 SPEC.md 各層級的「目的」
      subtitle: '降低尷尬，讓聊天自然開始',
      questions: [
        {
          id: 'l1-01',
          text: '最近有沒有吃到什麼讓你覺得一定會再去吃一次？',
          topic: 'food',
          followUps: {
            story: '那次是什麼場合去吃的？跟誰一起？',
            meaning: '是味道本身，還是那天的氣氛讓它變得特別？',
            connection: '換你說說看，你最近一次吃到很想再吃的是什麼？'
          }
        },
        {
          id: 'l1-02',
          text: '如果現在可以立刻飛去一個地方，你會去哪裡？',
          topic: 'travel',
          followUps: {
            story: '你是怎麼知道這個地方的？影片、朋友，還是書上看到的？',
            meaning: '你期待去那裡做什麼？看風景、吃東西，還是單純換個地方待著？',
            connection: '換你了，如果現在立刻能飛，你會挑哪裡？'
          }
        },
        {
          id: 'l1-03',
          text: '你比較喜歡早起還是熬夜？',
          topic: 'routine',
          followUps: {
            story: '最近一次熬夜或早起，是為了什麼事？',
            meaning: '那個時段對你來說最大的好處是什麼？',
            connection: '換你說說，你是哪一種？'
          }
        },
        {
          id: 'l1-04',
          text: '有沒有一種大家都很喜歡，但你完全無法理解的食物？',
          topic: 'food',
          followUps: {
            story: '你是什麼時候發現自己不愛它的？',
            meaning: '是口感、味道，還是氣味的問題？',
            connection: '換你說一個，你也有這種「大家都愛但我不行」的食物嗎？'
          }
        },
        {
          id: 'l1-05',
          text: '最近看過最好看的電影、影集或影片是什麼？',
          topic: 'entertainment',
          followUps: {
            story: '哪一段讓你印象最深？',
            meaning: '它好看在哪裡？劇情、角色，還是某種感覺？',
            connection: '換你推薦一部，最近讓你覺得不錯的是什麼？'
          }
        },
        {
          id: 'l1-06',
          text: '放假的時候，你比較喜歡排滿行程還是什麼都不安排？',
          topic: 'lifestyle',
          followUps: {
            story: '最近一次放假，你實際上是怎麼過的？',
            meaning: '哪一種方式結束之後，你會覺得比較有充到電？',
            connection: '換你說說，你放假通常是哪一種？'
          }
        },
        {
          id: 'l1-07',
          text: '咖啡、茶、其他飲料只能留一種，你會選什麼？',
          topic: 'food',
          followUps: {
            story: '你通常在什麼時間、什麼情況下會喝它？',
            meaning: '是因為喜歡味道，還是它已經變成一種習慣？',
            connection: '換你選，你會留哪一種？'
          }
        },
        {
          id: 'l1-08',
          text: '明天突然多放一天假，你會怎麼過？',
          topic: 'lifestyle',
          followUps: {
            story: '最近一次有這種完全放鬆的感覺，是什麼時候？',
            meaning: '對你來說，怎樣才算真的有休息到？',
            connection: '換你也分享看看，如果突然多一天假，你會怎麼安排？'
          }
        },
        {
          id: 'l1-09',
          text: '最近有沒有買到什麼讓你意外很滿意的小東西？',
          topic: 'lifestyle',
          followUps: {
            story: '你當初是怎麼發現它的？',
            meaning: '它讓你生活的哪個部分變得比較順？',
            connection: '換你說一個，你最近有買到什麼好用的小東西嗎？'
          }
        },
        {
          id: 'l1-10',
          text: '海邊、山上、城市，你會選哪一個？',
          topic: 'travel',
          followUps: {
            story: '你最近一次去是什麼時候？',
            meaning: '在那裡的時候，你最喜歡的是什麼狀態？',
            connection: '換你選，你會挑哪一個？'
          }
        },
        {
          id: 'l1-11',
          text: '有什麼東西你可以連續吃很多天？',
          topic: 'food',
          followUps: {
            story: '最長連續吃過幾天？',
            meaning: '是味道真的吃不膩，還是因為不用花力氣決定要吃什麼？',
            connection: '換你說說，你有這種吃不膩的東西嗎？'
          }
        },
        {
          id: 'l1-12',
          text: '如果今天完全不用管熱量，你會想吃什麼？',
          topic: 'food',
          followUps: {
            story: '上一次吃到它是什麼時候？',
            meaning: '是單純嘴饞，還是它會讓你想起某段時間？',
            connection: '換你說，你會想吃什麼？'
          }
        },
        {
          id: 'l1-13',
          text: '你手機裡最常打開的是哪個 App？',
          topic: 'lifestyle',
          followUps: {
            story: '你通常都在什麼時候打開它？',
            meaning: '它對你來說比較像消遣、工具，還是習慣？',
            connection: '換你說，你最常打開的是哪一個？'
          }
        },
        {
          id: 'l1-14',
          text: '最近發生過最好笑的一件小事是什麼？',
          topic: 'daily',
          followUps: {
            story: '當下你的反應是什麼？',
            meaning: '你覺得那件事好笑在哪裡？',
            connection: '換你說一件，你最近有遇到什麼好笑的事嗎？'
          }
        },
        {
          id: 'l1-15',
          text: '如果朋友第一次來你的城市，你會先帶他去哪裡？',
          topic: 'travel',
          followUps: {
            story: '你自己第一次去那個地方是什麼時候？',
            meaning: '你希望他從那裡看到這個城市的哪一面？',
            connection: '換你說，你會先帶人去哪裡？'
          }
        },
        {
          id: 'l1-16',
          text: '你比較喜歡下雨天還是晴天？',
          topic: 'daily',
          followUps: {
            story: '有沒有哪個下雨天或晴天讓你特別記得？',
            meaning: '那種天氣會讓你想做什麼？',
            connection: '換你說說，你是哪一派？'
          }
        },
        {
          id: 'l1-17',
          text: '有沒有哪一首歌最近一直出現在你的播放清單？',
          topic: 'entertainment',
          followUps: {
            story: '你都在什麼時候聽它？',
            meaning: '是旋律、歌詞，還是它讓你想到什麼？',
            connection: '換你說一首，你最近單曲循環的是什麼？'
          }
        },
        {
          id: 'l1-18',
          text: '你比較喜歡甜食還是鹹食？',
          topic: 'food',
          followUps: {
            story: '最近一次讓你很滿足的那一餐是什麼？',
            meaning: '什麼時候你會特別想吃甜的，或特別想吃鹹的？',
            connection: '換你選，你是哪一邊的？'
          }
        },
        {
          id: 'l1-19',
          text: '小時候最喜歡的卡通或節目是什麼？',
          topic: 'memory',
          followUps: {
            story: '你都是在什麼情況下看的？放學後還是週末早上？',
            meaning: '現在回想起來，你覺得自己當時喜歡它什麼？',
            connection: '換你說，你小時候最愛看什麼？'
          }
        },
        {
          id: 'l1-20',
          text: '如果今天晚上完全沒有安排，你最可能做什麼？',
          topic: 'lifestyle',
          followUps: {
            story: '上一次有這種空白的晚上，你實際做了什麼？',
            meaning: '那樣的晚上結束時，你通常是什麼心情？',
            connection: '換你說說，你今天晚上如果空著會做什麼？'
          }
        }
      ]
    },
    {
      id: 2,
      name: '生活探索',
      subtitle: '了解對方平常怎麼生活',
      questions: [
        {
          id: 'l2-01',
          text: '你理想中的週末通常長什麼樣子？',
          topic: 'lifestyle',
          followUps: {
            story: '最近有沒有哪個週末接近這個樣子？',
            meaning: '這樣的週末最重要的是有空檔，還是有事情做？',
            connection: '換你描述看看，你理想的週末長什麼樣？'
          }
        },
        {
          id: 'l2-02',
          text: '忙了一整天之後，你通常怎麼放鬆？',
          topic: 'lifestyle',
          followUps: {
            story: '昨天結束的時候，你實際上做了什麼？',
            meaning: '對你來說，放鬆需要完全安靜，還是需要一點聲音和熱鬧？',
            connection: '換你說，你累的時候都怎麼緩過來？'
          }
        },
        {
          id: 'l2-03',
          text: '你比較喜歡臨時約還是提前安排？',
          topic: 'social',
          followUps: {
            story: '最近一次臨時的約，結果怎麼樣？',
            meaning: '提前知道行程會讓你比較安心，還是比較有壓力？',
            connection: '換你說說，你是臨時派還是安排派？'
          }
        },
        {
          id: 'l2-04',
          text: '如果沒有工作的限制，你最想把時間花在哪裡？',
          topic: 'values',
          followUps: {
            story: '你現在有沒有偶爾偷一點時間在做這件事？',
            meaning: '吸引你的是做的過程，還是它最後做出來的結果？',
            connection: '換你說，你會把時間花在哪？'
          }
        },
        {
          id: 'l2-05',
          text: '最近有沒有什麼很想學的東西？',
          topic: 'growth',
          followUps: {
            story: '是什麼讓你開始想學它的？',
            meaning: '你想學到什麼程度就夠了？入門好玩，還是想學到很專精？',
            connection: '換你說一個，你最近有想學什麼嗎？'
          }
        },
        {
          id: 'l2-06',
          text: '有什麼事情會讓你願意特別早起？',
          topic: 'routine',
          followUps: {
            story: '最近一次為了它早起是什麼時候？',
            meaning: '要多值得，你才會覺得少睡那一兩個小時是划算的？',
            connection: '換你說，什麼事能把你從床上叫起來？'
          }
        },
        {
          id: 'l2-07',
          text: '旅行時你比較偏向排行程還是走到哪算到哪？',
          topic: 'travel',
          followUps: {
            story: '最近一次旅行，你實際上是怎麼走的？',
            meaning: '行程沒照走的時候，你會覺得可惜還是覺得有趣？',
            connection: '換你說說，你旅行是哪一種？'
          }
        },
        {
          id: 'l2-08',
          text: '朋友通常會找你幫忙什麼事情？',
          topic: 'social',
          followUps: {
            story: '最近一次被找是什麼事？',
            meaning: '你覺得他們為什麼會想到你？',
            connection: '換你說，別人通常都找你做什麼？'
          }
        },
        {
          id: 'l2-09',
          text: '最近有沒有養成什麼新的習慣？',
          topic: 'routine',
          followUps: {
            story: '你是從哪一天開始的？',
            meaning: '維持下來最難的是哪個部分？',
            connection: '換你說一個，你最近有養成什麼新習慣嗎？'
          }
        },
        {
          id: 'l2-10',
          text: '一個人的時候你最常做什麼？',
          topic: 'lifestyle',
          followUps: {
            story: '最近一次一個人待著，你做了什麼？',
            meaning: '一個人的時間對你來說比較像休息，還是比較像整理自己？',
            connection: '換你說說，你一個人的時候都在做什麼？'
          }
        },
        {
          id: 'l2-11',
          text: '你比較喜歡很多人的聚會，還是兩三個人的小聚？',
          topic: 'social',
          followUps: {
            story: '最近一次讓你覺得很舒服的聚會是哪一種？',
            meaning: '人多的場合會讓你充電，還是耗電？',
            connection: '換你說，你偏好哪一種？'
          }
        },
        {
          id: 'l2-12',
          text: '如果可以免費上一門課，你會選什麼？',
          topic: 'growth',
          followUps: {
            story: '你有沒有查過相關的東西？',
            meaning: '你想從這門課帶走的是技能，還是那種重新當學生的感覺？',
            connection: '換你選，你會挑哪一門？'
          }
        },
        {
          id: 'l2-13',
          text: '有沒有哪個地方去了很多次還是不會膩？',
          topic: 'travel',
          followUps: {
            story: '你第一次去是什麼時候？',
            meaning: '每次去，你最期待的都是同一件事嗎？',
            connection: '換你說一個，你有這種去幾次都不膩的地方嗎？'
          }
        },
        {
          id: 'l2-14',
          text: '工作或讀書時，你最需要什麼樣的環境？',
          topic: 'work',
          followUps: {
            story: '你最近一次很專心，是在什麼地方？',
            meaning: '最容易打斷你的通常是什麼？',
            connection: '換你說，你需要什麼樣的環境才做得下去？'
          }
        },
        {
          id: 'l2-15',
          text: '最近有沒有一件事讓生活變得更好？',
          topic: 'lifestyle',
          followUps: {
            story: '是什麼時候開始的？',
            meaning: '它改變的是你的時間、心情，還是別的東西？',
            connection: '換你說一件，你最近生活有什麼變好的地方嗎？'
          }
        },
        {
          id: 'l2-16',
          text: '你平常是會記帳的人嗎？',
          topic: 'money',
          followUps: {
            story: '你有試過嗎？後來維持了多久？',
            meaning: '你比較在意錢花去哪，還是只要不超過就好？',
            connection: '換你說，你會記嗎？'
          }
        },
        {
          id: 'l2-17',
          text: '旅行時你比較願意把錢花在住宿、食物還是體驗？',
          topic: 'travel',
          followUps: {
            story: '最近一次旅行，你的錢主要花在哪？',
            meaning: '哪一種花費，事後回想最不會後悔？',
            connection: '換你選，你會把預算放在哪？'
          }
        },
        {
          id: 'l2-18',
          text: '如果有一個完整下午屬於自己，你通常會怎麼用？',
          topic: 'lifestyle',
          followUps: {
            story: '上一次有這種完整的下午是什麼時候？',
            meaning: '你會想把它用得很充實，還是刻意什麼都不做？',
            connection: '換你說說，你會怎麼用那個下午？'
          }
        },
        {
          id: 'l2-19',
          text: '你比較喜歡待在熟悉的地方，還是探索新的地方？',
          topic: 'travel',
          followUps: {
            story: '最近一次去沒去過的地方是什麼時候？',
            meaning: '熟悉的地方給你的比較像安心，還是無聊？',
            connection: '換你說，你是哪一種？'
          }
        },
        {
          id: 'l2-20',
          text: '有沒有什麼小習慣是每天一定會做的？',
          topic: 'routine',
          followUps: {
            story: '你做這件事多久了？',
            meaning: '如果哪天沒做，你會覺得怪怪的嗎？',
            connection: '換你說一個，你每天一定會做的是什麼？'
          }
        }
      ]
    },
    {
      id: 3,
      name: '認識你多一點',
      subtitle: '開始了解性格與人生經驗',
      questions: [
        {
          id: 'l3-01',
          text: '朋友通常會用哪三個詞形容你？',
          topic: 'self',
          followUps: {
            story: '有沒有誰真的講過其中一個詞？當下是什麼情況？',
            meaning: '這三個詞裡，哪一個你自己最同意？',
            connection: '換你說說，你覺得別人會怎麼形容你？'
          }
        },
        {
          id: 'l3-02',
          text: '你覺得現在的自己和五年前最大的差別是什麼？',
          topic: 'growth',
          followUps: {
            story: '有沒有哪件事讓你特別感覺到這個差別？',
            meaning: '這個改變是你自己想要的，還是慢慢就變成這樣了？',
            connection: '換你說說，你這五年最大的變化是什麼？'
          }
        },
        {
          id: 'l3-03',
          text: '做決定時你比較相信直覺還是分析？',
          topic: 'self',
          followUps: {
            story: '最近一次比較難的決定，你是怎麼決定的？',
            meaning: '哪一種方式，讓你事後比較睡得著？',
            connection: '換你說，你是哪一種？'
          }
        },
        {
          id: 'l3-04',
          text: '有沒有以前很在意、現在卻覺得沒那麼重要的事情？',
          topic: 'growth',
          followUps: {
            story: '你記得是什麼時候開始不那麼在意的嗎？',
            meaning: '現在回頭看，你當時真正在意的其實是什麼？',
            connection: '換你說一個，你有什麼是後來放下的？'
          }
        },
        {
          id: 'l3-05',
          text: '哪一種人通常很容易跟你變熟？',
          topic: 'social',
          followUps: {
            story: '最近一次很快就聊開的人，是什麼樣的人？',
            meaning: '是因為他們主動，還是他們身上有某種讓你放鬆的特質？',
            connection: '換你說，什麼樣的人容易跟你變熟？'
          }
        },
        {
          id: 'l3-06',
          text: '你覺得自己慢熟還是很快能跟別人熟起來？',
          topic: 'social',
          followUps: {
            story: '你跟現在最好的朋友，是多久才熟起來的？',
            meaning: '對你來說，要到什麼程度才算「熟」？',
            connection: '換你說說，你是慢熟還是很快？'
          }
        },
        {
          id: 'l3-07',
          text: '有壓力時你通常自己處理還是找人聊？',
          topic: 'self',
          followUps: {
            story: '最近一次壓力比較大的時候，你是怎麼過的？',
            meaning: '講出來對你來說是有幫助，還是反而更累？',
            connection: '換你說，你壓力大的時候會怎麼做？'
          }
        },
        {
          id: 'l3-08',
          text: '有哪一項能力是你自己其實很有自信的？',
          topic: 'self',
          followUps: {
            story: '有沒有哪一次讓你確定自己真的做得到？',
            meaning: '這項能力是後來練出來的，還是一直都在？',
            connection: '換你說一個，你自己最有把握的是什麼？'
          }
        },
        {
          id: 'l3-09',
          text: '最近一次讓你覺得「還好我有去做」的事情是什麼？',
          topic: 'growth',
          followUps: {
            story: '當時你猶豫過嗎？在猶豫什麼？',
            meaning: '如果那時候沒做，你覺得現在會怎樣？',
            connection: '換你說一件，你最近有什麼「還好有做」的事嗎？'
          }
        },
        {
          id: 'l3-10',
          text: '如果可以重新體驗人生中的某一天，你會選哪一天？',
          topic: 'memory',
          followUps: {
            story: '那天大概是怎麼過的？',
            meaning: '你想重來一次，是想再感受一次，還是想做點不一樣的？',
            connection: '換你選，你會挑哪一天？'
          }
        },
        {
          id: 'l3-11',
          text: '有什麼事情是長大之後才慢慢理解的？',
          topic: 'growth',
          followUps: {
            story: '有沒有哪個時刻讓你突然就懂了？',
            meaning: '這件事你小時候是怎麼看的？',
            connection: '換你說一個，你有什麼是長大才懂的？'
          }
        },
        {
          id: 'l3-12',
          text: '什麼小事情最容易讓你心情變好？',
          topic: 'self',
          followUps: {
            story: '最近一次心情被拉起來，是因為什麼？',
            meaning: '為什麼這麼小的事，對你這麼有效？',
            connection: '換你說一個，什麼小事會讓你心情變好？'
          }
        },
        {
          id: 'l3-13',
          text: '有沒有一個興趣是別人很難從外表猜到的？',
          topic: 'self',
          followUps: {
            story: '你是怎麼開始接觸它的？',
            meaning: '你會主動跟別人講，還是通常留給自己？',
            connection: '換你說，你有什麼別人猜不到的興趣嗎？'
          }
        },
        {
          id: 'l3-14',
          text: '你比較容易記得一個人說過的話，還是他做過的事？',
          topic: 'relationship',
          followUps: {
            story: '有沒有哪一句話或哪件事，你到現在還記得？',
            meaning: '你覺得哪一種比較能看出一個人？',
            connection: '換你說，你比較容易記得哪一種？'
          }
        },
        {
          id: 'l3-15',
          text: '有沒有以前不喜歡、現在反而很喜歡的東西？',
          topic: 'growth',
          followUps: {
            story: '這個轉變是怎麼發生的？',
            meaning: '你覺得是那個東西變了，還是你變了？',
            connection: '換你說一個，你有什麼是後來才愛上的？'
          }
        },
        {
          id: 'l3-16',
          text: '你覺得自己在哪種場合最像真正的自己？',
          topic: 'self',
          followUps: {
            story: '最近一次有這種感覺是什麼時候？',
            meaning: '那個場合有什麼特別的？是人、地方，還是氣氛？',
            connection: '換你說說，你在什麼場合最自在？'
          }
        },
        {
          id: 'l3-17',
          text: '別人第一次認識你時，最容易誤會你什麼？',
          topic: 'self',
          followUps: {
            story: '有沒有誰後來跟你說過「原來你不是那樣」？',
            meaning: '你會想解釋，還是覺得讓對方慢慢發現就好？',
            connection: '換你說，別人容易誤會你什麼？'
          }
        },
        {
          id: 'l3-18',
          text: '你最欣賞自己哪一項特質？',
          topic: 'self',
          followUps: {
            story: '有沒有哪一次讓你特別慶幸自己是這樣的人？',
            meaning: '這個特質有讓你付出過什麼代價嗎？',
            connection: '換你說，你最欣賞自己哪一點？'
          }
        },
        {
          id: 'l3-19',
          text: '有沒有一件事情讓你發現自己比想像中更勇敢？',
          topic: 'growth',
          followUps: {
            story: '那件事的過程是怎麼樣的？',
            meaning: '當時支撐你的是什麼？',
            connection: '換你說一件，你有過這種時刻嗎？'
          }
        },
        {
          id: 'l3-20',
          text: '你覺得自己比較容易因為做了什麼後悔，還是因為沒做什麼後悔？',
          topic: 'values',
          followUps: {
            story: '有沒有哪一件事，現在想起來還會有一點在意？',
            meaning: '你覺得這兩種後悔，哪一種比較難消化？',
            connection: '換你說說，你是哪一種？'
          }
        }
      ]
    },
    {
      id: 4,
      name: '內心世界',
      subtitle: '進一步了解價值觀與關係觀',
      questions: [
        {
          id: 'l4-01',
          text: '你現在人生裡最想守住的是什麼？',
          topic: 'values',
          followUps: {
            story: '最近有沒有哪件事讓你更確定這一點？',
            meaning: '如果它被動搖，你最擔心會失去什麼？',
            connection: '換你說說，你現在最想守住的是什麼？'
          }
        },
        {
          id: 'l4-02',
          text: '對你來說，「過得很好」代表什麼？',
          topic: 'values',
          followUps: {
            story: '最近有哪一天讓你覺得接近這個狀態？',
            meaning: '這個標準是你自己定的，還是從哪裡來的？',
            connection: '換你說，你心裡的「過得很好」長什麼樣子？'
          }
        },
        {
          id: 'l4-03',
          text: '什麼樣的人會讓你願意長期相處？',
          topic: 'relationship',
          followUps: {
            story: '你身邊有這樣的人嗎？他是什麼樣子？',
            meaning: '這些特質裡，哪一個是完全不能少的？',
            connection: '換你說說，你會想長期相處的是什麼樣的人？'
          }
        },
        {
          id: 'l4-04',
          text: '有沒有一個原則是你越長大越重視的？',
          topic: 'values',
          followUps: {
            story: '有沒有哪件事讓你開始重視它？',
            meaning: '守住這個原則，有讓你錯過什麼嗎？',
            connection: '換你說一個，你越來越在意的原則是什麼？'
          }
        },
        {
          id: 'l4-05',
          text: '對你來說，工作在人生裡扮演什麼角色？',
          topic: 'work',
          followUps: {
            story: '你的想法有隨著工作經驗改變過嗎？',
            meaning: '如果不用靠它生活，你還會想做嗎？',
            connection: '換你說說，工作對你來說是什麼？'
          }
        },
        {
          id: 'l4-06',
          text: '你最欣賞朋友身上的哪一種特質？',
          topic: 'relationship',
          followUps: {
            story: '有沒有誰身上這個特質特別明顯？',
            meaning: '你自己身上也有這個特質嗎？',
            connection: '換你說，你最欣賞朋友的哪一點？'
          }
        },
        {
          id: 'l4-07',
          text: '一段關係中，你覺得什麼事情最容易被低估？',
          topic: 'relationship',
          followUps: {
            story: '你是從什麼經驗裡發現的？',
            meaning: '為什麼你覺得大家常常忽略它？',
            connection: '換你說說，你覺得什麼最容易被低估？'
          }
        },
        {
          id: 'l4-08',
          text: '什麼會讓你真正覺得被理解？',
          topic: 'relationship',
          followUps: {
            story: '最近一次有這種感覺是什麼時候？',
            meaning: '被理解跟被認同，對你來說是同一件事嗎？',
            connection: '換你說，什麼會讓你覺得被理解？'
          }
        },
        {
          id: 'l4-09',
          text: '你比較在乎一個人說了什麼，還是實際做了什麼？',
          topic: 'relationship',
          followUps: {
            story: '有沒有哪次經驗讓你特別有感覺？',
            meaning: '如果兩者不一致，你通常會怎麼看？',
            connection: '換你說說，你比較看哪一邊？'
          }
        },
        {
          id: 'l4-10',
          text: '如果生活突然變得非常忙，你最不希望犧牲什麼？',
          topic: 'values',
          followUps: {
            story: '有沒有真的忙到犧牲掉它的時候？',
            meaning: '為什麼是它，而不是其他的？',
            connection: '換你說，你最不想犧牲的是什麼？'
          }
        },
        {
          id: 'l4-11',
          text: '有沒有一件事是你希望未來的自己不要忘記的？',
          topic: 'values',
          followUps: {
            story: '是什麼讓你現在想到這件事？',
            meaning: '你擔心它會被什麼沖淡？',
            connection: '換你說一件，你希望自己記住什麼？'
          }
        },
        {
          id: 'l4-12',
          text: '你覺得什麼時候最容易看出一個人的個性？',
          topic: 'relationship',
          followUps: {
            story: '有沒有哪次讓你突然看懂了一個人？',
            meaning: '你覺得那種時刻為什麼特別準？',
            connection: '換你說說，你都從哪裡看一個人？'
          }
        },
        {
          id: 'l4-13',
          text: '你最珍惜的關係通常具有什麼特質？',
          topic: 'relationship',
          followUps: {
            story: '你想到的是哪一段關係？',
            meaning: '這些特質是一開始就有，還是後來長出來的？',
            connection: '換你說，你最珍惜的關係是什麼樣子？'
          }
        },
        {
          id: 'l4-14',
          text: '對你來說「舒服的相處」是什麼感覺？',
          topic: 'relationship',
          followUps: {
            story: '最近一次有這種感覺，是跟誰、在什麼場合？',
            meaning: '舒服對你來說是不講話也不尷尬，還是能講真話？',
            connection: '換你說說，你覺得舒服的相處是什麼樣子？'
          }
        },
        {
          id: 'l4-15',
          text: '如果未來五年只能讓人生的一個部分變得更好，你會選什麼？',
          topic: 'values',
          followUps: {
            story: '你現在有在為它做什麼嗎？',
            meaning: '為什麼是這個部分優先？',
            connection: '換你選，你會挑哪一個部分？'
          }
        },
        {
          id: 'l4-16',
          text: '你認為信任是慢慢累積的，還是某些時刻突然建立的？',
          topic: 'relationship',
          followUps: {
            story: '有沒有哪一次經驗讓你想到這個答案？',
            meaning: '那信任被破壞的時候呢？也是同樣的速度嗎？',
            connection: '換你說說，你覺得信任是怎麼來的？'
          }
        },
        {
          id: 'l4-17',
          text: '你比較希望別人理解你的想法，還是理解你的感受？',
          topic: 'relationship',
          followUps: {
            story: '有沒有哪次你覺得只有一半被聽懂？',
            meaning: '如果只能選一個，你為什麼選這個？',
            connection: '換你說，你比較希望哪一種？'
          }
        },
        {
          id: 'l4-18',
          text: '什麼事情會讓你對一個人真正產生敬佩？',
          topic: 'values',
          followUps: {
            story: '有沒有誰讓你有過這種感覺？',
            meaning: '這種敬佩跟單純的欣賞，差別在哪裡？',
            connection: '換你說說，什麼會讓你敬佩一個人？'
          }
        },
        {
          id: 'l4-19',
          text: '你覺得好的關係需要很多共同點嗎？',
          topic: 'relationship',
          followUps: {
            story: '你身邊有沒有差很多、但相處很好的例子？',
            meaning: '如果共同點不多，那要靠什麼撐住？',
            connection: '換你說說，你怎麼看？'
          }
        },
        {
          id: 'l4-20',
          text: '如果生活只能保留三件最重要的東西，你希望是哪三件？',
          topic: 'values',
          followUps: {
            story: '哪一件是你最快想到的？',
            meaning: '排掉的那些，你最捨不得哪一個？',
            connection: '換你選三件，你會留下什麼？'
          }
        }
      ]
    },
    {
      id: 5,
      name: '深度交流',
      subtitle: '進入真正有深度的談話',
      questions: [
        {
          id: 'l5-01',
          text: '過去幾年，有沒有一件事情真正改變了你？',
          topic: 'growth',
          followUps: {
            story: '那件事發生的時候，你的日子是什麼樣子？',
            meaning: '如果它沒發生，你覺得現在的你會差在哪？',
            connection: '換你說說，有什麼事真正改變過你嗎？'
          }
        },
        {
          id: 'l5-02',
          text: '現在的你，有什麼是以前的自己完全想不到的？',
          topic: 'growth',
          followUps: {
            story: '以前的你，原本以為自己會變成什麼樣？',
            meaning: '這個結果比你想的好，還是只是不一樣？',
            connection: '換你說，你有什麼是以前完全沒想到的？'
          }
        },
        {
          id: 'l5-03',
          text: '有沒有一個很困難的決定，現在回頭看卻很慶幸自己做了？',
          topic: 'growth',
          followUps: {
            story: '當時最難的是哪一部分？',
            meaning: '你最後是憑什麼決定的？',
            connection: '換你說一個，你有做過這種決定嗎？'
          }
        },
        {
          id: 'l5-04',
          text: '你希望真正親近你的人理解你的哪一面？',
          topic: 'relationship',
          followUps: {
            story: '這一面通常在什麼時候才會顯出來？',
            meaning: '你覺得它為什麼比較難被看到？',
            connection: '換你說說，你希望別人理解你的哪一面？'
          }
        },
        {
          id: 'l5-05',
          text: '有沒有什麼事情是你現在還在學著接受的？',
          topic: 'self',
          followUps: {
            story: '你是從什麼時候開始面對它的？',
            meaning: '比起一年前，你覺得自己有靠近一點嗎？',
            connection: '換你說說，你有什麼還在學著接受的嗎？'
          }
        },
        {
          id: 'l5-06',
          text: '你最希望未來的生活保留什麼樣的感覺？',
          topic: 'values',
          followUps: {
            story: '現在的生活裡，哪個時刻最接近那種感覺？',
            meaning: '要保住它，最需要的是什麼？',
            connection: '換你說說，你希望留住什麼感覺？'
          }
        },
        {
          id: 'l5-07',
          text: '如果十年後的你回來看現在，希望他會感謝你做了什麼？',
          topic: 'future',
          followUps: {
            story: '這件事你已經開始了嗎？',
            meaning: '為什麼你覺得那時候的自己會在意這件事？',
            connection: '換你說，你希望十年後的自己感謝你什麼？'
          }
        },
        {
          id: 'l5-08',
          text: '你人生中有沒有一個人對你的影響，比他自己知道的還大？',
          topic: 'relationship',
          followUps: {
            story: '他當時做了什麼？',
            meaning: '你有想過要讓他知道嗎？',
            connection: '換你說說，你生命裡有這樣的人嗎？'
          }
        },
        {
          id: 'l5-09',
          text: '有沒有什麼價值觀，是經歷某件事情之後才形成的？',
          topic: 'values',
          followUps: {
            story: '在那之前，你原本是怎麼想的？',
            meaning: '這個價值觀有讓你做過什麼比較不容易的選擇嗎？',
            connection: '換你說一個，你有什麼是經歷之後才有的想法？'
          }
        },
        {
          id: 'l5-10',
          text: '你覺得自己現在正處在人生的什麼階段？',
          topic: 'self',
          followUps: {
            story: '你是什麼時候開始有這種感覺的？',
            meaning: '這個階段對你來說比較像過渡，還是已經站穩了？',
            connection: '換你說說，你覺得自己在哪個階段？'
          }
        },
        {
          id: 'l5-11',
          text: '如果完全不用考慮別人的期待，你最想過什麼樣的生活？',
          topic: 'values',
          followUps: {
            story: '現在的生活跟它差多遠？',
            meaning: '你覺得那些期待是別人給的，還是自己內化的？',
            connection: '換你說說，你會想過什麼樣的生活？'
          }
        },
        {
          id: 'l5-12',
          text: '什麼事情會讓你真正感覺自己被重視？',
          topic: 'relationship',
          followUps: {
            story: '最近一次有這種感覺是什麼時候？',
            meaning: '是被說出來的，還是被做出來的比較有感？',
            connection: '換你說，什麼會讓你覺得被重視？'
          }
        },
        {
          id: 'l5-13',
          text: '對你而言，信任通常是怎麼建立起來的？',
          topic: 'relationship',
          followUps: {
            story: '有沒有哪段關係讓你特別清楚這件事？',
            meaning: '你會先給出信任，還是等對方先證明？',
            connection: '換你說說，你的信任通常是怎麼給的？'
          }
        },
        {
          id: 'l5-14',
          text: '在重要的關係裡，你最希望彼此可以做到什麼？',
          topic: 'relationship',
          followUps: {
            story: '你有遇過真的做到的關係嗎？',
            meaning: '這件事為什麼比其他的更重要？',
            connection: '換你說說，你最希望的是什麼？'
          }
        },
        {
          id: 'l5-15',
          text: '如果今天可以讓對方真正理解你一件事情，你希望是哪一件？',
          topic: 'relationship',
          followUps: {
            story: '這件事你以前試著講過嗎？',
            meaning: '你覺得它為什麼容易被誤解？',
            connection: '換你說說，你會希望對方理解你哪一件事？'
          }
        },
        {
          id: 'l5-16',
          text: '有沒有一件失去過的東西，後來反而讓你更清楚自己重視什麼？',
          topic: 'growth',
          followUps: {
            story: '你是從什麼時候開始這樣想的？',
            meaning: '如果可以選，你還是希望它沒發生嗎？',
            connection: '換你說說，你有過這樣的經驗嗎？'
          }
        },
        {
          id: 'l5-17',
          text: '如果你可以跟二十歲的自己說一句話，你會說什麼？',
          topic: 'growth',
          followUps: {
            story: '二十歲的你，當時在煩惱什麼？',
            meaning: '你覺得那時候的自己聽得進去嗎？',
            connection: '換你說，你會跟二十歲的自己說什麼？'
          }
        },
        {
          id: 'l5-18',
          text: '目前人生中，你最想改變但還沒有改變的是什麼？',
          topic: 'self',
          followUps: {
            story: '你有試過嗎？卡在哪裡？',
            meaning: '是還沒找到方法，還是還沒真的下定決心？',
            connection: '換你說說，你有什麼一直想改但還沒改的？'
          }
        },
        {
          id: 'l5-19',
          text: '你希望別人在很多年後怎麼記得你？',
          topic: 'values',
          followUps: {
            story: '有沒有誰是你會用這種方式記得的？',
            meaning: '你覺得現在的自己，離那個樣子還差什麼？',
            connection: '換你說說，你希望別人怎麼記得你？'
          }
        },
        {
          id: 'l5-20',
          text: '什麼樣的人生會讓你覺得「這一趟值得」？',
          topic: 'values',
          followUps: {
            story: '你身邊有沒有誰讓你覺得他活出了這種感覺？',
            meaning: '這個標準，這幾年有變過嗎？',
            connection: '換你說說，什麼樣的人生對你來說算值得？'
          }
        }
      ]
    }
  ]
};
