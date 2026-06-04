// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod image_extractor;
mod launcher;
mod models;
mod parser;
mod scanner;

use commands::AppState;
use std::fs;
use std::sync::Arc;
use tauri::Manager;

fn main() {
    env_logger::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Determine portable data directory
            let data_dir = {
                let app_dir = app
                    .path()
                    .app_data_dir()
                    .expect("Failed to get app data dir");
                fs::create_dir_all(&app_dir).expect("Failed to create data directory");
                app_dir
                    .to_string_lossy()
                    .to_string()
            };

            let db_path = format!("{}/libraritine.db", data_dir);
            let database = db::Database::new(&db_path).expect("Failed to initialize database");

            let state = AppState {
                db: database,
                data_dir,
            };

            app.manage(Arc::new(state));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::scan_games,
            commands::get_all_games,
            commands::get_game,
            commands::update_game_metadata,
            commands::launch_game,
            commands::delete_game,
            commands::add_game_manual,
            commands::update_game_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
