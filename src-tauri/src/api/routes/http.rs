// src-tauri/src/api/routes/http.rs
use axum::{extract::State, http::StatusCode, Json};

use crate::api::models::http_model::{ApiResponse, UrlRequest};
use crate::api::services::http_client;
use crate::api::state::AppState;

pub async fn fetch_url(
    State(_state): State<AppState>,
    Json(request_data): Json<UrlRequest>,
) -> (StatusCode, Json<ApiResponse>) {
    let response = http_client::execute_request(request_data).await;

    // Get appropriate status code
    let status =
        StatusCode::from_u16(response.status_code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);

    (status, Json(response))
}
