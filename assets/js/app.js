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

  /* ---------------- โหลด config ---------------- */
  fetch('data/site.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { SITE = data; render(); })
    .catch(function () {
      var note = $('#videoNote');
      if (note) { note.hidden = false; note.textContent = 'ไม่สามารถโหลดไฟล์ตั้งค่า data/site.json ได้'; }
    });

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
    buildCategories();
    buildSchedule();
    buildPrayerCities();
    loadPrayerTimes();
    loadVideos();

    $('#year').textContent = new Date().getFullYear() + 543 + ' / ' + new Date().getFullYear();
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

    fetch(url)
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
  function loadVideos() {
    var cid = SITE.channel.youtubeChannelId;
    var feed = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + cid;

    // ลองหลายช่องทาง แล้วค่อยตกมาที่ไฟล์สำรอง data/videos.json
    var sources = [
      function () {
        return fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed))
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (!j.items || !j.items.length) throw new Error('empty');
            return j.items.map(function (it) {
              return { id: idFrom(it.link || it.guid), title: it.title, date: it.pubDate };
            }).filter(function (v) { return v.id; });
          });
      },
      function () {
        return fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(feed))
          .then(function (r) { return r.text(); })
          .then(parseFeed);
      },
      function () {
        return fetch('data/videos.json')
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (!j.videos || !j.videos.length) throw new Error('empty');
            return j.videos;
          });
      }
    ];

    (function attempt(i) {
      if (i >= sources.length) return showVideoError();
      sources[i]().then(paintVideos).catch(function () { attempt(i + 1); });
    })(0);
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

    // วิดีโอเด่น
    var top = videos[0];
    var frame = $('#featuredFrame');
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + top.id +
      '?rel=0" title="' + esc(top.title) + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    $('#featuredTitle').textContent = top.title;

    // การ์ดวิดีโอ
    var grid = $('#videoGrid');
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

  function showVideoError() {
    $('#featuredSkeleton') && ($('#featuredFrame').innerHTML =
      '<div class="video-skeleton"><p style="color:#a9c4b9;font-size:14px;text-align:center;padding:0 20px">ไม่สามารถโหลดวิดีโออัตโนมัติได้<br>กดปุ่ม “ดูช่อง YouTube” ด้านซ้ายเพื่อรับชม</p></div>');
    $('#featuredTitle').textContent = '';
    $('#videoGrid').innerHTML = '';
    var n = $('#videoNote');
    n.hidden = false;
    n.textContent = 'ยังไม่สามารถดึงรายการวิดีโอได้ในขณะนี้ — ระบบจะดึงใหม่อัตโนมัติเมื่อรีเฟรชหน้า หรือดูรายการทั้งหมดได้บนช่อง YouTube';
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
