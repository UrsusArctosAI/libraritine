use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Game {
    pub id: String,
    pub title: String,
    pub raw_folder: String,
    pub folder_path: String,
    pub version: Option<String>,
    pub sort_version: Option<Vec<i64>>,
    pub stage: Option<String>,
    pub platform: Option<String>,
    pub blurb: String,
    pub tags: Vec<String>,
    pub features: Vec<String>,
    pub thumbnail_path: Option<String>,
    pub date_added: String,
    pub last_played: Option<String>,
    pub play_count: i64,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameMetadata {
    pub blurb: Option<String>,
    pub tags: Option<Vec<String>>,
    pub features: Option<Vec<String>>,
}
