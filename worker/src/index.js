export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // 1. Serve Uploaded Media
            if (url.pathname.startsWith('/media/')) {
                const key = url.pathname.replace('/media/', '');
                const image = await env.MEDIA_KV.get(key, 'arrayBuffer');
                if (image) {
                    let contentType = 'image/png';
                    if (key.endsWith('.jpg') || key.endsWith('.jpeg')) contentType = 'image/jpeg';
                    if (key.endsWith('.gif')) contentType = 'image/gif';
                    if (key.endsWith('.svg')) contentType = 'image/svg+xml';
                    if (key.endsWith('.webp')) contentType = 'image/webp';

                    return new Response(image, {
                        headers: {
                            ...corsHeaders,
                            'Content-Type': contentType,
                            'Cache-Control': 'public, max-age=31536000'
                        }
                    });
                }
                return new Response('Image not found', { status: 404, headers: corsHeaders });
            }

            // 2. Handle Image Upload
            if (url.pathname === '/api/upload' && request.method === 'POST') {
                const formData = await request.formData();
                const file = formData.get('file');
                if (!file) return new Response('No file uploaded', { status: 400, headers: corsHeaders });

                const filename = file.name || `${Date.now()}.png`;
                const fileExt = filename.split('.').pop();
                const key = `${crypto.randomUUID()}.${fileExt}`;

                await env.MEDIA_KV.put(key, await file.arrayBuffer());

                return new Response(JSON.stringify({
                    url: `${url.origin}/media/${key}`,
                    size: file.size
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // 3. Get Site Data
            if ((url.pathname === '/api/data' || url.pathname === '/api/data/') && request.method === 'GET') {
                const data = await env.MEDIA_KV.get('site_data');
                return new Response(data || '{}', {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // 4. Save Site Data (Simplified: in production, verify Clerk session)
            if ((url.pathname === '/api/data' || url.pathname === '/api/data/') && request.method === 'POST') {
                const data = await request.text();
                await env.MEDIA_KV.put('site_data', data);
                return new Response(JSON.stringify({ success: true }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            return new Response('Path not found', {
                status: 404,
                headers: { 'Content-Type': 'text/plain', ...corsHeaders }
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    },
};
