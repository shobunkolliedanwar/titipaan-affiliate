import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const platform = searchParams.get('platform')
    const category = searchParams.get('category')

    let query = supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (platform) query = query.eq('platform', platform)
    if (category) query = query.eq('category_id', category)

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
        .from('products')
        .insert(body)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}