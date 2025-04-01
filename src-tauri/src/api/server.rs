use axum::{
    http::{header, HeaderValue, Method},
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

use crate::api::routes::{health, http};
use crate::api::state::AppState;

pub async fn start_api_server() {
    // Create shared application state
    let app_state = AppState::new(env!("CARGO_PKG_VERSION").to_string());

    // Configure CORS
    let cors = CorsLayer::new()
        // Specify the exact origin instead of using Any/wildcard
        .allow_origin("http://localhost:1420".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::AUTHORIZATION,
            header::ACCEPT,
            header::ORIGIN,
        ])
        .allow_credentials(true);

    // Define routes with CORS middleware
    let app = Router::new()
        .route("/api/health", get(health::health_check))
        .route("/api/fetch", post(http::fetch_url))
        .layer(cors)
        .with_state(app_state);

    // Define the address
    let addr = SocketAddr::from(([127, 0, 0, 1], 3030));
    println!("API server listening on {}", addr);

    // Start the server
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
