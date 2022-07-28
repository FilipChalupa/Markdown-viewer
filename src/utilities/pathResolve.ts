export const pathResolve = (oldPath: string, newPath: string) => {
	if (newPath.startsWith('/')) {
		return newPath.substring(1)
	}
	const oldPathParts = oldPath.split('/')
	const combinedPath =
		(oldPath.endsWith('/')
			? oldPath
			: oldPathParts.splice(0, oldPathParts.length - 1).join('/') + '/') +
		newPath
	return combinedPath
		.split('/')
		.reduce<string[]>((a, v) => {
			if (v === '.') {
			} else if (v === '..') {
				a.pop()
			} else {
				a.push(v)
			}
			return a
		}, [])
		.join('/')
}

// @TODO: don't allow '/root/../root/file.md'
