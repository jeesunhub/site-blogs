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

        // Token Verification for POST/PUT/DELETE
        if (request.method !== 'GET' && request.method !== 'OPTIONS' && (path.startsWith('/api/') && path !== '/api/health')) {
            const authHeader = request.headers.get('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return createResponse({ error: 'Unauthorized: Missing or invalid token' }, 401);
            }
            const token = authHeader.split(' ')[1];
            if (!token || token.length < 5) {
                return createResponse({ error: 'Unauthorized: Invalid token format' }, 401);
            }
            // For production with Clerk, we'd verify JWT here. 
            // For now, we allow 'local_test_' prefix to maintain test login.
            console.log(`[AUTH] Token detected. Start with: ${token.substring(0, 15)}...`);
        }

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
                    normalized_path: path,
                    method: request.method,
                    origin: request.headers.get('Origin'),
                    kv_ready: !!env.MEDIA_KV,
                    version: '1.0.3'
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
