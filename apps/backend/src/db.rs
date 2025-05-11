use anyhow::Result;
use deadpool_postgres::{Config, Pool, Runtime};
use log::{error, info};
use sqlx::postgres::PgPoolOptions;
use tokio_postgres::{Config as PgConfig, NoTls};
use url::Url;

pub type DbPool = sqlx::PgPool;

pub async fn create_pool(database_url: &str) -> Result<DbPool> {
    info!("Creating database connection pool...");

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(database_url)
        .await?;

    info!("Database connection pool created successfully");
    Ok(pool)
}

pub async fn run_migrations(database_url: &str) -> Result<()> {
    info!("Running database migrations...");

    let migrate_result = sqlx::migrate!("./migrations")
        .run(&sqlx::PgPool::connect(database_url).await?)
        .await;

    match migrate_result {
        Ok(_) => {
            info!("Database migrations completed successfully");
            Ok(())
        }
        Err(e) => {
            error!("Error running migrations: {:?}", e);
            Err(e.into())
        }
    }
}

// Function to create a deadpool connection pool (alternative to sqlx)
pub fn create_deadpool(database_url: &str) -> Result<Pool> {
    let url = Url::parse(database_url)?;

    let mut cfg = Config::new();

    cfg.host = url.host_str().map(String::from);
    cfg.port = url.port();
    cfg.user = url.username().to_string().into();
    cfg.password = url.password().map(String::from);
    cfg.dbname = url.path().trim_start_matches('/').to_string().into();

    let pool = cfg.create_pool(Some(Runtime::Tokio1), NoTls)?;
    Ok(pool)
}
