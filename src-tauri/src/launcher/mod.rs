use std::path::Path;
use std::process::Command;

/// Launch a Ren'Py game by finding and executing its launcher script or executable.
pub fn launch_game(game_path: &str) -> Result<(), String> {
    let path = Path::new(game_path);

    if !path.is_dir() {
        return Err(format!("Game directory not found: {}", game_path));
    }

    // Try to find an executable in the game directory
    if let Some(exe) = find_executable(path) {
        log::info!("Launching game: {:?}", exe);
        Command::new(&exe)
            .current_dir(path)
            .spawn()
            .map_err(|e| format!("Failed to launch {}: {}", exe.display(), e))?;
        return Ok(());
    }

    // Try shell scripts
    if let Some(sh) = find_shell_script(path) {
        log::info!("Launching game via script: {:?}", sh);
        Command::new("sh")
            .arg(&sh)
            .current_dir(path)
            .spawn()
            .map_err(|e| format!("Failed to launch {}: {}", sh.display(), e))?;
        return Ok(());
    }

    Err(format!(
        "No executable or launch script found in {}",
        game_path
    ))
}

/// Find the main executable in a game directory.
fn find_executable(path: &Path) -> Option<std::path::PathBuf> {
    let entries = std::fs::read_dir(path).ok()?;

    // Look for .exe files first (Windows games)
    let mut exe_files: Vec<_> = entries
        .flatten()
        .filter(|e| {
            let name = e.file_name().to_string_lossy().to_lowercase();
            name.ends_with(".exe") && !name.contains("uninstall") && !name.contains("setup")
        })
        .collect();

    // Sort by modification time (newest first) — likely the main game
    exe_files.sort_by(|a, b| {
        b.metadata()
            .and_then(|m| m.modified())
            .unwrap_or(std::time::SystemTime::UNIX_EPOCH)
            .cmp(
                &a.metadata()
                    .and_then(|m| m.modified())
                    .unwrap_or(std::time::SystemTime::UNIX_EPOCH),
            )
    });

    exe_files.into_iter().next().map(|e| e.path())
}

/// Find a shell script for launching on macOS/Linux.
fn find_shell_script(path: &Path) -> Option<std::path::PathBuf> {
    let entries = std::fs::read_dir(path).ok()?;

    // Common launch script names
    let launch_names = ["start.sh", "launch.sh", "run.sh", "game.sh"];

    for name in &launch_names {
        let script = path.join(name);
        if script.is_file() {
            return Some(script);
        }
    }

    // Fallback: any .sh file
    let sh_files: Vec<_> = entries
        .flatten()
        .filter(|e| {
            let name = e.file_name().to_string_lossy().to_lowercase();
            name.ends_with(".sh")
        })
        .collect();

    sh_files.into_iter().next().map(|e| e.path())
}
