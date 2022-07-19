import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { OptionsObject, SnackbarKey, useSnackbar } from 'notistack'
import { useCallback } from 'react'

export const useToast = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	const action = useCallback(
		(id: SnackbarKey) => (
			<IconButton
				aria-label="close"
				color="inherit"
				sx={{ p: 0.5 }}
				onClick={() => closeSnackbar(id)}
			>
				<CloseIcon />
			</IconButton>
		),
		[closeSnackbar],
	)

	const showToast = useCallback(
		(message: string, variant: OptionsObject['variant']) => {
			enqueueSnackbar(message, {
				variant,
				action,
			})
		},
		[enqueueSnackbar],
	)

	return showToast
}
