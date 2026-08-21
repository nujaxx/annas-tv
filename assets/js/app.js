/* ============================================================
   อันนาสทีวี — Annas TV
   ไม่ต้องใช้ build tool ใดๆ เป็น JavaScript ธรรมดา
   ============================================================ */
(function () {
  'use strict';

  var SITE = null;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };

  /* ---------------- ธีมสว่าง / มืด ---------------- */
  (function theme() {
    var saved = null;
    try { saved = localStorage.getItem('annas-theme'); } catch (e) {}
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('#themeBtn')) return;
      var cur = document.documentElement.getAttribute('data-theme');
      if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('annas-theme', next); } catch (err) {}
    });
  })();

  /* ---------------- เมนูมือถือ + ไฮไลต์เมนู ---------------- */
  (function nav() {
    var btn = $('#menuBtn'), nav = $('#nav');
    if (btn) btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    });

    var links = $$('#nav a');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['latest', 'categories', 'schedule', 'prayer', 'about'].forEach(function (id) {
      var s = document.getElementById(id); if (s) obs.observe(s);
    });
  })();

  /* ---------------- ไอคอนหมวดหมู่ ---------------- */
  var ICONS = {
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v14H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19v4H6.5A2.5 2.5 0 0 1 4 18.5z"/>',
    quote: '<path d="M9 7H5.5A2.5 2.5 0 0 0 3 9.5v2A2.5 2.5 0 0 0 5.5 14H7v.8A3.2 3.2 0 0 1 3.8 18"/><path d="M20 7h-3.5A2.5 2.5 0 0 0 14 9.5v2a2.5 2.5 0 0 0 2.5 2.5H18v.8a3.2 3.2 0 0 1-3.2 3.2"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7 2.5 13h5zM19 7l-2.5 6h5z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-9.5A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20z"/>',
    mic: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 7v5.3l3.4 2"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6M17.6 14.4A6.2 6.2 0 0 1 21.2 20"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.book) + '</svg>';
  }
  var SOCIAL_ICONS = {
    youtube: '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 3.9 12 3.9 12 3.9s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2C23 15.8 23 12 23 12zM9.8 15.5v-7l6 3.5z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.2-2.7v-3a5.7 5.7 0 1 0 5.2 5.7V9.1a6.7 6.7 0 0 0 4 1.3v-3a3.8 3.8 0 0 1-4-3.8z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>'
  };

  /* ---------------- ค่าสำรองในตัว ----------------
     ถ้า data/site.json หายไปหรือพิมพ์ผิดจนอ่านไม่ได้ เว็บจะใช้ชุดนี้แทน
     เพื่อไม่ให้ทั้งหน้าล่มเพราะเครื่องหมายตกหล่นเพียงจุดเดียว */
  var DEFAULTS = {
    channel: {
      name: 'อันนาสทีวี',
      nameEn: 'Annas TV',
      tagline: 'สื่อสาระ เพื่อการเรียนรู้ สู่สัจธรรม',
      description: 'ช่องเผยแผ่ความรู้อิสลาม รวมบทเรียนศาสนา คุตบะฮ์ บรรยายธรรม และรายการถ่ายทอดสด เพื่อสร้างสรรค์สังคมมุสลิม',
      youtubeChannelId: 'UCnmmtEHt4vm0MNjUFtM6exA',
      youtubeUrl: 'https://www.youtube.com/channel/UCnmmtEHt4vm0MNjUFtM6exA',
      facebookUrl: 'https://www.facebook.com/profile.php?id=100070867295851',
      tiktokUrl: 'https://www.tiktok.com/@annas_tv',
      instagramUrl: ''
    },
    categories: [
      { title: 'อัลกุรอาน', desc: 'อรรถาธิบายอายะฮ์ การอ่านที่ถูกต้อง และตัจญ์วีด', icon: 'book', query: 'อัลกุรอาน' },
      { title: 'หะดีษ', desc: 'วจนะของท่านนบีมุฮัมมัด ﷺ พร้อมคำอธิบาย', icon: 'quote', query: 'หะดีษ' },
      { title: 'ฟิกฮ์ (ศาสนบัญญัติ)', desc: 'การละหมาด ถือศีลอด ซะกาต ฮัจญ์ และเรื่องราวในชีวิตประจำวัน', icon: 'scale', query: 'ฟิกฮ์' },
      { title: 'อะกีดะฮ์ (หลักศรัทธา)', desc: 'รากฐานความเชื่อ เตาฮีด และสิ่งที่ทำให้ศรัทธาบกพร่อง', icon: 'heart', query: 'อะกีดะฮ์' },
      { title: 'คุตบะฮ์วันศุกร์', desc: 'บทธรรมเทศนาประจำสัปดาห์จากมัสยิด', icon: 'mic', query: 'คุตบะฮ์' },
      { title: 'ซีเราะฮ์ & ประวัติศาสตร์', desc: 'ชีวประวัติท่านนบี ﷺ และบทเรียนจากอดีต', icon: 'clock', query: 'ซีเราะฮ์' },
      { title: 'ครอบครัวมุสลิม', desc: 'การเลี้ยงดูบุตร คู่ครอง และมารยาทในบ้าน', icon: 'users', query: 'ครอบครัวมุสลิม' },
      { title: 'ดุอาอ์ & ซิกรุลลอฮ์', desc: 'บทวิงวอนและการรำลึกถึงอัลลอฮ์ในแต่ละวัน', icon: 'sparkle', query: 'ดุอาอ์' }
    ],
    schedule: [
      { day: 'จันทร์', items: [{ time: '20:00', title: 'บทเรียนอัลกุรอาน', host: '' }] },
      { day: 'อังคาร', items: [{ time: '20:00', title: 'หะดีษประจำวัน', host: '' }] },
      { day: 'พุธ', items: [{ time: '20:00', title: 'ฟิกฮ์ในชีวิตประจำวัน', host: '' }] },
      { day: 'พฤหัสบดี', items: [{ time: '20:00', title: 'อะกีดะฮ์เบื้องต้น', host: '' }] },
      { day: 'ศุกร์', items: [{ time: '12:30', title: 'ถ่ายทอดสดคุตบะฮ์วันศุกร์', host: '' }] },
      { day: 'เสาร์', items: [{ time: '10:00', title: 'รายการครอบครัวมุสลิม', host: '' }] },
      { day: 'อาทิตย์', items: [{ time: '10:00', title: 'ซีเราะฮ์ท่านนบี ﷺ', host: '' }] }
    ],
    prayer: {
      defaultCity: 'Bangkok', country: 'Thailand', method: 3,
      cities: [
        { label: 'กรุงเทพมหานคร', city: 'Bangkok' },
        { label: 'ปัตตานี', city: 'Pattani' },
        { label: 'ยะลา', city: 'Yala' },
        { label: 'นราธิวาส', city: 'Narathiwat' },
        { label: 'สงขลา', city: 'Songkhla' },
        { label: 'ภูเก็ต', city: 'Phuket' },
        { label: 'เชียงใหม่', city: 'Chiang Mai' },
        { label: 'ขอนแก่น', city: 'Khon Kaen' }
      ]
    }
  };

  function assign(base, extra) {
    var out = {}, k;
    for (k in base) { if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k]; }
    for (k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) out[k] = extra[k]; }
    return out;
  }

  /* รับค่าจากไฟล์เท่าที่ใช้ได้ ส่วนที่ขาดหรือเสียให้ใช้ค่าสำรองแทน */
  function useConfig(data, failed) {
    data = data || {};
    SITE = {
      channel: assign(DEFAULTS.channel, data.channel || {}),
      categories: (data.categories && data.categories.length) ? data.categories : DEFAULTS.categories,
      schedule: (data.schedule && data.schedule.length) ? data.schedule : DEFAULTS.schedule,
      prayer: assign(DEFAULTS.prayer, data.prayer || {})
    };
    render();
    if (failed) {
      var note = $('#videoNote');
      if (note) {
        note.hidden = false;
        note.textContent = 'หมายเหตุสำหรับผู้ดูแล: อ่านไฟล์ data/site.json ไม่สำเร็จ (อาจมีเครื่องหมายตกหล่น) ' +
          'ขณะนี้เว็บกำลังใช้ค่าสำรองในตัวแทน — ตรวจไฟล์ได้ที่ jsonlint.com';
      }
    }
  }

  /* ---------------- โหลด config ---------------- */
  fetchTimeout('data/site.json?t=' + Date.now(), 8000)
    .then(function (r) { return r.json(); })
    .then(function (data) { useConfig(data, false); })
    .catch(function () { useConfig(null, true); });

  function render() {
    var ch = SITE.channel;

    // Hero + ลิงก์
    $('#heroTitle').textContent = ch.name;
    $('#heroTagline').textContent = ch.tagline;
    $('#heroDesc').textContent = ch.description;
    document.title = ch.name + ' | ' + ch.tagline;

    var ytVideos = ch.youtubeUrl.replace(/\/$/, '') + '/videos';
    var ytLive = ch.youtubeUrl.replace(/\/$/, '') + '/streams';
    $('#ytBtn').href = ch.youtubeUrl;
    $('#subscribeBtn').href = ch.youtubeUrl + '?sub_confirmation=1';
    $('#allVideosLink').href = ytVideos;
    $('#liveLink').href = ytLive;
    if (ch.facebookUrl) { $('#fbBtn').href = ch.facebookUrl; } else { $('#fbBtn').hidden = true; }

    buildSocial();
    buildFeatured();
    buildCategories();
    buildSchedule();
    buildPrayerCities();
    loadPrayerTimes();
    loadVideos();

    $('#year').textContent = new Date().getFullYear() + 543 + ' / ' + new Date().getFullYear();
  }

  /* ---------------- เครื่องเล่นหลัก ----------------
     ใช้ "เพลย์ลิสต์คลิปที่อัปโหลด" ของช่อง ซึ่ง YouTube สร้างให้ทุกช่องอัตโนมัติ
     รหัสของมันคือรหัสช่องที่เปลี่ยน UC ขึ้นต้นเป็น UU
     วิธีนี้ฝังได้ตรงๆ ไม่ต้องเรียก API ไม่ต้องผ่านตัวกลาง จึงไม่มีทางโหลดไม่ขึ้น */
  function uploadsPlaylistId() {
    var cid = SITE.channel.youtubeChannelId || '';
    return cid.indexOf('UC') === 0 ? 'UU' + cid.slice(2) : '';
  }

  function buildFeatured() {
    var list = uploadsPlaylistId();
    if (!list) return;
    $('#featuredFrame').innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=' + list +
      '&rel=0" title="วิดีโอล่าสุดจากช่องอันนาสทีวี" loading="lazy" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
      'allowfullscreen></iframe>';
    $('#featuredTitle').textContent = 'คลิปล่าสุดจากช่อง — กดเล่นได้เลย หรือเลื่อนดูคลิปอื่นในเครื่องเล่น';
  }

  /* ---------------- โซเชียล ---------------- */
  function buildSocial() {
    var ch = SITE.channel;
    var list = [
      { k: 'youtube', label: 'YouTube', url: ch.youtubeUrl },
      { k: 'facebook', label: 'Facebook', url: ch.facebookUrl },
      { k: 'tiktok', label: 'TikTok', url: ch.tiktokUrl },
      { k: 'instagram', label: 'Instagram', url: ch.instagramUrl }
    ].filter(function (s) { return s.url; });

    var row = $('#socialRow'), foot = $('#footerSocial');
    row.innerHTML = ''; foot.innerHTML = '';
    list.forEach(function (s) {
      var a = el('a', 'social', SOCIAL_ICONS[s.k] + '<span>' + s.label + '</span>');
      a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
      row.appendChild(a);

      var b = el('a', '', SOCIAL_ICONS[s.k]);
      b.href = s.url; b.target = '_blank'; b.rel = 'noopener';
      b.setAttribute('aria-label', s.label);
      foot.appendChild(b);
    });
  }

  /* ---------------- หมวดหมู่บทเรียน ---------------- */
  function buildCategories() {
    var grid = $('#catGrid');
    var base = SITE.channel.youtubeUrl.replace(/\/$/, '');
    grid.innerHTML = '';
    SITE.categories.forEach(function (c) {
      var href = c.playlistId
        ? 'https://www.youtube.com/playlist?list=' + c.playlistId
        : base + '/search?query=' + encodeURIComponent(c.query || c.title);
      var a = el('a', 'cat');
      a.href = href; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML =
        '<span class="cat-icon">' + icon(c.icon) + '</span>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p>' + esc(c.desc) + '</p>' +
        '<span class="cat-more">ดูบทเรียน →</span>';
      grid.appendChild(a);
    });
  }

  /* ---------------- ตารางออกอากาศ ---------------- */
  function buildSchedule() {
    var grid = $('#scheduleGrid');
    var names = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    var today = names[new Date().getDay()];
    grid.innerHTML = '';

    SITE.schedule.forEach(function (d) {
      var isToday = d.day === today;
      var box = el('div', 'day' + (isToday ? ' today' : ''));
      var head = '<div class="day-head"><h3>' + esc(d.day) + '</h3>' + (isToday ? '<span class="badge">วันนี้</span>' : '') + '</div>';
      var slots = (d.items || []).map(function (it) {
        return '<div class="slot"><time>' + esc(it.time) + '</time><div>' +
          '<span class="slot-title">' + esc(it.title) + '</span>' +
          (it.host ? '<span class="slot-host">' + esc(it.host) + '</span>' : '') +
          '</div></div>';
      }).join('') || '<div class="slot"><span class="slot-title" style="color:var(--muted)">ไม่มีรายการ</span></div>';
      box.innerHTML = head + slots;
      grid.appendChild(box);
    });
  }

  /* ---------------- เวลาละหมาด (AlAdhan API) ---------------- */
  var PRAYERS = [
    { key: 'Fajr', th: 'ซุบฮิ', ar: 'الفجر' },
    { key: 'Sunrise', th: 'ดวงอาทิตย์ขึ้น', ar: 'الشروق' },
    { key: 'Dhuhr', th: 'ซุฮ์ริ', ar: 'الظهر' },
    { key: 'Asr', th: 'อัสริ', ar: 'العصر' },
    { key: 'Maghrib', th: 'มัฆริบ', ar: 'المغرب' },
    { key: 'Isha', th: 'อิชาอ์', ar: 'العشاء' }
  ];

  function buildPrayerCities() {
    var sel = $('#citySelect');
    sel.innerHTML = '';
    SITE.prayer.cities.forEach(function (c) {
      var o = el('option', '', esc(c.label));
      o.value = c.city;
      sel.appendChild(o);
    });
    var saved = null;
    try { saved = localStorage.getItem('annas-city'); } catch (e) {}
    sel.value = saved || SITE.prayer.defaultCity;
    if (!sel.value) sel.value = SITE.prayer.defaultCity;
    sel.addEventListener('change', function () {
      try { localStorage.setItem('annas-city', sel.value); } catch (e) {}
      loadPrayerTimes();
    });
  }

  function loadPrayerTimes() {
    var city = $('#citySelect').value || SITE.prayer.defaultCity;
    var url = 'https://api.aladhan.com/v1/timingsByCity?city=' + encodeURIComponent(city) +
      '&country=' + encodeURIComponent(SITE.prayer.country) +
      '&method=' + encodeURIComponent(SITE.prayer.method);

    $('#prayerDate').textContent = 'กำลังโหลดเวลาละหมาด…';

    fetchTimeout(url, 9000)
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.data || !res.data.timings) throw new Error('bad');
        var t = res.data.timings, d = res.data.date;
        var hij = d.hijri;
        $('#prayerDate').textContent =
          d.gregorian.weekday.en ? thaiDate() + ' — ตรงกับ ' + hij.day + ' ' + hij.month.en + ' ' + hij.year + ' ฮ.ศ.'
            : thaiDate();
        paintPrayers(t);
      })
      .catch(function () {
        $('#prayerDate').textContent = thaiDate() + ' — ไม่สามารถเชื่อมต่อบริการเวลาละหมาดได้ในขณะนี้';
        $('#prayerGrid').innerHTML = '<p class="note" style="grid-column:1/-1">โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต หรือดูเวลาละหมาดจากประกาศของมัสยิดในพื้นที่</p>';
      });
  }

  function paintPrayers(t) {
    var grid = $('#prayerGrid');
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();

    var rows = PRAYERS.map(function (p) {
      var raw = (t[p.key] || '').split(' ')[0];
      var parts = raw.split(':');
      return { p: p, time: raw, mins: (+parts[0]) * 60 + (+parts[1]) };
    });

    // ตัวถัดไป (ไม่นับดวงอาทิตย์ขึ้น)
    var candidates = rows.filter(function (r) { return r.p.key !== 'Sunrise'; });
    var next = candidates.find(function (r) { return r.mins > mins; }) || candidates[0];

    grid.innerHTML = '';
    rows.forEach(function (r) {
      var box = el('div', 'pray' + (r === next ? ' next' : ''));
      box.innerHTML =
        '<div class="p-ar" dir="rtl">' + r.p.ar + '</div>' +
        '<div class="p-th">' + r.p.th + '</div>' +
        '<div class="p-time">' + r.time + '</div>';
      grid.appendChild(box);
    });

    // แถบด้านบน
    if (next) {
      var strip = $('#prayerStrip');
      strip.hidden = false;
      $('#stripName').textContent = next.p.th + ' (' + next.p.ar + ')';
      $('#stripTime').textContent = next.time + ' น.';
      var diff = next.mins - mins; if (diff < 0) diff += 24 * 60;
      var h = Math.floor(diff / 60), m = diff % 60;
      $('#stripCount').textContent = 'อีก ' + (h ? h + ' ชั่วโมง ' : '') + m + ' นาที';
    }
  }

  function thaiDate() {
    var d = new Date();
    var days = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    var months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return days[d.getDay()] + 'ที่ ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + (d.getFullYear() + 543);
  }

  /* ---------------- วิดีโอจาก YouTube ---------------- */

  // fetch ที่มีเวลาหมดอายุ ป้องกันหน้าเว็บค้างรอไม่รู้จบ
  function fetchTimeout(url, ms) {
    if (typeof AbortController === 'undefined') return fetch(url);
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, ms || 8000);
    return fetch(url, { signal: ctrl.signal }).then(
      function (r) { clearTimeout(timer); return r; },
      function (e) { clearTimeout(timer); throw e; }
    );
  }

  function loadVideos() {
    var cid = SITE.channel.youtubeChannelId;
    var feed = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + cid;
    var painted = false;

    // 1) อ่านไฟล์ในเว็บตัวเองก่อน — เร็วที่สุดและไม่มีทางล่ม
    fetchTimeout('data/videos.json?t=' + Date.now(), 6000)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.videos || !j.videos.length) throw new Error('empty');
        painted = true;
        paintVideos(j.videos);
      })
      .catch(function () { /* ไม่มีไฟล์สำรอง รอผลจากภายนอกแทน */ });

    // 2) ดึงของใหม่จากภายนอกเป็นเบื้องหลัง ได้เมื่อไหร่ค่อยทับของเดิม
    var remote = [
      function () {
        return fetchTimeout('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed), 8000)
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (!j.items || !j.items.length) throw new Error('empty');
            return j.items.map(function (it) {
              return { id: idFrom(it.link || it.guid), title: it.title, date: it.pubDate };
            }).filter(function (v) { return v.id; });
          });
      },
      function () {
        return fetchTimeout('https://api.allorigins.win/raw?url=' + encodeURIComponent(feed), 8000)
          .then(function (r) { return r.text(); })
          .then(parseFeed);
      },
      function () {
        return fetchTimeout('https://corsproxy.io/?' + encodeURIComponent(feed), 8000)
          .then(function (r) { return r.text(); })
          .then(parseFeed);
      }
    ];

    (function attempt(i) {
      if (i >= remote.length) { if (!painted) showVideoError(); return; }
      remote[i]()
        .then(function (list) { painted = true; paintVideos(list); })
        .catch(function () { attempt(i + 1); });
    })(0);

    // กันเหนียว: ถ้าผ่านไป 26 วินาทีแล้วยังไม่มีอะไรขึ้น ให้แสดงข้อความแทนวงกลมหมุน
    setTimeout(function () { if (!painted) showVideoError(); }, 26000);
  }

  function idFrom(url) {
    var m = String(url || '').match(/[?&]v=([\w-]{11})|youtu\.be\/([\w-]{11})|video:([\w-]{11})/);
    return m ? (m[1] || m[2] || m[3]) : '';
  }

  function parseFeed(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    var entries = Array.prototype.slice.call(doc.getElementsByTagName('entry'));
    if (!entries.length) throw new Error('empty');
    return entries.map(function (e) {
      var vid = e.getElementsByTagName('yt:videoId')[0] || e.getElementsByTagName('videoId')[0];
      var title = e.getElementsByTagName('title')[0];
      var pub = e.getElementsByTagName('published')[0];
      return {
        id: vid ? vid.textContent : '',
        title: title ? title.textContent : '',
        date: pub ? pub.textContent : ''
      };
    }).filter(function (v) { return v.id; });
  }

  function paintVideos(videos) {
    videos = videos.slice(0, 9);
    if (!videos.length) return showVideoError();

    // เครื่องเล่นหลักใช้เพลย์ลิสต์คลิปที่อัปโหลดอยู่แล้ว จึงไม่ต้องเปลี่ยน

    // การ์ดวิดีโอ
    var grid = $('#videoGrid');
    grid.className = 'video-grid';
    $('#videoNote').hidden = true;
    grid.innerHTML = '';
    videos.forEach(function (v) {
      var a = el('a', 'card');
      a.href = 'https://www.youtube.com/watch?v=' + v.id;
      a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML =
        '<div class="card-thumb">' +
        '<img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">' +
        '<span class="card-play"><span><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span></span>' +
        '</div>' +
        '<div class="card-body">' +
        '<span class="card-title">' + esc(v.title) + '</span>' +
        '<span class="card-meta">' + (v.date ? relDate(v.date) : '') + '</span>' +
        '</div>';
      grid.appendChild(a);
    });
  }

  /* ถ้าดึงรายชื่อคลิปไม่ได้ ให้แสดงทางลัดที่ใช้งานได้จริงแทนข้อความ error
     เครื่องเล่นหลักด้านบนยังเล่นคลิปล่าสุดได้ตามปกติ */
  function showVideoError() {
    var base = SITE.channel.youtubeUrl.replace(/\/$/, '');
    var list = uploadsPlaylistId();
    var shortcuts = [
      { t: 'คลิปทั้งหมด', d: 'ดูวิดีโอทุกตอนเรียงตามวันที่', u: base + '/videos', i: 'book' },
      { t: 'ถ่ายทอดสด', d: 'รายการสดและคลิปย้อนหลังของไลฟ์', u: base + '/streams', i: 'mic' },
      { t: 'เพลย์ลิสต์', d: 'บทเรียนที่จัดชุดไว้เป็นซีรีส์', u: base + '/playlists', i: 'clock' }
    ];
    if (list) {
      shortcuts.unshift({
        t: 'คลิปล่าสุดทั้งชุด', d: 'เปิดเพลย์ลิสต์คลิปที่อัปโหลดล่าสุด',
        u: 'https://www.youtube.com/playlist?list=' + list, i: 'sparkle'
      });
    }

    var grid = $('#videoGrid');
    grid.className = 'cat-grid';
    grid.innerHTML = '';
    shortcuts.forEach(function (s) {
      var a = el('a', 'cat');
      a.href = s.u; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML =
        '<span class="cat-icon">' + icon(s.i) + '</span>' +
        '<h3>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p>' +
        '<span class="cat-more">เปิดบน YouTube →</span>';
      grid.appendChild(a);
    });

    var n = $('#videoNote');
    n.hidden = false;
    n.textContent = 'ขณะนี้ยังดึงรายชื่อคลิปมาแสดงเป็นการ์ดไม่ได้ จึงแสดงเป็นทางลัดไปยังช่องแทน — เครื่องเล่นด้านบนยังเล่นคลิปล่าสุดได้ตามปกติ';
  }

  function relDate(s) {
    var d = new Date(s);
    if (isNaN(d)) return '';
    var diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff < 1) return 'วันนี้';
    if (diff === 1) return 'เมื่อวาน';
    if (diff < 7) return diff + ' วันที่แล้ว';
    if (diff < 30) return Math.floor(diff / 7) + ' สัปดาห์ที่แล้ว';
    if (diff < 365) return Math.floor(diff / 30) + ' เดือนที่แล้ว';
    return Math.floor(diff / 365) + ' ปีที่แล้ว';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
