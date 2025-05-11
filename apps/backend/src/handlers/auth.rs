use actix_web::{web, HttpResponse};
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::app_middleware::Claims;
use crate::config::Config;
use crate::error::AppError;
use crate::models::{AuthResponse, CreateUserDto, LoginDto, User, UserResponse};

pub async fn register(
    pool: web::Data<PgPool>,
    user_dto: web::Json<CreateUserDto>,
) -> Result<HttpResponse, AppError> {
    // Validate the user data
    user_dto
        .validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    // Check if user with this email already exists
    let user_exists = sqlx::query!("SELECT id FROM users WHERE email = $1", user_dto.email)
        .fetch_optional(pool.get_ref())
        .await?;

    if user_exists.is_some() {
        return Err(AppError::ConflictError(
            "User with this email already exists".to_string(),
        ));
    }

    // Hash the password
    let password_hash = hash(&user_dto.password, DEFAULT_COST)
        .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    // Insert the user into the database
    let user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, password_hash, name, created_at, updated_at
        "#,
        Uuid::new_v4(),
        user_dto.email,
        password_hash,
        user_dto.name,
        Utc::now().naive_utc(),
        Utc::now().naive_utc()
    )
    .fetch_one(pool.get_ref())
    .await?;

    // Generate JWT token
    let config = Config::from_env().expect("Failed to load configuration");
    let expiration = Utc::now() + Duration::hours(24);
    let claims = Claims {
        sub: user.id.to_string(),
        exp: expiration.timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
    )
    .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    // Return the user with token
    Ok(HttpResponse::Created().json(AuthResponse {
        user: user.to_response(),
        token,
    }))
}

pub async fn login(
    pool: web::Data<PgPool>,
    login_dto: web::Json<LoginDto>,
) -> Result<HttpResponse, AppError> {
    // Validate the login data
    login_dto
        .validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    // Find the user by email
    let user = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE email = $1",
        login_dto.email
    )
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| AppError::AuthError("Invalid email or password".to_string()))?;

    // Verify the password
    let valid_password = verify(&login_dto.password, &user.password_hash)
        .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    if !valid_password {
        return Err(AppError::AuthError("Invalid email or password".to_string()));
    }

    // Generate JWT token
    let config = Config::from_env().expect("Failed to load configuration");
    let expiration = Utc::now() + Duration::hours(24);
    let claims = Claims {
        sub: user.id.to_string(),
        exp: expiration.timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
    )
    .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    // Return the user with token
    Ok(HttpResponse::Ok().json(AuthResponse {
        user: user.to_response(),
        token,
    }))
}

pub async fn get_current_user(
    user_id: web::ReqData<Uuid>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppError> {
    // Get current user from database
    let user = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE id = $1",
        user_id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| AppError::NotFoundError("User not found".to_string()))?;

    // Return the user
    Ok(HttpResponse::Ok().json(user.to_response()))
}
