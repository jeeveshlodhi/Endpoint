
    fn main() {

        let rt = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");

        // Start the API server using the runtime
        rt.spawn(async {
            api::server::start_api_server().await;
        });

    }
