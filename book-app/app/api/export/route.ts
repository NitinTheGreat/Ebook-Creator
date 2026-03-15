import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { html, title } = await req.json();

    if (!html) {
      return NextResponse.json({ error: "No HTML provided" }, { status: 400 });
    }

    // Dynamically import puppeteer-core
    const puppeteer = await import("puppeteer-core");

    // Find Chrome/Chromium executable
    const executablePath = await findChromePath();

    if (!executablePath) {
      return NextResponse.json(
        { error: "Chrome not found. Please install Google Chrome." },
        { status: 500 }
      );
    }

    const browser = await puppeteer.default.launch({
      headless: true,
      executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 500));

    const pdfBuffer = await page.pdf({
      width: "6in",
      height: "9in",
      margin: {
        top: "1in",
        bottom: "1in",
        left: "1.25in",
        right: "0.75in",
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width:100%;text-align:center;font-size:7pt;color:#888;font-family:Georgia,serif;letter-spacing:0.15em;text-transform:uppercase;padding-top:0.3in;">
          ${title || ""}
        </div>
      `,
      footerTemplate: `
        <div style="width:100%;text-align:center;font-size:8pt;color:#888;font-family:Georgia,serif;padding-bottom:0.3in;">
          <span class="pageNumber"></span>
        </div>
      `,
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(title || "ebook").replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "PDF generation failed. Please use the print fallback (Ctrl+P)." },
      { status: 500 }
    );
  }
}

async function findChromePath(): Promise<string | null> {
  const fs = await import("fs");

  const possiblePaths = [
    // Windows
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      continue;
    }
  }

  return null;
}
