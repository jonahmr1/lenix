import { checkDependency } from '@overextended/ox_lib'
import { oxmysql } from '@overextended/oxmysql'
import { MAX_CALLSIGN_LENGTH } from 'common/config'

checkDependency('oxmysql', '2.14.1', true)
checkDependency('ox_lib', '3.39.0', true)

setImmediate(async () => {
	const table = await oxmysql.query(`
		CREATE TABLE IF NOT EXISTS lenix (
			charId INT UNSIGNED NOT NULL PRIMARY KEY,
			jail_period INT NOT NULL DEFAULT 0,
			hotel_room INT NOT NULL DEFAULT 0,
			callsign VARCHAR(${MAX_CALLSIGN_LENGTH}) DEFAULT NULL UNIQUE,
			FOREIGN KEY (charId)
				REFERENCES characters(charId)
				ON DELETE CASCADE
		)
	`)
	if (!table) throw new Error("Failed to query 'lenix'")

	const trigger = await oxmysql.query(`
		CREATE TRIGGER IF NOT EXISTS lenix_new_char AFTER INSERT ON characters
		FOR EACH ROW
		BEGIN
			INSERT INTO lenix (charId)
			VALUES (NEW.charId);
		END
	`)
	if (!trigger) throw new Error("Failed to create trigger 'lenix_new_char'")
})
