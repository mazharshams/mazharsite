export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { image, mimeType } = req.body;

        if (!image || !mimeType) {
            return res.status(400).json({ error: 'Missing image data' });
        }

        const prompt = `You are a receipt data extraction assistant. Analyze this receipt image and extract all meaningful data into a structured JSON object.

Return ONLY valid JSON (no markdown, no code fences, no explanation) with this structure:
{
  "store": {
    "name": "Store name",
    "address": "Full address if visible",
    "phone": "Phone number if visible"
  },
  "date": "Date of transaction",
  "time": "Time of transaction",
  "items": [
    {
      "name": "Item description",
      "quantity": 1,
      "unit_price": 0.00,
      "total": 0.00
    }
  ],
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "payment_method": "Cash/Card/etc",
  "additional_info": {}
}

If a field is not visible on the receipt, omit it. Only include fields you can confidently extract.`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 4096
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error('Gemini API error:', errData);
            return res.status(502).json({ error: 'AI service returned an error. Please try again.' });
        }

        const data = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return res.status(502).json({ error: 'No response from AI. Please try a clearer image.' });
        }

        let cleanText = text.trim();
        if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        let result;
        try {
            result = JSON.parse(cleanText);
        } catch (parseErr) {
            return res.status(502).json({ error: 'Could not parse extracted data. Please try a clearer image.' });
        }

        return res.status(200).json({ result });

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
