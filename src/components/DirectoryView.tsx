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
}

export const DirectoryView: FunctionComponent<DirectoryViewProps> = ({
	handle,
}) => {
	const root = handle.name + '/'
	const [currentPath, setCurrentPath] = useState(root)
	const [parentHandle, setParentHandle] =
		useState<FileSystemDirectoryHandle>(handle)
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
					setParentHandle(newHandle)
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
			<Path parts={currentPathParts} navigateTo={navigateTo} />
			<Entry
				handle={currentHandle}
				parentHandle={parentHandle}
				navigateTo={navigateTo}
			/>
		</>
	)
}

interface EntryProps {
	handle: FileSystemFileHandle | FileSystemDirectoryHandle
	parentHandle: FileSystemDirectoryHandle
	navigateTo: (path: string) => void
}

const Entry: FunctionComponent<EntryProps> = ({
	handle,
	parentHandle,
	navigateTo,
}) => {
	if (handle.kind === 'file') {
		return (
			<File
				handle={handle}
				parentHandle={parentHandle}
				navigateTo={navigateTo}
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
	} & Pick<EntryProps, 'navigateTo' | 'parentHandle'>
> = ({ handle, parentHandle, navigateTo }) => {
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
		<MarkdownView
			content={content}
			parentHandle={parentHandle}
			onNavigationRequest={(href) => {
				navigateTo(href)
			}}
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
