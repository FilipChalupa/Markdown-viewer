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
			{parts.map((part, i) =>
				part === '' && parts.length - 1 ? (
					<span key="placeholder" />
				) : (
					<Typography
						key={i}
						color={
							i === parts.length - 1 ||
							(i === parts.length - 2 && parts.at(-1) === '')
								? 'text.primary'
								: 'text.secondary'
						}
						className={styles.item}
						component="button"
						onClick={
							navigateTo
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
			)}
		</Breadcrumbs>
	)
}
