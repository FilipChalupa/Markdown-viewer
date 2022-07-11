import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import MenuIcon from '@mui/icons-material/Menu'
import {
	AppBar,
	Container,
	IconButton,
	Toolbar,
	Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import { FunctionComponent, useCallback } from 'react'
import { usePWAInstall } from 'react-use-pwa-install'
import { Theme } from './Theme'

export const App: FunctionComponent = () => {
	const install = usePWAInstall()

	const showNotImplemented = useCallback(() => {
		alert('Not implemented.')
	}, [])

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
						onClick={showNotImplemented}
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
			<Container>
				<div
					style={{
						textAlign: 'center',
						paddingTop: '4em',
						paddingBottom: '4em',
					}}
				>
					<Typography variant="h4" gutterBottom>
						To continue choose one of the following:
					</Typography>
					<Button
						variant="contained"
						endIcon={<InsertDriveFileIcon />}
						onClick={showNotImplemented}
					>
						Open file
					</Button>{' '}
					<Button
						variant="contained"
						endIcon={<FolderIcon />}
						onClick={showNotImplemented}
					>
						Open folder
					</Button>
				</div>
			</Container>
		</Theme>
	)
}
