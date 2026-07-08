import 'common'
import './groups'
import './prison'
import './medical'
import './cuffs'
import './escort'
import './interactions'
import './hotel'
import './roster'
import { oxmysql } from '@overextended/oxmysql'

setImmediate(async () => {
	const res = await oxmysql.query(`
		CREATE TABLE IF NOT EXISTS lenix (
			charId INT UNSIGNED NOT NULL PRIMARY KEY,
			jail_period INT NOT NULL DEFAULT 0,
			hotel_room INT NOT NULL DEFAULT 0,
			callsign VARCHAR(6) NOT NULL DEFAULT 'unset',
			FOREIGN KEY (charId)
				REFERENCES characters(charId)
				ON DELETE CASCADE
		)
	`)
	if (!res) throw new Error("Failed to query 'lenix'")
})
