// api/murid.js

export default async function handler(req, res) {
  try {
    // URL blogger kamu (ganti dengan URL asli)
    const BLOG_URL = "https://qulqid.blogspot.com/2025/09/informasi-murid.html";

    // User-Agent pool (rotating)
    const userAgents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Linux; Android 12; 22120RN86G Build/SKQ1.211006.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.62"
    ];

    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

    // Fetch HTML dari Blogger
    const response = await fetch(BLOG_URL, {
      headers: { "User-Agent": randomUA }
    });

    const html = await response.text();

    // --- Parsing dengan regex ---
    // Pisahkan berdasarkan "Nama :" (tiap blok = 1 murid)
    const blocks = html.split(/Nama\s*:/i).slice(1);

    const murid = blocks.map(block => {
      const name = block.match(/^\s*([^\n\r]+)/)?.[1]?.trim() || "";
      const DMYB = block.match(/DMYB\s*:\s*([^\n\r]+)/i)?.[1]?.trim() || "";
      const address = block.match(/Addres\s*:\s*([^\n\r]+)/i)?.[1]?.trim() || "";
      const kelas = block.match(/Class\s*:\s*([^\n\r]+)/i)?.[1]?.trim() || "";
      const photo = block.match(/Foto\s*:\s*([^\s]+)/i)?.[1]?.trim() || "";

      return { name, DMYB, Address: address, Class: kelas, Photo: photo };
    });

    // --- Filtering berdasarkan query ---
    const { nama, class: classQuery } = req.query;
    let result = murid;

    if (nama) {
      const lower = nama.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(lower));
    }

    if (classQuery) {
      result = result.filter(m => m.Class.toLowerCase() === classQuery.toLowerCase());
    }

    // Return JSON
    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: "Scraping failed", detail: err.message });
  }
                             }
