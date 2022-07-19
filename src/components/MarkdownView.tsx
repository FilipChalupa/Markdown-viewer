import { Paper } from '@mui/material'
import Markdown from 'markdown-to-jsx'
import type { FunctionComponent } from 'react'
import styles from './MarkdownView.module.css'

export interface MarkdownViewProps {
	content: string
	onNavigationRequest: (href: string) => void
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
					event.preventDefault()
					onNavigationRequest(href)
				}
			}}
			{...otherProps}
		/>
	)
}

export const MarkdownView: FunctionComponent<MarkdownViewProps> = ({
	content,
	onNavigationRequest,
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
							},
						}}>
						{content}
					</Markdown>
				</div>
			</Paper>
		</div>
	)
}
