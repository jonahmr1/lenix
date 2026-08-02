import { useEffect, useState, type ReactNode } from 'react'
import { fetchAppData } from './data'
import type { DataContextValue } from '../types'
import { DataContext } from '@/hooks/use-appdata'

export const DataProvider = ({ children }: { children: ReactNode }) => {
	const [value, setValue] = useState<DataContextValue>({ status: 'loading' })

	useEffect(() => {
		fetchAppData()
			.then(data => {
				setValue({ status: 'ok', data })
			})
			.catch((err: unknown) => {
				setValue({ status: 'error', error: String(err) })
			})
	}, [])

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
