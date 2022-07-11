import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { FunctionComponent } from 'react'
import { usePWAInstall } from 'react-use-pwa-install'
import { Theme } from './Theme'

export const App: FunctionComponent = () => {
	const install = usePWAInstall()

	return (
		<Theme>
			<AppBar position="sticky">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
						Markdown viewer
					</Typography>
					{install && (
						<Button color="secondary" variant="contained" onClick={install}>
							Install
						</Button>
					)}
				</Toolbar>
			</AppBar>
			Hello World!
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<Button variant="contained">Yes</Button>
		</Theme>
	)
}
