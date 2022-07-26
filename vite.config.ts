import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	build: {
		assetsInlineLimit: 0,
	},
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Your Markdown Viewer',
				short_name: 'MD viewer',
				start_url: '.',
				display: 'standalone',
				theme_color: '#1976D2',
				background_color: '#FFFFFF',
				description: '@TODO',
				categories: ['productivity', 'utilities'],
				related_applications: [],
				// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// // @ts-ignore
				// file_handlers: [
				// 	{
				// 		action: '/',
				// 		accept: {
				// 			'text/markdown': ['.md'],
				// 		},
				// 		icons: [
				// 			{
				// 				src: 'icons/icon-384x384.png',
				// 				sizes: '384x384',
				// 				type: 'image/png',
				// 				purpose: 'maskable any',
				// 			},
				// 		],
				// 		launch_type: 'multiple-clients',
				// 	},
				// ],
				icons: [
					{
						src: 'icons/icon-48x48.png',
						sizes: '48x48',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-72x72.png',
						sizes: '72x72',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-96x96.png',
						sizes: '96x96',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-128x128.png',
						sizes: '128x128',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-144x144.png',
						sizes: '144x144',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-152x152.png',
						sizes: '152x152',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png',
						purpose: 'maskable any',
					},
					{
						src: 'icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable any',
					},
				],
			},
		}),
	],
})
