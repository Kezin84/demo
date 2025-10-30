export default async function handler(req, res) {
  try {
    // Lấy query string (vd: action=getHoaDonTong)
    const query = req.url.split("?")[1] || "";

    // ✅ Thay link GAS của mày ở đây
    const target = `https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec?${query}`;

    // Gửi request sang Apps Script thật
    const response = await fetch(target, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const text = await response.text();

    // ⚡ Cache tại edge Singapore 30 giây
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
    res.status(200).send(text);
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
