// api/admin/contacts.js
// API to fetch contacts from Brevo CRM (protected)

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Simple token authentication
    const { token, search = '', limit = '50', offset = '0' } = req.query;

    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check Brevo API key
    if (!process.env.BREVO_API_KEY) {
        return res.status(500).json({ message: 'BREVO_API_KEY not configured' });
    }

    try {
        // Fetch contacts from Brevo
        const response = await fetch(
            `https://api.brevo.com/v3/contacts?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Brevo API error:', errorText);
            return res.status(response.status).json({ message: 'Error fetching from Brevo' });
        }

        const data = await response.json();

        // Format contacts
        const contacts = data.contacts?.map((contact) => ({
            id: contact.id,
            email: contact.email,
            name: `${contact.attributes?.FIRSTNAME || ''} ${contact.attributes?.LASTNAME || ''}`.trim() || '-',
            phone: contact.attributes?.SMS || contact.attributes?.PHONE || '-',
            company: contact.attributes?.COMPANY || '-',
            projectType: contact.attributes?.TIPO_PROYECTO || '-',
            message: contact.attributes?.MENSAJE || '-',
            contactDate: contact.attributes?.FECHA_CONTACTO || '-',
            createdAt: contact.createdAt,
        })) || [];

        // Client-side search filter (Brevo free doesn't have advanced search)
        const filtered = search
            ? contacts.filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.company.toLowerCase().includes(search.toLowerCase())
            )
            : contacts;

        return res.status(200).json({
            success: true,
            contacts: filtered,
            count: data.count || 0,
        });

    } catch (error) {
        console.error('Error fetching contacts:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            details: error.message,
        });
    }
}
