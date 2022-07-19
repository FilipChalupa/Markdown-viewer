import { Paper } from '@mui/material'
import Markdown from 'markdown-to-jsx'
import type { FunctionComponent } from 'react'
import styles from './MarkdownView.module.css'

export interface MarkdownViewProps {
	content: string
	onNavigationRequest: (href: string) => void
}

const Link: FunctionComponent<{
	href: string
	onNavigationRequest: MarkdownViewProps['onNavigationRequest']
}> = ({ href, onNavigationRequest, ...otherProps }) => {
	return (
		<a
			href=""
			onClick={(event) => {
				event.preventDefault()
				onNavigationRequest(href)
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
		<Paper elevation={12}>
			<div className={styles.wrapper}>
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
	)
}
