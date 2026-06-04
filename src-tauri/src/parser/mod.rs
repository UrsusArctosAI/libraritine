use crate::models::Game;
use std::path::Path;
use uuid::Uuid;

/// Known platform suffixes (order matters — longest first)
const PLATFORMS: &[&str] = &["win-linux", "win", "pc", "market"];

/// Compound version prefixes that combine with the next segment
/// e.g., "Ep-7c", "Chapter4", "day19-20"
const VERSION_PREFIXES: &[&str] = &[
    "ep", "episode", "part", "act", "chapter", "day", "level", "route",
];

/// Stage/development tags (input_pattern, normalized_output)
const STAGE_TAGS: &[(&str, &str)] = &[
    ("WIP", "wip"),
    ("BETA", "beta"),
    ("PROLOGUE", "prologue"),
    ("ALPHA", "alpha"),
    ("DEMO", "demo"),
    ("PREVIEW", "preview"),
    ("RC", "rc"),
];

/// Parse a Ren'Py game folder name into structured metadata.
pub fn parse_folder_name(folder_name: &str, folder_path: &Path) -> Game {
    let raw_folder = folder_name.to_string();
    let mut remaining = folder_name;

    // Step 1: Extract platform suffix
    let platform = extract_platform(&mut remaining);

    // Step 2: Extract version, stage, and episode info
    let (version, sort_version, stage) = extract_version_info(&mut remaining);

    // Step 3: Clean up the title
    let title = clean_title(remaining);

    let id = Uuid::new_v4().to_string();
    let date_added = chrono::Utc::now().to_rfc3339();

    Game {
        id,
        title,
        raw_folder,
        folder_path: folder_path.to_string_lossy().to_string(),
        version,
        sort_version,
        stage,
        platform,
        blurb: String::new(),
        tags: Vec::new(),
        features: Vec::new(),
        thumbnail_path: None,
        date_added,
        last_played: None,
        play_count: 0,
        status: "not_started".to_string(),
    }
}

/// Extract platform from the end of the string.
fn extract_platform(remaining: &mut &str) -> Option<String> {
    for platform in PLATFORMS {
        let suffix = format!("-{}", platform);
        if remaining.to_lowercase().ends_with(&suffix.to_lowercase()) {
            let trimmed = &remaining[..remaining.len() - suffix.len()];
            *remaining = trimmed;
            return Some(platform.to_string());
        }
        // Handle truncated: "-win-linux..." or "-pc..."
        let suffix_dots = format!("-{}...", platform);
        if remaining
            .to_lowercase()
            .ends_with(&suffix_dots.to_lowercase())
        {
            let trimmed = &remaining[..remaining.len() - suffix_dots.len()];
            *remaining = trimmed;
            return Some(platform.to_string());
        }
    }
    None
}

/// Extract version number, sort version array, and stage tag from the string.
/// Strategy: scan segments from right-to-left, preferring compound patterns
/// (Ep-7c, Chapter4, day19-20) over bare numbers (7c, 4, 19-20).
fn extract_version_info(
    remaining: &mut &str,
) -> (Option<String>, Option<Vec<i64>>, Option<String>) {
    // Collect all dash positions
    let dashes: Vec<usize> = remaining
        .match_indices('-')
        .map(|(i, _)| i)
        .collect();

    if dashes.is_empty() {
        // No dashes — check for stage tags in the whole string
        return check_stage_tags(remaining);
    }

    // Try compound patterns first: check if the last 2+ segments form a known pattern
    // e.g., "Title-Ep-7c" → segments ["Title", "Ep", "7c"] → "Ep-7c" is the version
    if dashes.len() >= 2 {
        let second_last = dashes[dashes.len() - 2];
        let combined = &remaining[second_last + 1..];
        if is_compound_version(combined) {
            let version_str = combined.to_string();
            let (stage, clean_version) = extract_stage_tag(&version_str);
            let sort_version = parse_sort_version(&clean_version);
            let new_remaining = remaining[..second_last].to_string();
            *remaining = Box::leak(new_remaining.into_boxed_str());
            return (Some(version_str), sort_version, stage);
        }
    }

    // Try the last segment as a version
    let last_dash = *dashes.last().unwrap();
    let potential_version = &remaining[last_dash + 1..];

    if looks_like_version_segment(potential_version) {
        let version_str = potential_version.to_string();
        let (stage, clean_version) = extract_stage_tag(&version_str);
        let sort_version = parse_sort_version(&clean_version);
        let new_remaining = remaining[..last_dash].to_string();
        *remaining = Box::leak(new_remaining.into_boxed_str());
        return (Some(version_str), sort_version, stage);
    }

    // Try the last 2 segments combined
    if dashes.len() >= 2 {
        let second_last = dashes[dashes.len() - 2];
        let combined = &remaining[second_last + 1..];
        if looks_like_version_segment(combined) {
            let version_str = combined.to_string();
            let (stage, clean_version) = extract_stage_tag(&version_str);
            let sort_version = parse_sort_version(&clean_version);
            let new_remaining = remaining[..second_last].to_string();
            *remaining = Box::leak(new_remaining.into_boxed_str());
            return (Some(version_str), sort_version, stage);
        }
    }

    // Check for bare stage tags (no version number)
    check_stage_tags(remaining)
}

