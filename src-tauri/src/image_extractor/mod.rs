use std::fs;
use std::path::Path;

/// Extract a thumbnail from a Ren'Py game folder.
/// Looks for title screen / splash art in common locations.
/// Returns the path to the extracted/copied thumbnail.
pub fn extract_thumbnail(
    game_path: &Path,
    data_dir: &Path,
    game_id: &str,
) -> Option<String> {
    let game_dir = game_path.join("game");
    if !game_dir.is_dir() {
        // Some games have images directly in the root
        return find_image_in_dir(game_path, data_dir, game_id);
    }

    // Priority order for finding splash/title images
    let candidates = [
        // Common splash locations
        "splash.png",
        "splash.jpg",
        "gui/splash.png",
        "title.png",
        "title.jpg",
        "title_screen.png",
        "title_screen.jpg",
        // Background/title in images dir
        "images/splash.png",
        "images/title.png",
        "images/bg.png",
        "images/background.png",
    ];

    for candidate in &candidates {
        let img_path = game_dir.join(candidate);
        if img_path.is_file() {
            return copy_thumbnail(&img_path, data_dir, game_id);
        }
    }

    // Fallback: look for any PNG/JPG in game/ root
    find_image_in_dir(&game_dir, data_dir, game_id)
}

/// Find the first image file in a directory.
fn find_image_in_dir(dir: &Path, data_dir: &Path, game_id: &str) -> Option<String> {
    let image_extensions = ["png", "jpg", "jpeg", "webp"];

    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let name = entry.file_name();
            let name_str = name.to_string_lossy().to_lowercase();

            for ext in &image_extensions {
                if name_str.ends_with(&format!(".{}", ext)) {
                    return copy_thumbnail(&entry.path(), data_dir, game_id);
                }
            }
        }
    }

    None
}

/// Copy an image to the data directory as the game's thumbnail.
fn copy_thumbnail(source: &Path, data_dir: &Path, game_id: &str) -> Option<String> {
    let thumb_dir = data_dir.join("thumbnails");
    fs::create_dir_all(&thumb_dir).ok()?;

    let ext = source
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("png");
    let dest = thumb_dir.join(format!("{}.{}", game_id, ext));

    fs::copy(source, &dest).ok()?;

    Some(dest.to_string_lossy().to_string())
}
