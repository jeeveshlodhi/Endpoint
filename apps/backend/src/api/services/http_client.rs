// src-tauri/src/api/services/http_client.rs
use reqwest::{Client, Method, StatusCode};
use std::collections::HashMap;
use std::str::FromStr;
use std::time::{Duration, Instant};

use crate::api::models::http_model::{ApiResponse, ErrorDetails, UrlRequest};

pub async fn execute_request(request_data: UrlRequest) -> ApiResponse {
    let start_time = Instant::now();

    // Convert headers to proper format
    let headers = request_data.headers.unwrap_or_default();

    // Prepare request details for logging
    let request_details = serde_json::json!({
        "method": request_data.method,
        "url": request_data.url,
        "headers": headers,
        "params": request_data.params,
        "body": request_data.body,
    });

    // Parse method string to reqwest::Method
    let method = match Method::from_str(&request_data.method) {
        Ok(m) => m,
        Err(_) => {
            return error_response(
                400,
                "InvalidMethod",
                &format!("Invalid HTTP method: {}", request_data.method),
                &request_details,
                start_time.elapsed().as_secs_f64() * 1000.0,
            );
        }
    };

    // Create client
    let client = Client::new();
    let mut request_builder = client.request(method, &request_data.url);

    // Add headers
    for (key, value) in headers {
        request_builder = request_builder.header(key, value);
    }

    // Add query parameters
    if let Some(params) = request_data.params {
        request_builder = request_builder.query(&params);
    }

    // Add body for non-GET requests
    if request_data.method != "GET" && request_data.method != "HEAD" {
        if let Some(body) = request_data.body {
            request_builder = request_builder.json(&body);
        }
    }

    // Set timeout
    if let Some(timeout) = request_data.timeout {
        request_builder = request_builder.timeout(Duration::from_secs_f64(timeout));
    }

    // Execute request
    match request_builder.send().await {
        Ok(response) => {
            let status = response.status();
            let response_headers: HashMap<String, String> = response
                .headers()
                .iter()
                .map(|(name, value)| (name.to_string(), value.to_str().unwrap_or("").to_string()))
                .collect();

            // Get response body as text
            match response.text().await {
                Ok(text) => {
                    // Calculate metrics
                    let execution_time = start_time.elapsed().as_secs_f64() * 1000.0;
                    let content_size = text.len();

                    // Determine if request was successful (2xx status code)
                    let success = status.is_success();

                    let error = if !success {
                        Some(ErrorDetails {
                            error_type: "HTTPStatusError".to_string(),
                            message: format!("HTTP Status Error: {}", status),
                            status_code: status.as_u16(),
                        })
                    } else {
                        None
                    };

                    ApiResponse {
                        status_code: status.as_u16(),
                        message: "".to_string(),
                        data: Some(serde_json::json!({})),
                        headers: response_headers,
                        content: text,
                        execution_time_ms: execution_time,
                        size_bytes: content_size,
                        request_details,
                        success,
                        error,
                    }
                }
                Err(e) => error_response(
                    500,
                    "ResponseError",
                    &format!("Failed to read response body: {}", e),
                    &request_details,
                    start_time.elapsed().as_secs_f64() * 1000.0,
                ),
            }
        }
        Err(e) => {
            // Handle different types of errors
            if e.is_timeout() {
                error_response(
                    504,
                    "TimeoutException",
                    &format!("Request timed out: {}", e),
                    &request_details,
                    start_time.elapsed().as_secs_f64() * 1000.0,
                )
            } else if e.is_status() {
                let status = e.status().unwrap_or(StatusCode::BAD_REQUEST);
                error_response(
                    status.as_u16(),
                    "HTTPStatusError",
                    &format!("HTTP Status Error: {}", e),
                    &request_details,
                    start_time.elapsed().as_secs_f64() * 1000.0,
                )
            } else if e.is_connect() {
                error_response(
                    502,
                    "ConnectionError",
                    &format!("Connection error: {}", e),
                    &request_details,
                    start_time.elapsed().as_secs_f64() * 1000.0,
                )
            } else {
                error_response(
                    400,
                    "RequestError",
                    &format!("Request error: {}", e),
                    &request_details,
                    start_time.elapsed().as_secs_f64() * 1000.0,
                )
            }
        }
    }
}

// Helper function to create error responses
fn error_response(
    status_code: u16,
    error_type: &str,
    message: &str,
    request_details: &serde_json::Value,
    execution_time: f64,
) -> ApiResponse {
    ApiResponse {
        status_code,
        message: "".to_string(),
        data: Some(serde_json::json!({})),
        headers: HashMap::new(),
        content: "".to_string(),
        execution_time_ms: execution_time,
        size_bytes: 0,
        request_details: request_details.clone(),
        success: false,
        error: Some(ErrorDetails {
            error_type: error_type.to_string(),
            message: message.to_string(),
            status_code,
        }),
    }
}
