import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { initReactI18next } from 'react-i18next'
import { App } from './components/App'
import './index.css'
import csTranslation from './translations/cs.json'
import enTranslation from './translations/en.json'

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: {
			en: {
				translation: enTranslation,
			},
			cs: {
				translation: csTranslation,
			},
		},
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
