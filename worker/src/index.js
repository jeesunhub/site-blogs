export default {
    async fetch(request, env, ctx) {
        // Essential CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age': '86400',
        };

        // Helper to create a response with CORS
        const createResponse = (body, status = 200, contentType = 'application/json') => {
            return new Response(
                typeof body === 'string' ? body : JSON.stringify(body),
                {
                    status,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': contentType
                    }
                }
            );
        };

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname.toLowerCase().replace(/\/$/, '');

        try {
            // Health Check
            if (path === '/api/health') {
                return createResponse({
                    status: 'ok',
                    version: '1.0.2',
                    timestamp: new Date().toISOString()
                });
            }

            // Debug Helper
            if (path === '/api/debug') {
                return createResponse({
                    msg: 'Worker Debug',
                    path: url.pathname,
                    method: request.method,
                    kv_ready: !!env.MEDIA_KV
                });
            }

            // 1. Media Assets
            if (path.startsWith('/media/')) {
                const key = url.pathname.replace('/media/', '');
                const image = await env.MEDIA_KV.get(key, 'arrayBuffer');
                if (!image) return createResponse('Not Found', 404, 'text/plain');

                const ext = key.split('.').pop().toLowerCase();
                const mimeTypes = { 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif', 'svg': 'image/svg+xml', 'webp': 'image/webp' };

                return new Response(image, {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': mimeTypes[ext] || 'image/png',
                        'Cache-Control': 'public, max-age=31536000'
                    }
                });
            }

            // 2. Upload
            if (path === '/api/upload' && request.method === 'POST') {
                const formData = await request.formData();
                const file = formData.get('file');
                if (!file) return createResponse({ error: 'No file' }, 400);

                const key = `${crypto.randomUUID()}.${file.name?.split('.').pop() || 'png'}`;
                await env.MEDIA_KV.put(key, await file.arrayBuffer());

                return createResponse({
                    url: `${url.origin}/media/${key}`,
                    size: file.size
                });
            }

            // 3. Data API
            if (path === '/api/data') {
                if (request.method === 'GET') {
                    const data = await env.MEDIA_KV.get('site_data');
                    return createResponse(data || '{}');
                }
                if (request.method === 'POST') {
                    const data = await request.text();
                    await env.MEDIA_KV.put('site_data', data);
                    return createResponse({ success: true });
                }
            }

            return createResponse(`Not Found: ${url.pathname}`, 404, 'text/plain');

        } catch (err) {
            return createResponse({ error: err.message }, 500);
        }
    },
};
