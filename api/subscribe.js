/**
 * API Route: /api/subscribe
 *
 * Captures popup leads and adds them to Brevo list ID 6
 * (separate from the main contact form list).
 *
 * Env vars needed (already in Vercel):
 *   BREVO_API_KEY  — your Brevo API key
 */

export default async function handler(req, res) {
  // CORS: only allow requests from edplit.es
  const allowedOrigins = ['https://edplit.es', 'https://www.edplit.es'];
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { nombre, email, source, discount } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY not configured');
      return res.status(500).json({ message: 'Error de configuración' });
    }

    const POPUP_LIST_ID = 6; // Lista "Leads-Popup-EdPlit" creada en Brevo

    const brevoBody = {
      email,
      attributes: {
        FIRSTNAME:        nombre ? nombre.split(' ')[0] : '',
        LASTNAME:         nombre ? nombre.split(' ').slice(1).join(' ') : '',
        FUENTE:           source   || 'popup',
        CODIGO_DESCUENTO: discount || 'BIENVENIDO5',
        FECHA_CONTACTO:   new Date().toISOString(),
      },
      listIds:       [POPUP_LIST_ID],
      updateEnabled: true, // update contact if already exists
    };

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method:  'POST',
      headers: {
        'accept':       'application/json',
        'content-type': 'application/json',
        'api-key':      process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(brevoBody),
    });

    // 201 = new contact created, 204 = existing contact updated — both OK
    if (!brevoRes.ok && brevoRes.status !== 204) {
      const errText = await brevoRes.text();

      // Treat "already exists" as success (contact already in list)
      if (brevoRes.status === 400 && errText.includes('already exist')) {
        console.log(`Popup lead already in Brevo: ${email}`);
        return res.status(200).json({ success: true, message: 'Contacto ya registrado' });
      }

      console.error('Brevo API error:', brevoRes.status, errText);
      return res.status(500).json({ message: 'Error al registrar contacto en Brevo' });
    }

    console.log(`✅ Popup lead captured: ${email} (source: ${source})`);

    return res.status(200).json({
      success: true,
      message: 'Registrado correctamente',
    });

  } catch (error) {
    console.error('Subscribe API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
