import FolderIcon from '@mui/icons-material/Folder'
import { Alert, Button, Paper } from '@mui/material'
import Markdown from 'markdown-to-jsx'
import {
	createContext,
	Fragment,
	FunctionComponent,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { pathResolve } from '../utilities/pathResolve'
import { useToast } from '../utilities/useToast'
import { Code } from './Code'
import styles from './MarkdownView.module.css'

export interface MarkdownViewProps {
	content: string
	onNavigationRequest: (href: string) => void
	parentHandle?: FileSystemDirectoryHandle // @TODO: remove
	path?: {
		rootHandle: FileSystemDirectoryHandle
		path: string
	}
	showSourceCode?: boolean
	showDirectoryPicker?: () => void
}

const isRelativeLink = (href: string) => {
	return !href.startsWith('http://') && !href.startsWith('https://')
}

const getFileHandle = async (path: MarkdownViewProps['path'], src: string) => {
	if (!path) {
		return null
	}
	const relativeSrc = pathResolve(path.path, src)
	const [root, ...parts] = relativeSrc.split('/')
	if (root !== path.rootHandle.name) {
		return null
	}
	const fileHandle = await (async () => {
		let handle: FileSystemDirectoryHandle = path.rootHandle
		while (parts.length > 0) {
			const part = parts.shift()
			if (part === undefined) {
				break
			}
			if (parts.length === 0) {
				return await handle.getFileHandle(part)
			} else {
				handle = await handle.getDirectoryHandle(part)
			}
		}
		return null
	})()
	return fileHandle
}

const Link: FunctionComponent<{
	href: string
	path: MarkdownViewProps['path']
	onNavigationRequest: MarkdownViewProps['onNavigationRequest']
}> = ({ href, onNavigationRequest, path, ...otherProps }) => {
	const isRelative = isRelativeLink(href)
	const { setBrokenLink } = useContext(SecurityNoteContext)
	const [isValidLink, setIsValidLink] = useState(() => !isRelative)
	const showToast = useToast()

	useEffect(() => {
		if (isRelative) {
			;(async () => {
				const fileHandle = await getFileHandle(path, href)
				if (fileHandle) {
					setIsValidLink(true)
				} else {
					setBrokenLink()
				}
			})()
		}
	}, [href, isRelative, path, setBrokenLink])

	return (
		<a
			href={isRelative ? '' : href}
			onClick={(event) => {
				if (isRelative) {
					event.preventDefault()
					if (isValidLink) {
						onNavigationRequest(href)
					} else {
						showToast('This link links to an unreachable file.', 'error')
					}
				}
			}}
			{...otherProps}
		/>
	)
}

const Picture: FunctionComponent<{
	src: string
	path: MarkdownViewProps['path']
}> = ({ src, path, ...otherProps }) => {
	const { setBrokenImage } = useContext(SecurityNoteContext)
	const [resolvedSrc, setResolvedSrc] = useState(() => {
		const isRelative = isRelativeLink(src)

		if (isRelative) {
			return undefined
		}
		return src
	})

	useEffect(() => {
		if (isRelativeLink(src)) {
			;(async () => {
				const fileHandle = await getFileHandle(path, src)
				if (fileHandle) {
					const file = await fileHandle.getFile()
					setResolvedSrc(URL.createObjectURL(file))
				} else {
					setBrokenImage()
				}
			})()
		} else {
			setResolvedSrc(src)
		}
	}, [src, path, setBrokenImage])

	return <img src={resolvedSrc} {...otherProps} />
}

const SecurityNoteContext = createContext({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setBrokenImage: () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setBrokenLink: () => {},
})

export const MarkdownView: FunctionComponent<MarkdownViewProps> = ({
	content,
	onNavigationRequest,
	path,
	showSourceCode = false,
	showDirectoryPicker,
}) => {
	const [isBrokenImage, setIsBrokenImage] = useState(false)
	const [isBrokenLink, setIsBrokenLink] = useState(false)
	const setBrokenImage = useCallback(() => {
		console.log('broken image')
		setIsBrokenImage(true)
	}, [])
	const setBrokenLink = useCallback(() => {
		console.log('broken link')
		setIsBrokenLink(true)
	}, [])
	const contextValue = useMemo(
		() => ({ setBrokenImage, setBrokenLink }),
		[setBrokenImage, setBrokenLink]
	)

	const brokenElements = useMemo(() => {
		const elements: string[] = []
		if (isBrokenImage) {
			elements.push('images')
		}
		if (isBrokenLink) {
			elements.push('links')
		}
		if (elements.length > 0) {
			const formatter = new Intl.ListFormat('en', {
				style: 'long',
				type: 'conjunction',
			})
			return formatter.formatToParts(elements)
		}
		return []
	}, [isBrokenImage, isBrokenLink])

	return (
		<SecurityNoteContext.Provider value={contextValue}>
			<div className={styles.wrapper}>
				{showSourceCode && (
					<div className={styles.item}>
						<Paper elevation={12} className={styles.item_in}>
							<div className={styles.item_content}>
								<div className={styles.code}>
									<Code content={content} />
								</div>
							</div>
						</Paper>
					</div>
				)}
				<div className={styles.item}>
					<Paper elevation={12} className={styles.item_in}>
						<div className={styles.item_content}>
							<div className={styles.content}>
								<Markdown
									options={{
										overrides: {
											a: {
												component: Link,
												props: {
													onNavigationRequest,
													path,
												},
											},
											img: {
												component: Picture,
												props: {
													path,
												},
											},
										},
									}}>
									{content}
								</Markdown>
							</div>
						</div>
					</Paper>
				</div>
				{showDirectoryPicker && brokenElements.length > 0 && (
					<div className={styles.supportNote}>
						<Alert
							severity="warning"
							action={
								<Button
									color="warning"
									variant="contained"
									size="small"
									style={{ whiteSpace: 'nowrap' }}
									onClick={showDirectoryPicker}
									endIcon={<FolderIcon />}>
									Open folder
								</Button>
							}>
							Some{' '}
							{brokenElements.map(({ type, value }, i) =>
								type === 'element' ? (
									<strong key={i}>{value}</strong>
								) : (
									<Fragment key={i}>{value}</Fragment>
								)
							)}{' '}
							may not work due to security reasons. Use{' '}
							<strong>Open folder</strong> to locate a folder containing all the
							required assets.
						</Alert>
					</div>
				)}
			</div>
		</SecurityNoteContext.Provider>
	)
}
