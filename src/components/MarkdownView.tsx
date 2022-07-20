import { Paper } from '@mui/material'
import Markdown from 'markdown-to-jsx'
import { FunctionComponent, useEffect, useState } from 'react'
import { pathResolve } from '../utilities/pathResolve'
import styles from './MarkdownView.module.css'

export interface MarkdownViewProps {
	content: string
	onNavigationRequest: (href: string) => void
	parentHandle?: FileSystemDirectoryHandle
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
	parentHandle: MarkdownViewProps['parentHandle']
}> = ({ src, parentHandle, ...otherProps }) => {
	const [resolvedSrc, setResolvedSrc] = useState(() => {
		const isRelative = isRelativeLink(src)

		if (isRelative) {
			return undefined
		}
		return src
	})

	useEffect(() => {
		if (isRelativeLink(src)) {
			if (parentHandle) {
				;(async () => {
					const path = pathResolve('.', src)
					console.log('find', { path, src })
					// @TODO use similar code to useEffect in DirectoryView
				})()
			}
		} else {
			setResolvedSrc(src)
		}
	}, [src, parentHandle])

	return <img src={resolvedSrc} {...otherProps} />
}

export const MarkdownView: FunctionComponent<MarkdownViewProps> = ({
	content,
	onNavigationRequest,
	parentHandle,
}) => {
	return (
		<div className={styles.wrapper}>
			<Paper elevation={12}>
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
										parentHandle,
									},
								},
							},
						}}>
						{content}
					</Markdown>
				</div>
			</Paper>
		</div>
	)
}
