import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const supabase = await createClient()

    // Cari produk berdasarkan slug
    const { data: product } = await supabase
        .from('products')
        .select('id, affiliate_url')
        .eq('short_slug', params.slug)
        .eq('is_active', true)
        .single()

    if (!product) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Catat klik (non-blocking)
    supabase.from('click_logs').insert({
        product_id: product.id,
        ip_address:
            request.headers.get('x-forwarded-for') ??
            request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
    })

    // Redirect ke link affiliate
    return NextResponse.redirect(product.affiliate_url, {
        status: 302,
    })
}