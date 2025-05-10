#[derive(Clone)]
pub struct AppState {
    pub app_version: String,
    // Add other shared state here
}

impl AppState {
    pub fn new(app_version: String) -> Self {
        Self { app_version }
    }
}
