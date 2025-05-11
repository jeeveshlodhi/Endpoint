use actix_cors::Cors;
use actix_web::{middleware, App, HttpServer};
use dotenv::dotenv;
use log::info;

mod app_middleware;
mod config;
mod db;
mod error;
mod handlers;
mod models;
mod routes;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables
    dotenv().ok();

    // Initialize logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Load configuration
    let config = config::Config::from_env().expect("Failed to load configuration");

    // Set up database connection pool
    let pool = db::create_pool(&config.database_url)
        .await
        .expect("Failed to create database pool");

    // Run database migrations
    db::run_migrations(&config.database_url)
        .await
        .expect("Failed to run database migrations");

    info!(
        "Starting server at {}:{}",
        config.server.host, config.server.port
    );

    // Start HTTP server
    HttpServer::new(move || {
        // CORS configuration
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .app_data(actix_web::web::Data::new(pool.clone()))
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .configure(routes::configure)
    })
    .bind(format!("{}:{}", config.server.host, config.server.port))?
    .run()
    .await
}
