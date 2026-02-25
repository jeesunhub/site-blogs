export default {
    async fetch(request, env, ctx) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        const respond = (data, status = 200, type = 'application/json') => {
            const body = typeof data === 'string' ? data : JSON.stringify(data);
            return new Response(body, {
                status,
                headers: { ...corsHeaders, 'Content-Type': type }
            });
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        try {
            // Health Check
            if (url.pathname === '/api/health') return respond({ status: 'ok', version: '1.0.1', timestamp: new Date().toISOString() });

            // 1. Serve Uploaded Media
            if (url.pathname.startsWith('/media/')) {
                const key = url.pathname.replace('/media/', '');
                const image = await env.MEDIA_KV.get(key, 'arrayBuffer');
                if (image) {
                    let contentType = 'image/png';
                    const ext = key.split('.').pop().toLowerCase();
                    const mimeTypes = { 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'gif': 'image/gif', 'svg': 'image/svg+xml', 'webp': 'image/webp' };
                    contentType = mimeTypes[ext] || 'image/png';

                    return new Response(image, {
                        headers: {
                            ...corsHeaders,
                            'Content-Type': contentType,
                            'Cache-Control': 'public, max-age=31536000'
                        }
                    });
                }
                return respond('Image not found', 404, 'text/plain');
            }

            // 2. Handle Image Upload
            if (url.pathname === '/api/upload' && request.method === 'POST') {
                const formData = await request.formData();
                const file = formData.get('file');
                if (!file) return respond({ error: 'No file uploaded' }, 400);

                const filename = file.name || `${Date.now()}.png`;
                const fileExt = filename.split('.').pop();
                const key = `${crypto.randomUUID()}.${fileExt}`;

                await env.MEDIA_KV.put(key, await file.arrayBuffer());

                return respond({
                    url: `${url.origin}/media/${key}`,
                    size: file.size
                });
            }

            // 3. Get Site Data
            if (url.pathname.replace(/\/$/, '') === '/api/data' && request.method === 'GET') {
                try {
                    const data = await env.MEDIA_KV.get('site_data');
                    return respond(data || '{}');
                } catch (kvErr) {
                    return respond({ error: 'KV Error', details: kvErr.message }, 500);
                }
            }

            // 4. Save Site Data
            if (url.pathname.replace(/\/$/, '') === '/api/data' && request.method === 'POST') {
                const data = await request.text();
                await env.MEDIA_KV.put('site_data', data);
                return respond({ success: true });
            }

            // Debug endpoint
            if (url.pathname === '/api/debug') {
                return respond({
                    msg: 'Worker Debug Info',
                    timestamp: new Date().toISOString(),
                    kv_bound: !!env.MEDIA_KV,
                    pathname: url.pathname,
                    method: request.method
                });
            }

            return respond(`Path not found: ${url.pathname}`, 404, 'text/plain');

        } catch (err) {
            return respond({ error: err.message }, 500);
        }
    },
};
