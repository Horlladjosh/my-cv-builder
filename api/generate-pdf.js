module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'No CV data provided' });
    }

    // Generate HTML content
    const htmlContent = generateHTML(data);

    // Use PDFShift free API (250 PDFs/month)
    // Sign up at https://pdfshift.io for API key
    const PDFSHIFT_API_KEY = process.env.PDFSHIFT_API_KEY;

    if (!PDFSHIFT_API_KEY) {
      // No API key configured - return error so frontend falls back to HTML
      return res.status(503).json({ error: 'PDF service not configured' });
    }

    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from('api:' + PDFSHIFT_API_KEY).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: htmlContent,
        landscape: false,
        use_print: true,
      })
    });

    if (!pdfResponse.ok) {
      // API limit reached or error - trigger HTML fallback
      return res.status(503).json({ error: 'PDF service limit reached' });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(pdfBuffer);

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${data.name.toLowerCase().replace(/\s+/g, '-')}-cv.pdf"`);
    res.send(buffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    // Return 503 to trigger HTML fallback
    res.status(503).json({ error: 'PDF generation failed' });
  }
}

function generateHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${data.name} - CV</title>
    <style>
        @page { margin: 5mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 20px; background: #f5f5f5; }
        .container { background: white; padding: 60px; max-width: 1000px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 40px; }
        .label { font-size: 9px; letter-spacing: 0.2em; color: #999; margin-bottom: 15px; font-weight: 500; }
        h1 { font-size: 32px; font-weight: 400; margin-bottom: 20px; color: #000; line-height: 1.1; }
        h2 { font-size: 24px; font-weight: 400; margin-bottom: 20px; color: #000; line-height: 1.2; }
        .bio { font-size: 13px; color: #666; margin-bottom: 25px; line-height: 1.6; }
        .contact-item { font-size: 12px; color: #666; margin-bottom: 6px; line-height: 1.6; }
        .contact-label { font-weight: 500; color: #000; margin-right: 4px; }
        .skill-item { font-size: 12px; color: #666; margin-bottom: 6px; line-height: 1.6; }
        .item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5; }
        .item:last-child { border-bottom: none; }
        .header { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .company { font-size: 14px; font-weight: 500; color: #000; line-height: 1.3; }
        .year { font-size: 11px; color: #999; }
        .role { font-size: 12px; color: #666; margin-bottom: 8px; line-height: 1.4; }
        .prod-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
        .prod-title { font-size: 14px; font-weight: 500; color: #000; }
        .prod-role { font-size: 12px; color: #666; }
        ul { list-style: none; margin-bottom: 4px; }
        li { font-size: 12px; color: #666; margin-bottom: 5px; padding-left: 15px; position: relative; line-height: 1.6; }
        li:before { content: "•"; position: absolute; left: 0; color: #999; }
        @media print { body { background: white; padding: 0; } .container { box-shadow: none; padding: 8mm 10mm; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="grid">
            <div>
                <div class="label">SELECTED WORK</div>
                <h2>Work</h2>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="header"><div class="company">${exp.company}</div><div class="year">${exp.year}</div></div>
                        <div class="role">${exp.role}</div>
                        <ul>${exp.points.map(p => `<li>${p}</li>`).join('')}</ul>
                    </div>
                `).join('')}
                <div style="margin-top: 40px;">
                    <h2>Notable Projects</h2>
                    ${data.products.map(prod => `
                        <div class="item">
                            <div class="prod-header">
                                <span class="prod-title">${prod.title}</span>
                                <span style="color: #999;">-</span>
                                <span class="prod-role">${prod.role}</span>
                            </div>
                            <ul>${prod.points.map(p => `<li>${p}</li>`).join('')}</ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div>
                <div class="label">CURRICULUM VITAE</div>
                <h1>${data.name}</h1>
                <div class="bio">${data.bio}</div>
                <div style="margin-bottom: 25px;">
                    <div class="contact-item"><span class="contact-label">Email:</span>${data.email}</div>
                    <div class="contact-item"><span class="contact-label">Twitter:</span>${data.twitter}</div>
                    <div class="contact-item"><span class="contact-label">LinkedIn:</span>${data.linkedin}</div>
                </div>
                <div class="label" style="margin-top: 30px;">SKILLS</div>
                <div style="margin-bottom: 20px;">${data.skills.map(s => `<div class="skill-item">${s}</div>`).join('')}</div>
                <div class="label" style="margin-top: 30px;">CERTIFICATIONS</div>
                <div style="margin-bottom: 20px;">${data.certifications.map(c => `<div class="skill-item">${c}</div>`).join('')}</div>
                <div class="label" style="margin-top: 30px;">RECOGNITION</div>
                <div>${data.recognition.map(r => `<div class="skill-item">${r}</div>`).join('')}</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}
