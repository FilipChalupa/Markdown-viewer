import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import MenuIcon from '@mui/icons-material/Menu'
import {
	AppBar,
	Container,
	IconButton,
	Link,
	Toolbar,
	Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import { SnackbarProvider } from 'notistack'
import { FunctionComponent, useCallback, useState } from 'react'
import { usePWAInstall } from 'react-use-pwa-install'
import { useToast } from '../utilities/useToast'
import { MarkdownView } from './MarkdownView'
import { Theme } from './Theme'

type View =
	| {
			type: 'landing'
	  }
	| {
			type: 'single-file'
			name: string
			content: string
	  }
	| {
			type: 'directory'
	  }

const In: FunctionComponent = () => {
	const showToast = useToast()
	const install = usePWAInstall()
	const [view, setView] = useState<View>({ type: 'landing' })

	const showNotImplemented = useCallback(() => {
		showToast('This is not yet implemented.', 'error')
	}, [])

	const showFilePicker = useCallback(async () => {
		try {
			const [handle] = await showOpenFilePicker({
				types: [
					{
						accept: {
							'text/markdown': ['.md'],
						},
					},
				],
			})
			const file = await handle.getFile()
			const { name } = file
			const content = await file.text()
			setView({
				type: 'single-file',
				name,
				content,
			})
		} catch (error) {
			console.error(error)
		}
	}, [])

	return (
		<>
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
						<Link href="/" color="inherit" underline="hover">
							Markdown viewer
						</Link>
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
					{view.type === 'landing' ? (
						<>
							<Typography variant="h4" gutterBottom>
								To continue choose one of the following:
							</Typography>
							<Button
								variant="contained"
								endIcon={<InsertDriveFileIcon />}
								onClick={showFilePicker}
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
						</>
					) : view.type === 'single-file' ? (
						<>
							<Typography variant="h4" gutterBottom>
								<InsertDriveFileIcon /> {view.name}
							</Typography>
							<MarkdownView
								content={view.content}
								onNavigationRequest={showNotImplemented}
							/>
						</>
					) : view.type === 'directory' ? (
						<>@TODO: directory</>
					) : null}
				</div>
			</Container>
		</>
	)
}

export const App: FunctionComponent = () => {
	return (
		<Theme>
			<SnackbarProvider
				maxSnack={3}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
			>
				<In />
			</SnackbarProvider>
		</Theme>
	)
}
