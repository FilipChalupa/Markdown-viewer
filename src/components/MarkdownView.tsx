import FolderIcon from '@mui/icons-material/Folder'
import { Alert, Button, Paper } from '@mui/material'
import Markdown from 'markdown-to-jsx'
import { FunctionComponent, useEffect, useState } from 'react'
import { pathResolve } from '../utilities/pathResolve'
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

const Link: FunctionComponent<{
	href: string
	onNavigationRequest: MarkdownViewProps['onNavigationRequest']
}> = ({ href, onNavigationRequest, ...otherProps }) => {
	const isRelative = isRelativeLink(href)

	return (
		<a
			href={isRelative ? '' : href}
			onClick={(event) => {
				if (isRelative) {
					// @TODO: check parentHandle that path is accessible
					event.preventDefault()
					onNavigationRequest(href)
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
	const [resolvedSrc, setResolvedSrc] = useState(() => {
		const isRelative = isRelativeLink(src)

		if (isRelative) {
			return undefined
		}
		return src
	})

	useEffect(() => {
		if (isRelativeLink(src)) {
			if (path) {
				;(async () => {
					const relativeSrc = pathResolve(path.path, src)
					const [_, ...parts] = relativeSrc.split('/')
					if (parts.length === 0) {
						throw new Error('Path out of permission scope.')
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
						throw new Error('File not found.')
					})()
					const file = await fileHandle.getFile()
					setResolvedSrc(URL.createObjectURL(file))
				})()
			}
		} else {
			setResolvedSrc(src)
		}
	}, [src, path])

	return <img src={resolvedSrc} {...otherProps} />
}

export const MarkdownView: FunctionComponent<MarkdownViewProps> = ({
	content,
	onNavigationRequest,
	path,
	showSourceCode = false,
	showDirectoryPicker,
}) => {
	return (
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
			{showDirectoryPicker && (
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
						Some links and images may not work due to security reasons. Use{' '}
						<strong>Open folder</strong> to locate a folder containing all the
						required assets.
					</Alert>
				</div>
			)}
		</div>
	)
}
