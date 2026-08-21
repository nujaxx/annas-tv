"""ดึงรายการวิดีโอล่าสุดจาก RSS ของช่อง YouTube แล้วเขียนลง data/videos.json"""

import datetime
import json
import re
import sys
import urllib.request

with open("data/site.json", encoding="utf-8") as f:
    site = json.load(f)

channel_id = site["channel"]["youtubeChannelId"]
feed_url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channel_id

request = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0"})
xml = urllib.request.urlopen(request, timeout=30).read().decode("utf-8")

entries = re.findall(r"<entry>(.*?)</entry>", xml, re.S)
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
    print("ไม่พบวิดีโอใน feed - ยกเลิกการเขียนไฟล์")
    sys.exit(0)

output = {
    "updatedAt": datetime.datetime.utcnow().isoformat() + "Z",
    "note": "อัปเดตอัตโนมัติโดย GitHub Actions",
    "videos": videos,
}

with open("data/videos.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("เขียน " + str(len(videos)) + " วิดีโอเรียบร้อย")
