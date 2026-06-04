use rusqlite::{params, Connection, Result as SqlResult};
use std::sync::Mutex;
use crate::models::Game;

pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> SqlResult<Self> {
        let conn = Connection::open(db_path)?;
        let db = Self {
            conn: Mutex::new(conn),
        };
        db.init_schema()?;
        Ok(db)
    }

    fn init_schema(&self) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS games (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                raw_folder TEXT NOT NULL,
                folder_path TEXT NOT NULL UNIQUE,
                version TEXT,
                sort_version TEXT,
                stage TEXT,
                platform TEXT,
                blurb TEXT DEFAULT '',
                tags TEXT DEFAULT '[]',
                features TEXT DEFAULT '[]',
                thumbnail_path TEXT,
                date_added TEXT NOT NULL,
                last_played TEXT,
                play_count INTEGER DEFAULT 0,
                status TEXT DEFAULT 'not_started'
            );

            CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
            CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
            ",
        )?;
        Ok(())
    }

    pub fn get_all_games(&self) -> SqlResult<Vec<Game>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, title, raw_folder, folder_path, version, sort_version, stage, platform,
                    blurb, tags, features, thumbnail_path, date_added, last_played, play_count, status
             FROM games ORDER BY title ASC",
        )?;

        let games = stmt
            .query_map([], |row| {
                let tags_json: String = row.get(9)?;
                let features_json: String = row.get(10)?;
                let sort_version_json: Option<String> = row.get(5)?;

                Ok(Game {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    raw_folder: row.get(2)?,
                    folder_path: row.get(3)?,
                    version: row.get(4)?,
                    sort_version: sort_version_json
                        .and_then(|s| serde_json::from_str(&s).ok()),
                    stage: row.get(6)?,
                    platform: row.get(7)?,
                    blurb: row.get(8)?,
                    tags: serde_json::from_str(&tags_json).unwrap_or_default(),
                    features: serde_json::from_str(&features_json).unwrap_or_default(),
                    thumbnail_path: row.get(11)?,
                    date_added: row.get(12)?,
                    last_played: row.get(13)?,
                    play_count: row.get(14)?,
                    status: row.get(15)?,
                })
            })?
            .collect::<SqlResult<Vec<_>>>()?;

        Ok(games)
    }

    pub fn get_game(&self, id: &str) -> SqlResult<Option<Game>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, title, raw_folder, folder_path, version, sort_version, stage, platform,
                    blurb, tags, features, thumbnail_path, date_added, last_played, play_count, status
             FROM games WHERE id = ?1",
        )?;

        let mut games = stmt.query_map(params![id], |row| {
            let tags_json: String = row.get(9)?;
            let features_json: String = row.get(10)?;
            let sort_version_json: Option<String> = row.get(5)?;

            Ok(Game {
                id: row.get(0)?,
                title: row.get(1)?,
                raw_folder: row.get(2)?,
                folder_path: row.get(3)?,
                version: row.get(4)?,
                sort_version: sort_version_json.and_then(|s| serde_json::from_str(&s).ok()),
                stage: row.get(6)?,
                platform: row.get(7)?,
                blurb: row.get(8)?,
                tags: serde_json::from_str(&tags_json).unwrap_or_default(),
                features: serde_json::from_str(&features_json).unwrap_or_default(),
                thumbnail_path: row.get(11)?,
                date_added: row.get(12)?,
                last_played: row.get(13)?,
                play_count: row.get(14)?,
                status: row.get(15)?,
            })
        })?;

        match games.next() {
            Some(Ok(game)) => Ok(Some(game)),
            Some(Err(e)) => Err(e),
            None => Ok(None),
        }
    }

    pub fn upsert_game(&self, game: &Game) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO games
                (id, title, raw_folder, folder_path, version, sort_version, stage, platform,
                 blurb, tags, features, thumbnail_path, date_added, last_played, play_count, status)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)",
            params![
                game.id,
                game.title,
                game.raw_folder,
                game.folder_path,
                game.version,
                game.sort_version.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()),
                game.stage,
                game.platform,
                game.blurb,
                serde_json::to_string(&game.tags).unwrap_or_default(),
                serde_json::to_string(&game.features).unwrap_or_default(),
                game.thumbnail_path,
                game.date_added,
                game.last_played,
                game.play_count,
                game.status,
            ],
        )?;
        Ok(())
    }

    pub fn delete_game(&self, id: &str) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM games WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn update_play_stats(&self, id: &str) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "UPDATE games SET play_count = play_count + 1, last_played = ?1 WHERE id = ?2",
            params![now, id],
        )?;
        Ok(())
    }

    pub fn update_metadata(
        &self,
        id: &str,
        blurb: Option<&str>,
        tags: Option<&[String]>,
        features: Option<&[String]>,
    ) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();

        if let Some(b) = blurb {
            conn.execute(
                "UPDATE games SET blurb = ?1 WHERE id = ?2",
                params![b, id],
            )?;
        }
        if let Some(t) = tags {
            let json = serde_json::to_string(t).unwrap_or_default();
            conn.execute(
                "UPDATE games SET tags = ?1 WHERE id = ?2",
                params![json, id],
            )?;
        }
        if let Some(f) = features {
            let json = serde_json::to_string(f).unwrap_or_default();
            conn.execute(
                "UPDATE games SET features = ?1 WHERE id = ?2",
                params![json, id],
            )?;
        }

        Ok(())
    }
}
