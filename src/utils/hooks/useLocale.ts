import { useEffect } from "react"
import dayjs from "dayjs"
import i18n from "i18next"
import { useAppSelector } from "@/store"
import { dateLocales } from "@/locales"

function useLocale() {
  const locale = useAppSelector((s) => s.locale.currentLang)

  useEffect(() => {
    const formattedLang = locale.replace(/-([a-z])/g, (g) => g[1].toUpperCase())

    if (locale !== i18n.language) {
      i18n.changeLanguage(formattedLang)
    }

    const loader = dateLocales[formattedLang]

    if (typeof loader === "function") {
      loader().then(() => dayjs.locale(formattedLang))
    } else {
      console.warn(`Locale loader missing for ${formattedLang}`)
      dayjs.locale("en") // fallback
    }
  }, [locale])

  return locale
}

export default useLocale  