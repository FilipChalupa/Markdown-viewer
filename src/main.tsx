import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { initReactI18next } from 'react-i18next'
import { App } from './components/App'
import './index.css'

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: {
			en: {
				translation: {
					welcome: 'To continue choose one of the following:',
					'open.file': 'Open file',
					'open.directory': 'Open folder',
				},
			},
			cs: {
				translation: {
					welcome: 'Pro pokračování zvolte jednu z možností níže:',
					'open.file': 'Otevřít soubor',
					'open.directory': 'Otevřít složku',
				},
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
