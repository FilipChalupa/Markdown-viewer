import type { FunctionComponent } from 'react'

export interface DirectoryViewProps {
	handle: FileSystemDirectoryHandle
}

export const DirectoryView: FunctionComponent<DirectoryViewProps> = ({
	handle,
}) => {
	return <div>@TODO: dir view</div>
}
