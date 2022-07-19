import FolderIcon from '@mui/icons-material/Folder'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import {
	Breadcrumbs,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material'
import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { assertNever } from '../utilities/assertNever'
import { pathResolve } from '../utilities/pathResolve'
import styles from './DirectoryView.module.css'
import { MarkdownView } from './MarkdownView'

export interface DirectoryViewProps {
	handle: FileSystemDirectoryHandle
}

export const DirectoryView: FunctionComponent<DirectoryViewProps> = ({
	handle,
}) => {
	const root = handle.name + '/'
	const [currentPath, setCurrentPath] = useState(root)
	const [currentHandle, setCurrentHandle] = useState<
		FileSystemFileHandle | FileSystemDirectoryHandle
	>(handle)

	const navigateTo = useCallback(
		(path: string) => {
			setCurrentPath(pathResolve(currentPath, path))
		},
		[currentPath]
	)

	const currentPathParts = useMemo(() => currentPath.split('/'), [currentPath])

	useEffect(() => {
		;(async () => {
			// @TODO: handle loading state
			const [_, ...parts] = currentPathParts
			let newHandle: FileSystemDirectoryHandle = handle
			while (parts.length > 0) {
				const part = parts.shift()
				if (part === '' || part === undefined) {
					break
				}
				if (part !== '' && parts.length === 0) {
					setCurrentHandle(await newHandle.getFileHandle(part))
					return
				} else {
					newHandle = await newHandle.getDirectoryHandle(part)
				}
			}
			setCurrentHandle(newHandle)
		})()
	}, [currentPathParts, handle])

	return (
		<>
			<Breadcrumbs>
				{currentPathParts.map((part, i) =>
					part === '' ? (
						<span key="placeholder" />
					) : (
						<Typography
							key={i}
							color={
								i === currentPathParts.length - 1 ||
								(i === currentPathParts.length - 2 &&
									currentPathParts.at(-1) === '')
									? 'text.primary'
									: 'text.secondary'
							}
							className={styles.breadcrumb}
							component="button"
							onClick={() => {
								navigateTo(
									'/' +
										currentPathParts.slice(0, i + 1).join('/') +
										(currentHandle.kind === 'directory' ||
										i < currentPathParts.length - 1
											? '/'
											: '')
								)
							}}>
							{part}
						</Typography>
					)
				)}
			</Breadcrumbs>
			<Entry handle={currentHandle} navigateTo={navigateTo} />
		</>
	)
}

interface EntryProps {
	handle: FileSystemFileHandle | FileSystemDirectoryHandle
	navigateTo: (path: string) => void
}

const Entry: FunctionComponent<EntryProps> = ({ handle, navigateTo }) => {
	if (handle.kind === 'file') {
		return <File handle={handle} navigateTo={navigateTo} />
	} else if (handle.kind === 'directory') {
		return <Directory handle={handle} navigateTo={navigateTo} />
	} else {
		assertNever(handle)
	}
	return null
}

const File: FunctionComponent<
	{
		handle: FileSystemFileHandle
	} & Pick<EntryProps, 'navigateTo'>
> = ({ handle, navigateTo }) => {
	const [content, setContent] = useState<null | string>(null)
	useEffect(() => {
		;(async () => {
			const file = await handle.getFile()
			const content = await file.text()
			setContent(content)
		})()
	}, [handle])

	if (content === null) {
		return <>Loading</> // @TODO: show spinner or something
	}
	return (
		<div className={styles.file}>
			<MarkdownView
				content={content}
				onNavigationRequest={(href) => {
					navigateTo(href)
				}}
			/>
		</div>
	)
}

const Directory: FunctionComponent<
	{
		handle: FileSystemDirectoryHandle
	} & Pick<EntryProps, 'navigateTo'>
> = ({ handle, navigateTo }) => {
	const [filesAndDirectories, setFilesAndDirectories] = useState<
		null | FileSystemHandle[]
	>(null)
	useEffect(() => {
		;(async () => {
			let entries: FileSystemHandle[] = []
			for await (const entry of handle.values()) {
				entries.push(entry)
			}
			entries = entries.filter(
				(item) => item.kind === 'directory' || item.name.endsWith('.md')
			)
			entries.sort((a, b) => {
				if (a.kind === b.kind) {
					return a.name.localeCompare(b.name)
				}
				if (a.kind === 'file') {
					return -1
				}
				return 1
			})
			setFilesAndDirectories(entries)
		})()
	}, [handle])

	return (
		<List>
			{filesAndDirectories === null ? (
				<ListItem disableGutters>
					<ListItemButton disabled>
						<ListItemIcon>
							<HourglassEmptyIcon />
						</ListItemIcon>
						<ListItemText primary="Loading" />
					</ListItemButton>
				</ListItem>
			) : (
				filesAndDirectories.map((item) => (
					<ListItem key={item.name} disableGutters>
						<ListItemButton
							onClick={() =>
								navigateTo(item.kind === 'file' ? item.name : item.name + '/')
							}>
							<ListItemIcon>
								{item.kind === 'file' ? (
									<InsertDriveFileIcon />
								) : (
									<FolderIcon />
								)}
							</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</ListItem>
				))
			)}
		</List>
	)
}
