import { GoogleAnalytics } from '@next/third-parties/google'
import { getFeatureFlag } from '@/lib/services/feature-flags'

export async function Analytics() {
    const flag = await getFeatureFlag('analytics')

    if (!flag || !flag.enabled) {
        return null
    }

    const gaId = flag.value || process.env.NEXT_PUBLIC_GA_ID

    if (!gaId) {
        return null
    }

    return <GoogleAnalytics gaId={gaId} />
}
