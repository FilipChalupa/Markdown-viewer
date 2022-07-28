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
				name: 'Markdown Viewer',
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
				// 				src: 'icons/maskable.svg',
				// 				sizes: 'any',
				// 				type: 'image/svg+xml',
				// 				purpose: 'maskable',
				// 			},
				// 			{
				// 				src: 'icons/any.svg',
				// 				sizes: 'any',
				// 				type: 'image/svg+xml',
				// 				purpose: 'any',
				// 			},
				// 		],
				// 		launch_type: 'multiple-clients',
				// 	},
				// ],
				icons: [
					{
						src: 'icons/maskable.svg',
						sizes: 'any',
						type: 'image/svg+xml',
						purpose: 'maskable',
					},
					{
						src: 'icons/any.svg',
						sizes: 'any',
						type: 'image/svg+xml',
						purpose: 'any',
					},
				],
			},
		}),
	],
})
