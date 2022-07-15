import Markdown from 'markdown-to-jsx'
import type { FunctionComponent } from 'react'

export interface MarkdownViewProps {
	content: string
}

export const MarkdownView: FunctionComponent<MarkdownViewProps> = ({
	content,
}) => {
	return (
		<>
			<Markdown>{content}</Markdown>
		</>
	)
}