/// Check if a combined segment looks like a compound version pattern.
/// e.g., "Ep-7c", "day19-20", "Act.4.3.Beta"
fn is_compound_version(s: &str) -> bool {
    let lower = s.to_lowercase();

    // Check for known prefixes
    for prefix in VERSION_PREFIXES {
        // "Ep-7c", "ep7c", "EpisodeFive.1"
        if lower.starts_with(prefix) {
            return true;
        }
    }

    false
}

/// Check for stage tags in the remaining string.
fn check_stage_tags(remaining: &mut &str) -> (Option<String>, Option<Vec<i64>>, Option<String>) {
    let lower = remaining.to_lowercase();
    for (pattern, normalized) in STAGE_TAGS {
        if lower.contains(&pattern.to_lowercase()) {
            let stage = Some(normalized.to_string());
            let cleaned = remaining
                .replace(pattern, "")
                .replace(&pattern.to_lowercase(), "");
            let cleaned = cleaned
                .trim_end_matches('-')
                .trim_end_matches('_')
                .trim()
                .to_string();
            if !cleaned.is_empty() {
                *remaining = Box::leak(cleaned.into_boxed_str());
            }
            return (None, None, stage);
        }
    }
    (None, None, None)
}

/// Heuristic: does this string look like a version/episode/part/act segment?
fn looks_like_version_segment(s: &str) -> bool {
    let lower = s.to_lowercase();

    // Starts with a digit
    if s.starts_with(|c: char| c.is_ascii_digit()) {
        return true;
    }

    // Starts with 'v' or 'V' followed by digit
    if (s.starts_with('v') || s.starts_with('V'))
        && s.len() > 1
        && s
            .chars()
            .nth(1)
            .map_or(false, |c| c.is_ascii_digit())
    {
        return true;
    }

    // Known prefixes: ep, episode, part, act, chapter, day
    for prefix in VERSION_PREFIXES {
        if lower.starts_with(prefix) {
            return true;
        }
    }

    false
}

/// Extract stage/development tags from version string.
/// Returns (normalized_stage, cleaned_version).
fn extract_stage_tag(version: &str) -> (Option<String>, String) {
    let lower = version.to_lowercase();
    for (pattern, normalized) in STAGE_TAGS {
        if lower.contains(&pattern.to_lowercase()) {
            // Remove the stage tag from the version
            let cleaned = version
                .replace(pattern, "")
                .replace(&pattern.to_lowercase(), "")
                .replace('_', " ")
                .trim_matches('.')
                .trim()
                .to_string();
            return (Some(normalized.to_string()), cleaned);
        }
    }
    (None, version.to_string())
}

/// Parse a version string into a numeric array for sorting.
fn parse_sort_version(version: &str) -> Option<Vec<i64>> {
    let cleaned = version
        .trim_start_matches(|c: char| c == 'v' || c == 'V')
        .replace("Ep-", "")
        .replace("Episode-", "")
        .replace("Act.", "")
        .replace("Part", "")
        .replace("Chapter", "")
        .replace("day", "")
        .replace('_', " ");

    let parts: Vec<i64> = cleaned
        .split(|c: char| c == '.' || c == '-' || c == ' ')
        .filter_map(|part| {
            let digits: String = part.chars().take_while(|c| c.is_ascii_digit()).collect();
            digits.parse::<i64>().ok()
        })
        .collect();

    if parts.is_empty() {
        None
    } else {
        Some(parts)
    }
}

