import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    const [{ count: totalProducts }, { count: totalClicks }] =
        await Promise.all([
            supabase
                .from('products')
                .select('*', {
                    count: 'exact',
                    head: true,
                }),

            supabase
                .from('click_logs')
                .select('*', {
                    count: 'exact',
                    head: true,
                }),
        ])

    const stats = [
        {
            label: 'Total Produk',
            value: totalProducts ?? 0,
            href: '/admin/products',
        },
        {
            label: 'Total Klik',
            value: totalClicks ?? 0,
            href: '/admin/analytics',
        },
    ]

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Dashboard Admin
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((s) => (
                    <Link
                        key={s.label}
                        href={s.href}
                        className="block p-6 bg-white rounded-xl border hover:shadow-md transition"
                    >
                        <p className="text-sm text-gray-500">
                            {s.label}
                        </p>

                        <p className="text-4xl font-bold mt-1">
                            {s.value}
                        </p>
                    </Link>
                ))}
            </div>

            <Link
                href="/admin/products/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
                + Tambah Produk Baru
            </Link>
        </div>
    )
}