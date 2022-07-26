import { FunctionComponent, useMemo } from 'react'
import styles from './Code.module.css'

export interface CodeProps {
	content: string
}

export const Code: FunctionComponent<CodeProps> = ({ content }) => {
	const lines = useMemo(() => content.split('\n'), [content])

	return (
		<div className={styles.wrapper}>
			{lines.map((line, i) => (
				<div className={styles.line} key={i}>
					<pre className={styles.code}>{line}</pre>
				</div>
			))}
		</div>
	)
}