/// Clean up the title: replace underscores/special chars, title-case
fn clean_title(raw: &str) -> String {
    let cleaned = raw
        .trim()
        .replace('_', " ")
        .replace('-', " ")
        .replace('.', " ");

    let title: String = cleaned
        .split_whitespace()
        .map(|word| {
            let mut chars = word.chars();
            match chars.next() {
                None => String::new(),
                Some(first) => {
                    let upper = first.to_uppercase().to_string();
                    let rest: String = chars.collect::<String>().to_lowercase();
                    format!("{}{}", upper, rest)
                }
            }
        })
        .collect::<Vec<_>>()
        .join(" ");

    if title.is_empty() {
        raw.to_string()
    } else {
        title
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn test_game(name: &str) -> Game {
        parse_folder_name(name, &PathBuf::from(format!("/games/{}", name)))
    }

    #[test]
    fn test_standard_format() {
        let g = test_game("Valley_Awakening-0.82.00F-pc");
        assert_eq!(g.title, "Valley Awakening");
        assert_eq!(g.version.as_deref(), Some("0.82.00F"));
        assert_eq!(g.platform.as_deref(), Some("pc"));
        assert_eq!(g.sort_version, Some(vec![0, 82, 0]));
    }

    #[test]
    fn test_v_prefix() {
        let g = test_game("WrestlingDynasty-v0.6-pc");
        assert_eq!(g.title, "Wrestlingdynasty");
        assert_eq!(g.version.as_deref(), Some("v0.6"));
        assert_eq!(g.sort_version, Some(vec![0, 6]));
    }

    #[test]
    fn test_capital_v_prefix() {
        let g = test_game("Love_Second_Base-V26.4.0-win-linux");
        assert_eq!(g.title, "Love Second Base");
        assert_eq!(g.version.as_deref(), Some("V26.4.0"));
        assert_eq!(g.platform.as_deref(), Some("win-linux"));
    }

    #[test]
    fn test_beta_tag() {
        let g = test_game("TheNullHypothesis-0.9b.beta.4-pc");
        assert_eq!(g.title, "Thenullhypothesis");
        assert_eq!(g.stage.as_deref(), Some("beta"));
        assert_eq!(g.platform.as_deref(), Some("pc"));
    }

    #[test]
    fn test_episode_format() {
        let g = test_game("StrongDesire-Ep-7c-pc");
        assert_eq!(g.title, "Strongdesire");
        assert_eq!(g.version.as_deref(), Some("Ep-7c"));
        assert_eq!(g.platform.as_deref(), Some("pc"));
    }

    #[test]
    fn test_part_format() {
        let g = test_game("AMothersLovePLUS-Part16PLUS-pc");
        assert_eq!(g.title, "Amothersloveplus");
        assert_eq!(g.version.as_deref(), Some("Part16PLUS"));
    }

    #[test]
    fn test_act_format() {
        let g = test_game("WhoremongerNTE-Act.4.3.Beta-pc");
        assert_eq!(g.title, "Whoremongernte");
        assert_eq!(g.version.as_deref(), Some("Act.4.3.Beta"));
        assert_eq!(g.stage.as_deref(), Some("beta"));
        assert_eq!(g.sort_version, Some(vec![4, 3]));
    }

    #[test]
    fn test_prologue_stage() {
        let g = test_game("MonstersDegree-v0.1-Prologue-pc");
        assert_eq!(g.title, "Monstersdegree");
        assert_eq!(g.version.as_deref(), Some("v0.1-Prologue"));
        assert_eq!(g.stage.as_deref(), Some("prologue"));
    }

    #[test]
    fn test_bare_title() {
        let g = test_game("BoundHearts");
        assert_eq!(g.title, "Boundhearts");
        assert!(g.version.is_none());
        assert!(g.platform.is_none());
    }

    #[test]
    fn test_title_with_spaces() {
        let g = test_game("A Town Uncovered");
        assert_eq!(g.title, "A Town Uncovered");
        assert!(g.version.is_none());
    }

    #[test]
    fn test_wip_tag() {
        let g = test_game("goodluke_thegame-1.1(WIP)-win");
        assert_eq!(g.title, "Goodluke Thegame");
        assert_eq!(g.stage.as_deref(), Some("wip"));
        assert_eq!(g.platform.as_deref(), Some("win"));
    }

    #[test]
    fn test_four_part_version() {
        let g = test_game("The_Spellbook-0.20.5.0-win");
        assert_eq!(g.title, "The Spellbook");
        assert_eq!(g.sort_version, Some(vec![0, 20, 5, 0]));
    }

    #[test]
    fn test_chapter_format() {
        let g = test_game("ActualRoommates2-Chapter4-pc");
        assert_eq!(g.title, "Actualroommates2");
        assert_eq!(g.version.as_deref(), Some("Chapter4"));
    }

    #[test]
    fn test_episode_word_format() {
        let g = test_game("LeavingDNA-EpisodeFive.1-pc");
        assert_eq!(g.title, "Leavingdna");
        assert_eq!(g.version.as_deref(), Some("EpisodeFive.1"));
    }

    #[test]
    fn test_day_format() {
        let g = test_game("sixteenyearslaterb-day19-20-pc");
        assert_eq!(g.title, "Sixteenyearslaterb");
        assert_eq!(g.version.as_deref(), Some("day19-20"));
    }

    #[test]
    fn test_sort_version_ordering() {
        let v1 = parse_sort_version("0.4").unwrap();
        let v2 = parse_sort_version("0.27").unwrap();
        let v3 = parse_sort_version("2.0").unwrap();
        assert!(v1 < v2);
        assert!(v2 < v3);
    }

    #[test]
    fn test_sort_version_with_v_prefix() {
        let v = parse_sort_version("v22.5c").unwrap();
        assert_eq!(v, vec![22, 5]);
    }

    #[test]
    fn test_clean_title_preserves_numbers() {
        let g = test_game("Kyles_Mind-0.1.5-pc");
        assert_eq!(g.title, "Kyles Mind");
    }
}
