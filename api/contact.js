import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS: only allow requests from edplit.es
  const allowedOrigins = ['https://edplit.es', 'https://www.edplit.es'];
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { nombre, empresa, email, telefono, tipo, mensaje } = req.body;

    // Basic validation
    if (!nombre || !email) {
      return res.status(400).json({ message: 'Nombre y email son requeridos' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Map internal "tipo" values to human-readable labels for the email
    const TIPO_LABELS = {
      reforma: 'Reforma particular',
      'obra-nueva': 'Obra nueva',
      profesional: 'Colaboración profesional',
      distribucion: 'Distribución / reventa',
      soporte_tecnico: 'SOPORTE TÉCNICO',
      formacion: 'Formación / soporte técnico',
    };
    // Visible tag/label attached to the request when it arrives via a specific flow
    const REQUEST_TAGS = {
      soporte_tecnico: 'SOPORTE TÉCNICO',
      profesional: 'PROGRAMA PARTNERS',
      formacion: 'FORMACIÓN',
    };
    const tipoLabel = TIPO_LABELS[tipo] || tipo || 'No especificado';
    const requestTag = REQUEST_TAGS[tipo] || null;

    // Prepare email content
    const emailContent = `
      Nueva solicitud de contacto - EDPLIT España
      ${requestTag ? `\n      [${requestTag}]\n` : ''}
      Nombre: ${nombre}
      ${empresa ? `Empresa: ${empresa}` : ''}
      Email: ${email}
      ${telefono ? `Teléfono: ${telefono}` : ''}
      Tipo de proyecto: ${tipoLabel}

      Mensaje:
      ${mensaje || 'Sin mensaje'}

      ---
      Enviado desde: edplit.es
      Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
    `;

    // ==========================================
    // 1. SEND EMAIL VIA RESEND
    // ==========================================
    // You'll need to install: npm install resend
    // And set RESEND_API_KEY in Vercel environment variables

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'EDPLIT España <contacto@edplit.es>',
      to: ['admin@edplit.es', 'contacto@edplit.es'],
      replyTo: email,
      subject: requestTag
        ? `[${requestTag}] Nueva solicitud - ${nombre}`
        : `Nueva solicitud: ${tipoLabel} - ${nombre}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #B88657;">Nueva solicitud de contacto</h2>
          ${requestTag ? `<p style="display:inline-block; background:#B88657; color:#fff; padding:4px 12px; border-radius:4px; font-weight:bold; font-size:12px; letter-spacing:0.5px;">${requestTag}</p>` : ''}
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${nombre}</p>
            ${empresa ? `<p><strong>Empresa:</strong> ${empresa}</p>` : ''}
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${telefono ? `<p><strong>Teléfono:</strong> <a href="tel:${telefono}">${telefono}</a></p>` : ''}
            <p><strong>Tipo de proyecto:</strong> ${tipoLabel}</p>
          </div>
          ${mensaje ? `
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Mensaje:</h3>
              <p style="white-space: pre-wrap;">${mensaje}</p>
            </div>
          ` : ''}
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Enviado desde edplit.es<br>
            ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
          </p>
        </div>
      `
    });

    // ==========================================
    // 2. ADD CONTACT TO BREVO
    // ==========================================
    if (process.env.BREVO_API_KEY) {
      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
          },
          body: JSON.stringify({
            email: email,
            attributes: {
              FIRSTNAME: nombre.split(' ')[0] || nombre,
              LASTNAME: nombre.split(' ').slice(1).join(' ') || '',
              // Format phone: add +34 if Spanish number without prefix
              ...(telefono && telefono.trim() && {
                SMS: telefono.startsWith('+') ? telefono.replace(/\s/g, '') :
                  telefono.replace(/\s/g, '').length >= 9 ? '+34' + telefono.replace(/\s/g, '').replace(/^0+/, '') :
                    undefined
              }),
              COMPANY: empresa || '',
              TIPO_PROYECTO: tipo || '',
              MENSAJE: mensaje || '',
              FECHA_CONTACTO: new Date().toISOString()
            },
            listIds: [parseInt(process.env.BREVO_LIST_ID || '2')], // Default list ID
            updateEnabled: true // Update if contact already exists
          })
        });

        // Brevo returns 201 for new contact, 204 for updated contact
        if (!brevoResponse.ok && brevoResponse.status !== 204) {
          console.error('Brevo API error:', await brevoResponse.text());
          // Don't fail the whole request if Brevo fails
        }
      } catch (brevoError) {
        console.error('Error adding to Brevo:', brevoError);
        // Don't fail the whole request if Brevo fails
      }
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor. Inténtalo de nuevo o contáctanos directamente.'
    });
  }
}
