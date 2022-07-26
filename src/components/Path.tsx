import { Breadcrumbs, Typography } from '@mui/material'
import { FunctionComponent } from 'react'
import styles from './Path.module.css'

export interface PathProps {
	parts: string[]
	navigateTo?: (path: string) => void
}

export const Path: FunctionComponent<PathProps> = ({ parts, navigateTo }) => {
	return (
		<Breadcrumbs>
			{parts.map((part, i) => {
				if (part === '' && i === parts.length - 1) {
					return <span key="placeholder" />
				}
				const isLast =
					i === parts.length - 1 ||
					(i === parts.length - 2 && parts[i + 1] === '')
				return (
					<Typography
						key={i}
						color={isLast ? 'text.primary' : 'text.secondary'}
						className={styles.item}
						component={isLast ? 'span' : 'button'}
						onClick={
							!isLast && navigateTo
								? () => {
										navigateTo(
											'/' +
												parts.slice(0, i + 1).join('/') +
												(i < parts.length - 1 ? '/' : '')
										)
								  }
								: undefined
						}>
						{part}
					</Typography>
				)
			})}
		</Breadcrumbs>
	)
}
