import { createClient } from '@/lib/supabase/server'

export default async function AnalyticsPage() {
    const supabase = await createClient()

    // Top produk berdasarkan klik
    const { data: topProducts } = await supabase
        .from('click_logs')
        .select('product_id, products(name, short_slug, platform)')
        .gte(
            'clicked_at',
            new Date(Date.now() - 30 * 86400000).toISOString()
        )

    // Hitung per produk
    const counts: Record<
        string,
        {
            name: string
            platform: string
            count: number
        }
    > = {}

    topProducts?.forEach(
        ({ product_id, products: p }: any) => {
            if (!counts[product_id]) {
                counts[product_id] = {
                    name: p.name,
                    platform: p.platform,
                    count: 0,
                }
            }

            counts[product_id].count++
        }
    )

    const sorted = Object.values(counts).sort(
        (a, b) => b.count - a.count
    )

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Analytics — 30 Hari Terakhir
            </h1>

            <div className="space-y-3">
                {sorted.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                        <div>
                            <p className="font-medium">
                                {item.name}
                            </p>

                            <p className="text-sm text-gray-500 capitalize">
                                {item.platform}
                            </p>
                        </div>

                        <span className="text-2xl font-bold text-blue-600">
                            {item.count} klik
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}