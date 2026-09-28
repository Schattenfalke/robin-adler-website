import { useTranslation } from 'react-i18next'
import { ThreeDoors } from '../components/Hero/ThreeDoors'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col items-center gap-16 text-center">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold sm:text-5xl">{t('hero.title')}</h1>
        <p className="text-lg text-gray-muted">{t('hero.subtitle')}</p>
      </div>
      <div className="w-full max-w-4xl">
        <ThreeDoors />
      </div>
    </section>
  )
}
