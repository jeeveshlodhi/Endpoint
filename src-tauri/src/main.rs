// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod api;

fn main() {
    let rt = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");

    // Start the API server using the runtime
    rt.spawn(async {
        api::server::start_api_server().await;
    });
    endpoint_lib::run()
}
