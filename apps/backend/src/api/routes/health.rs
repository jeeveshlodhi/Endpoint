// src-tauri/src/api/routes/health.rs
use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    Json,
};
use std::time::Instant;
use sysinfo::{CpuExt, DiskExt, System, SystemExt};

use crate::api::models::health_model::ApiResponse;
use crate::api::state::AppState;

pub async fn health_check(
    State(state): State<AppState>,
) -> (StatusCode, HeaderMap, Json<ApiResponse>) {
    let start_time = Instant::now();

    // Initialize system information
    let mut system = System::new_all();
    system.refresh_all();

    // Get CPU usage
    let cpu_usage = system.global_cpu_info().cpu_usage();

    // Get memory usage
    let memory_info = system.total_memory();
    let used_memory = system.used_memory();
    let memory_percentage = (used_memory as f64 / memory_info as f64) * 100.0;

    // Get disk usage (for root directory)
    let disk_usage_percentage = system
        .disks()
        .iter()
        .find(|disk| disk.mount_point() == std::path::Path::new("/"))
        .map(|disk| {
            let total = disk.total_space();
            let used = total - disk.available_space();
            (used as f64 / total as f64) * 100.0
        })
        .unwrap_or(0.0);

    // Create health data
    let health_data = serde_json::json!({
        "status": "healthy",
        "cpu_usage": format!("{:.1}%", cpu_usage),
        "memory_usage": format!("{:.1}%", memory_percentage),
        "disk_usage": format!("{:.1}%", disk_usage_percentage),
        "version": state.app_version.clone(),
    });

    // Calculate execution time
    let execution_time = start_time.elapsed().as_secs_f64() * 1000.0;

    // Calculate response size
    let size_bytes = serde_json::to_string(&health_data).unwrap().len();

    // Create response
    let response = ApiResponse {
        success: true,
        message: "Server is healthy".to_string(),
        data: Some(health_data),
        status_code: 200,
        headers: serde_json::json!({}),
        content: "".to_string(),
        execution_time_ms: execution_time,
        size_bytes,
        request_details: serde_json::json!({}),
    };

    // Set headers
    let mut headers = HeaderMap::new();
    headers.insert("Content-Type", "application/json".parse().unwrap());

    (StatusCode::OK, headers, Json(response))
}
