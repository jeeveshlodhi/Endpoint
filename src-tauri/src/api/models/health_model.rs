use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ApiResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<serde_json::Value>,
    pub status_code: u16,
    pub headers: serde_json::Value,
    pub content: String,
    pub execution_time_ms: f64,
    pub size_bytes: usize,
    pub request_details: serde_json::Value,
}
