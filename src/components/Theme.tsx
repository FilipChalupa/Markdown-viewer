import {
	createTheme,
	CssBaseline,
	ThemeProvider,
	useMediaQuery,
} from '@mui/material'
import { FunctionComponent, ReactNode, useMemo } from 'react'

export const Theme: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? 'dark' : 'light',
				},
			}),
		[prefersDarkMode],
	)

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			{children}
		</ThemeProvider>
	)
}
