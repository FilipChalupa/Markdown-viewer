import FolderIcon from '@mui/icons-material/Folder'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
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
import { MarkdownView } from './MarkdownView'
import { Path } from './Path'

export interface DirectoryViewProps {
	handle: FileSystemDirectoryHandle
	showSourceCode?: boolean
	showDirectoryPicker?: () => void
}

export const DirectoryView: FunctionComponent<DirectoryViewProps> = ({
	handle: rootHandle,
	showSourceCode = false,
	showDirectoryPicker,
}) => {
	const root = rootHandle.name + '/'
	const [currentPath, setCurrentPath] = useState(root)
	const [currentHandle, setCurrentHandle] = useState<
		FileSystemFileHandle | FileSystemDirectoryHandle
	>(rootHandle)

	const navigateTo = useCallback(
		(path: string) => {
			scrollTo({
				top: 0,
				left: 0,
			})
			setCurrentPath(pathResolve(currentPath, path))
		},
		[currentPath]
	)

	const currentPathParts = useMemo(() => currentPath.split('/'), [currentPath])

	useEffect(() => {
		;(async () => {
			// @TODO: handle loading state
			const [_, ...parts] = currentPathParts
			let newHandle: FileSystemDirectoryHandle = rootHandle
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
	}, [currentPathParts, rootHandle])

	return (
		<>
			<Path parts={currentPathParts} navigateTo={navigateTo} />
			<Entry
				handle={currentHandle}
				rootHandle={rootHandle}
				currentPath={currentPath}
				navigateTo={navigateTo}
				showSourceCode={showSourceCode}
				showDirectoryPicker={showDirectoryPicker}
			/>
		</>
	)
}

interface EntryProps {
	handle: FileSystemFileHandle | FileSystemDirectoryHandle
	rootHandle: FileSystemDirectoryHandle
	currentPath: string
	navigateTo: (path: string) => void
	showSourceCode: boolean
	showDirectoryPicker: DirectoryViewProps['showDirectoryPicker']
}

const Entry: FunctionComponent<EntryProps> = ({
	handle,
	rootHandle,
	currentPath,
	navigateTo,
	showSourceCode,
	showDirectoryPicker,
}) => {
	if (handle.kind === 'file') {
		return (
			<File
				handle={handle}
				rootHandle={rootHandle}
				currentPath={currentPath}
				navigateTo={navigateTo}
				showSourceCode={showSourceCode}
				showDirectoryPicker={showDirectoryPicker}
			/>
		)
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
	} & Pick<
		EntryProps,
		| 'navigateTo'
		| 'rootHandle'
		| 'currentPath'
		| 'showSourceCode'
		| 'showDirectoryPicker'
	>
> = ({
	handle,
	rootHandle,
	currentPath,
	navigateTo,
	showSourceCode,
	showDirectoryPicker,
}) => {
	const [content, setContent] = useState<null | string>(null)
	useEffect(() => {
		;(async () => {
			const file = await handle.getFile()
			const content = await file.text()
			setContent(content)
		})()
	}, [handle])

	const path = useMemo(
		() => ({
			rootHandle,
			path: currentPath,
		}),
		[currentPath, rootHandle]
	)

	if (content === null) {
		return <>Loading</> // @TODO: show spinner or something
	}
	return (
		<MarkdownView
			content={content}
			path={path}
			onNavigationRequest={(href) => {
				navigateTo(href)
			}}
			showSourceCode={showSourceCode}
			showDirectoryPicker={showDirectoryPicker}
		/>
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
