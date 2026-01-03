import { GoogleAnalytics } from '@next/third-parties/google'
import { getFeatureFlag } from '@/lib/services/feature-flags'

export async function Analytics() {
    let flag = null
    try {
        flag = await getFeatureFlag('analytics')
    } catch (error) {
        console.warn('Failed to fetch analytics feature flag, analytics disabled during build/error.')
    }

    if (!flag || !flag.enabled) {
        return null
    }

    const gaId = flag.value || process.env.NEXT_PUBLIC_GA_ID

    if (!gaId) {
        return null
    }

    return <GoogleAnalytics gaId={gaId} />
}
