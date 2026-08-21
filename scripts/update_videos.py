"""ดึงรายการวิดีโอล่าสุดจาก RSS ของช่อง YouTube แล้วเขียนลง data/videos.json"""

import datetime
import json
import re
import sys
import time
import urllib.error
import urllib.request

with open("data/site.json", encoding="utf-8") as f:
    site = json.load(f)

channel_id = site["channel"]["youtubeChannelId"]
feed_url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channel_id
print("กำลังดึง:", feed_url)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/122.0 Safari/537.36",
    "Accept": "application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "th,en;q=0.9",
}

xml = None
for attempt in range(1, 4):
    try:
        request = urllib.request.Request(feed_url, headers=headers)
        xml = urllib.request.urlopen(request, timeout=30).read().decode("utf-8")
        print("ดึงสำเร็จในครั้งที่", attempt)
        break
    except urllib.error.HTTPError as err:
        print("ครั้งที่", attempt, "ไม่สำเร็จ - HTTP", err.code, err.reason)
    except Exception as err:
        print("ครั้งที่", attempt, "ไม่สำเร็จ -", type(err).__name__, err)
    time.sleep(5)

if xml is None:
    print("ดึง RSS ไม่สำเร็จทั้ง 3 ครั้ง - เก็บไฟล์เดิมไว้ ไม่ถือว่าล้มเหลว")
    sys.exit(0)

entries = re.findall(r"<entry>(.*?)</entry>", xml, re.S)
print("พบ entry ทั้งหมด", len(entries), "รายการ")
videos = []

for entry in entries[:15]:
    vid = re.search(r"<yt:videoId>(.*?)</yt:videoId>", entry)
    title = re.search(r"<title>(.*?)</title>", entry, re.S)
    published = re.search(r"<published>(.*?)</published>", entry)
    if not vid:
        continue
    text = title.group(1) if title else ""
    for bad, good in (("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"),
                      ("&quot;", '"'), ("&#39;", "'")):
        text = text.replace(bad, good)
    videos.append({
        "id": vid.group(1),
        "title": text.strip(),
        "date": published.group(1) if published else "",
    })

if not videos:
    print("ไม่พบวิดีโอใน feed - เก็บไฟล์เดิมไว้")
    sys.exit(0)

output = {
    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "note": "อัปเดตอัตโนมัติโดย GitHub Actions",
    "videos": videos,
}

with open("data/videos.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("เขียน", len(videos), "วิดีโอเรียบร้อย")
for v in videos[:3]:
    print("  -", v["id"], v["title"][:60])
