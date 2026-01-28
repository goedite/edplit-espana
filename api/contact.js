import { Resend } from 'resend';

export default async function handler(req, res) {
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

    // Prepare email content
    const emailContent = `
      Nueva solicitud de contacto - EDPLIT España
      
      Nombre: ${nombre}
      ${empresa ? `Empresa: ${empresa}` : ''}
      Email: ${email}
      ${telefono ? `Teléfono: ${telefono}` : ''}
      Tipo de proyecto: ${tipo || 'No especificado'}
      
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
      subject: `Nueva solicitud: ${tipo || 'Contacto'} - ${nombre}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #B88657;">Nueva solicitud de contacto</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${nombre}</p>
            ${empresa ? `<p><strong>Empresa:</strong> ${empresa}</p>` : ''}
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${telefono ? `<p><strong>Teléfono:</strong> <a href="tel:${telefono}">${telefono}</a></p>` : ''}
            <p><strong>Tipo de proyecto:</strong> ${tipo || 'No especificado'}</p>
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
    // DEBUG: Return specific error to frontend to identify the issue
    return res.status(500).json({
      success: false,
      message: error.message || 'Error desconocido',
      details: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
  }
}
