// src-tauri/src/api/models/http_model.rs
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone)]
pub struct UrlRequest {
    pub method: String,
    pub url: String,
    pub headers: Option<HashMap<String, String>>,
    pub params: Option<HashMap<String, String>>,
    pub body: Option<serde_json::Value>,
    pub timeout: Option<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct ErrorDetails {
    pub error_type: String,
    pub message: String,
    pub status_code: u16,
}

#[derive(Serialize, Deserialize)]
pub struct ApiResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<serde_json::Value>,
    pub status_code: u16,
    pub headers: HashMap<String, String>,
    pub content: String,
    pub execution_time_ms: f64,
    pub size_bytes: usize,
    pub request_details: serde_json::Value,
    pub error: Option<ErrorDetails>,
}
