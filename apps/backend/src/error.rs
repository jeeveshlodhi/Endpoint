use actix_web::{HttpResponse, ResponseError};
use serde::{Deserialize, Serialize};
use std::fmt;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error: {0}")]
    DbError(#[from] sqlx::Error),

    #[error("Authentication error: {0}")]
    AuthError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Not found: {0}")]
    NotFoundError(String),

    #[error("Conflict: {0}")]
    ConflictError(String),

    #[error("Internal server error")]
    InternalServerError(String),

    #[error("Bad request: {0}")]
    BadRequestError(String),
}

#[derive(Serialize, Deserialize)]
struct ErrorResponse {
    status: String,
    message: String,
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        match self {
            AppError::DbError(e) => {
                log::error!("Database error: {:?}", e);
                HttpResponse::InternalServerError().json(ErrorResponse {
                    status: "error".to_string(),
                    message: "Internal server error".to_string(),
                })
            }
            AppError::AuthError(e) => HttpResponse::Unauthorized().json(ErrorResponse {
                status: "error".to_string(),
                message: e.to_string(),
            }),
            AppError::ValidationError(e) => HttpResponse::BadRequest().json(ErrorResponse {
                status: "error".to_string(),
                message: e.to_string(),
            }),
            AppError::NotFoundError(e) => HttpResponse::NotFound().json(ErrorResponse {
                status: "error".to_string(),
                message: e.to_string(),
            }),
            AppError::ConflictError(e) => HttpResponse::Conflict().json(ErrorResponse {
                status: "error".to_string(),
                message: e.to_string(),
            }),
            AppError::InternalServerError(e) => {
                log::error!("Internal server error: {}", e);
                HttpResponse::InternalServerError().json(ErrorResponse {
                    status: "error".to_string(),
                    message: "Internal server error".to_string(),
                })
            }
            AppError::BadRequestError(e) => HttpResponse::BadRequest().json(ErrorResponse {
                status: "error".to_string(),
                message: e.to_string(),
            }),
        }
    }
}
