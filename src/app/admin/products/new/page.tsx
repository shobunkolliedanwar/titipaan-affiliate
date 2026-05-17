'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLATFORMS = ['shopee', 'tokopedia', 'tiktok', 'lazada', 'blibli']

export default function NewProductPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: '', description: '', affiliate_url: '',
        short_slug: '', platform: 'shopee',
        original_price: '', discount_price: '',
        category_id: '',
    })

    const generateSlug = () => {
        const slug = Math.random().toString(36).substring(2, 8)
        setForm(f => ({ ...f, short_slug: slug }))
    }

    async function handleSubmit() {
        setLoading(true)
        const { error } = await supabase.from('products').insert({
            ...form,
            original_price: Number(form.original_price) || null,
            discount_price: Number(form.discount_price) || null,
        })
        if (!error) router.push('/admin/products')
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>

            <input className="input w-full" placeholder="Nama produk"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

            <textarea className="input w-full h-24" placeholder="Deskripsi"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

            <input className="input w-full" placeholder="Link affiliate (Shopee/Tokped/TikTok)"
                value={form.affiliate_url} onChange={e => setForm(f => ({ ...f, affiliate_url: e.target.value }))} />

            <select className="input w-full" value={form.platform}
                onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <div className="flex gap-2">
                <input className="input flex-1" placeholder="Short slug (misal: abc123)"
                    value={form.short_slug} onChange={e => setForm(f => ({ ...f, short_slug: e.target.value }))} />
                <button onClick={generateSlug} className="btn-secondary">Generate</button>
            </div>
            <p className="text-sm text-gray-500">
                Link: {process.env.NEXT_PUBLIC_BASE_URL}/go/{form.short_slug}
            </p>

            <div className="flex gap-4">
                <input className="input flex-1" placeholder="Harga asli" type="number"
                    value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} />
                <input className="input flex-1" placeholder="Harga diskon" type="number"
                    value={form.discount_price} onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))} />
            </div>

            <button onClick={handleSubmit} disabled={loading}
                className="btn-primary w-full">
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
        </div>
    )
}