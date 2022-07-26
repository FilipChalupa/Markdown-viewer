import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import CodeIcon from '@mui/icons-material/Code'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import MenuIcon from '@mui/icons-material/Menu'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
	AppBar,
	Box,
	Container,
	Divider,
	Drawer,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Switch,
	Toolbar,
	Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { FunctionComponent, useCallback, useState } from 'react'
import { usePWAInstall } from 'react-use-pwa-install'
import { version } from '../../package.json'
import { useToast } from '../utilities/useToast'
import { DirectoryView } from './DirectoryView'
import { MarkdownView } from './MarkdownView'
import { Path } from './Path'
import { Theme } from './Theme'

type View = { id: number } & (
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
			handle: FileSystemDirectoryHandle
	  }
)

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
	justifyContent: 'flex-start',
}))

const In: FunctionComponent = () => {
	const showToast = useToast()
	const install = usePWAInstall()
	const [view, setView] = useState<View>({ id: 0, type: 'landing' })
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [showSourceCode, setShowSourceCode] = useState(false)

	const toggleShowSourceCode = useCallback(() => {
		setShowSourceCode((value) => !value)
	}, [])

	const openDrawer = useCallback(() => {
		setIsDrawerOpen(true)
	}, [])

	const closeDrawer = useCallback(() => {
		setIsDrawerOpen(false)
	}, [])

	const showNotImplemented = useCallback(() => {
		showToast('This is not yet implemented.', 'error')
	}, [showToast])

	const showFilePicker = useCallback(async () => {
		if (!('showOpenFilePicker' in window)) {
			showToast("Your browser doesn't support this feature.", 'error')
			return
		}
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
			closeDrawer()
			setView((view) => ({
				id: view.id + 1,
				type: 'single-file',
				name,
				content,
			}))
		} catch (error) {
			console.error(error)
		}
	}, [closeDrawer, showToast])

	const showDirectoryPicker = useCallback(async () => {
		if (!('showDirectoryPicker' in window)) {
			showToast("Your browser doesn't support this feature.", 'error')
			return
		}
		try {
			const handle = await window.showDirectoryPicker()
			closeDrawer()
			setView((view) => ({ id: view.id + 1, type: 'directory', handle }))
		} catch (error) {
			console.error(error)
		}
	}, [closeDrawer, showToast])

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
						onClick={openDrawer}>
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
			<Drawer open={isDrawerOpen} onClose={closeDrawer}>
				<DrawerHeader>
					<IconButton onClick={closeDrawer}>
						<ChevronLeftIcon />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<Box sx={{ width: 250 }}>
					<List>
						<ListItem disablePadding>
							<ListItemButton onClick={showFilePicker}>
								<ListItemIcon>
									<InsertDriveFileIcon />
								</ListItemIcon>
								<ListItemText primary="Open file" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton onClick={showDirectoryPicker}>
								<ListItemIcon>
									<FolderIcon />
								</ListItemIcon>
								<ListItemText primary="Open folder" />
							</ListItemButton>
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem>
							<ListItemIcon>
								<CodeIcon />
							</ListItemIcon>
							<ListItemText primary="Show source" />
							<Switch
								edge="end"
								onChange={toggleShowSourceCode}
								checked={showSourceCode}
							/>
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem disablePadding>
							<ListItemButton
								LinkComponent={Link}
								href="https://github.com/FilipChalupa/Markdown-viewer#markdown-viewer">
								<ListItemIcon>
									<OpenInNewIcon />
								</ListItemIcon>
								<ListItemText primary="About" />
							</ListItemButton>
						</ListItem>
					</List>
					<Typography align="center" variant="body2" mt={4}>
						Markdown Viewer version: {version}
					</Typography>
				</Box>
			</Drawer>
			<Container key={view.id}>
				<div
					style={{
						textAlign: 'center',
						paddingTop: '4em',
						paddingBottom: '4em',
					}}>
					{view.type === 'landing' ? (
						<>
							<Typography variant="h4" gutterBottom>
								To continue choose one of the following:
							</Typography>
							<Button
								variant="contained"
								endIcon={<InsertDriveFileIcon />}
								onClick={showFilePicker}>
								Open file
							</Button>{' '}
							<Button
								variant="contained"
								endIcon={<FolderIcon />}
								onClick={showDirectoryPicker}>
								Open folder
							</Button>
						</>
					) : view.type === 'single-file' ? (
						<>
							<Path parts={[view.name]} />
							<MarkdownView
								content={view.content}
								onNavigationRequest={showNotImplemented}
								showSourceCode={showSourceCode}
							/>
						</>
					) : view.type === 'directory' ? (
						<DirectoryView
							handle={view.handle}
							showSourceCode={showSourceCode}
						/>
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
				}}>
				<In />
			</SnackbarProvider>
		</Theme>
	)
}
