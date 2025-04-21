use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub name: String,
}

pub fn init_db() -> Result<()> {
    let conn = Connection::open("app.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS user (
            id    INTEGER PRIMARY KEY,
            name  TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

#[tauri::command]
pub fn add_user(name: String) -> Result<String, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO user (name) VALUES (?1)", [&name])
        .map_err(|e| e.to_string())?;
    Ok("User added!".into())
}

#[tauri::command]
pub fn list_users() -> Result<Vec<User>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name FROM user")
        .map_err(|e| e.to_string())?;

    let user_iter = stmt
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut users = Vec::new();
    for user in user_iter {
        users.push(user.map_err(|e| e.to_string())?);
    }

    Ok(users)
}
