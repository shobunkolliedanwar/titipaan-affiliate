import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params  // ← wajib await di Next.js 15+

    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('id, affiliate_url')
        .eq('short_slug', slug)
        .eq('is_active', true)
        .single()

    if (!product) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Catat klik (non-blocking)
    supabase.from('click_logs').insert({
        product_id: product.id,
        ip_address: request.headers.get('x-forwarded-for') ?? '',
        user_agent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
    })

    return NextResponse.redirect(product.affiliate_url, { status: 302 })
}