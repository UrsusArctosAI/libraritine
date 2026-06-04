use crate::models::Game;
use crate::parser;
use std::fs;
use std::path::Path;

/// Scan a directory for Ren'Py game folders.
/// Returns a list of parsed Game entries.
pub fn scan_directory(dir_path: &str) -> Vec<Game> {
    let root = Path::new(dir_path);
    if !root.is_dir() {
        log::warn!("Scan path is not a directory: {}", dir_path);
        return Vec::new();
    }

    let mut games = Vec::new();

    // Walk one level deep (direct subdirectories)
    for entry in fs::read_dir(root).into_iter().flatten() {
        let entry = match entry {
            Ok(e) => e,
            Err(e) => {
                log::warn!("Failed to read dir entry: {}", e);
                continue;
            }
        };

        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        // Skip hidden directories and our own data directory
        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
            if name.starts_with('.') || name == ".libraritine" {
                continue;
            }
        }

        // Check if this looks like a Ren'Py game
        if is_renpy_game(&path) {
            let folder_name = path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("Unknown")
                .to_string();

            let game = parser::parse_folder_name(&folder_name, &path);
            games.push(game);
        }
    }

    // Sort by title
    games.sort_by(|a, b| a.title.cmp(&b.title));

    log::info!("Scanned {} games from {}", games.len(), dir_path);
    games
}

/// Detect if a directory is a Ren'Py game by looking for characteristic files.
fn is_renpy_game(path: &Path) -> bool {
    // Check for common Ren'Py indicators
    let indicators = [
        "renpy",                                          // renpy/ directory
        "game",                                           // game/ directory
    ];

    for indicator in &indicators {
        if path.join(indicator).is_dir() {
            return true;
        }
    }

    // Check for executables with common Ren'Py patterns
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let name = entry.file_name();
            let name_str = name.to_string_lossy().to_lowercase();

            // Common Ren'Py executable patterns
            if name_str.ends_with(".exe")
                || name_str.ends_with(".sh")
                || name_str.contains("launch")
                || name_str.contains("renpy")
            {
                return true;
            }
        }
    }

    // Check for .rpyc files in game/ subdirectory
    if let Ok(entries) = fs::read_dir(path.join("game")) {
        for entry in entries.flatten() {
            let name = entry.file_name();
            let name_str = name.to_string_lossy().to_lowercase();
            if name_str.ends_with(".rpyc") || name_str == "script.rpy" {
                return true;
            }
        }
    }

    false
}
