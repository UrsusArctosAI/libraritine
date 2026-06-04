use crate::db::Database;
use crate::image_extractor;
use crate::launcher;
use crate::models::{Game, GameMetadata};
use crate::scanner;
use tauri::State as TauriState;

/// State wrapper for the database
pub struct AppState {
    pub db: Database,
    pub data_dir: String,
}

/// Scan a directory for Ren'Py games and add them to the library.
#[tauri::command]
pub fn scan_games(path: String, state: TauriState<'_, AppState>) -> Result<Vec<Game>, String> {
    let games = scanner::scan_directory(&path);

    let data_dir = std::path::Path::new(&state.data_dir);

    // Add newly found games to the database, extract thumbnails
    let mut added = Vec::new();
    for mut game in games {
        // Check if already in DB by folder path
        let existing = state.db.get_all_games().map_err(|e| e.to_string())?;
        if existing.iter().any(|g| g.folder_path == game.folder_path) {
            continue;
        }

        // Try to extract thumbnail
        let game_path = std::path::Path::new(&game.folder_path);
        game.thumbnail_path =
            image_extractor::extract_thumbnail(game_path, data_dir, &game.id);

        if let Err(e) = state.db.upsert_game(&game) {
            log::warn!("Failed to save game {}: {}", game.title, e);
        }
        added.push(game);
    }

    // Return all games after scan
    state.db.get_all_games().map_err(|e| e.to_string())
}

/// Get all games in the library.
#[tauri::command]
pub fn get_all_games(state: TauriState<'_, AppState>) -> Result<Vec<Game>, String> {
    state.db.get_all_games().map_err(|e| e.to_string())
}

/// Get a single game by ID.
#[tauri::command]
pub fn get_game(id: String, state: TauriState<'_, AppState>) -> Result<Option<Game>, String> {
    state.db.get_game(&id).map_err(|e| e.to_string())
}

/// Update metadata for a game.
#[tauri::command]
pub fn update_game_metadata(
    id: String,
    metadata: GameMetadata,
    state: TauriState<'_, AppState>,
) -> Result<Game, String> {
    state
        .db
        .update_metadata(
            &id,
            metadata.blurb.as_deref(),
            metadata.tags.as_deref(),
            metadata.features.as_deref(),
        )
        .map_err(|e| e.to_string())?;

    state.db.get_game(&id).map_err(|e| e.to_string())?.ok_or_else(|| "Game not found".to_string())
}

/// Launch a game by its ID.
#[tauri::command]
pub fn launch_game(id: String, state: TauriState<'_, AppState>) -> Result<(), String> {
    let game = state
        .db
        .get_game(&id)
        .map_err(|e| e.to_string())?
        .ok_or("Game not found")?;

    // Update play stats
    let _ = state.db.update_play_stats(&id);

    launcher::launch_game(&game.folder_path)
}

/// Delete a game from the library.
#[tauri::command]
pub fn delete_game(id: String, state: TauriState<'_, AppState>) -> Result<(), String> {
    state.db.delete_game(&id).map_err(|e| e.to_string())
}

/// Manually add a game by folder path.
#[tauri::command]
pub fn add_game_manual(
    folder_path: String,
    state: TauriState<'_, AppState>,
) -> Result<Game, String> {
    let path = std::path::Path::new(&folder_path);
    if !path.is_dir() {
        return Err(format!("Path is not a directory: {}", folder_path));
    }

    let folder_name = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("Unknown")
        .to_string();

    let mut game = crate::parser::parse_folder_name(&folder_name, path);

    // Extract thumbnail
    let data_dir = std::path::Path::new(&state.data_dir);
    game.thumbnail_path = image_extractor::extract_thumbnail(path, data_dir, &game.id);

    state.db.upsert_game(&game).map_err(|e| e.to_string())?;

    state.db.get_game(&game.id).map_err(|e| e.to_string())?.ok_or_else(|| "Failed to retrieve game after insert".to_string())
}

/// Update game status (not_started, playing, completed, abandoned).
#[tauri::command]
pub fn update_game_status(
    id: String,
    status: String,
    state: TauriState<'_, AppState>,
) -> Result<(), String> {
    let conn = state.db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE games SET status = ?1 WHERE id = ?2",
        rusqlite::params![status, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}
