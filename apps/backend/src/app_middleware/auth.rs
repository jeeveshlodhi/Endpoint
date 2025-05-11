use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures::future::{ready, LocalBoxFuture, Ready};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::rc::Rc;
use uuid::Uuid;

use crate::config::Config;
use crate::error::AppError;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // User ID
    pub exp: usize,  // Expiration time
}

pub struct Auth;

impl<S, B> Transform<S, ServiceRequest> for Auth
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = AuthMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthMiddleware {
            service: Rc::new(service),
        }))
    }
}

pub struct AuthMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AuthMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let service = Rc::clone(&self.service);

        Box::pin(async move {
            // Get the authorization header
            let auth_header = match req.headers().get("Authorization") {
                Some(header) => header.to_str().unwrap_or(""),
                None => {
                    return Err(
                        AppError::AuthError("Missing authorization header".to_string()).into(),
                    )
                }
            };

            // Validate the Bearer token format
            if !auth_header.starts_with("Bearer ") {
                return Err(
                    AppError::AuthError("Invalid authorization header format".to_string()).into(),
                );
            }

            // Extract the token
            let token = &auth_header[7..];

            // Load config to get JWT secret
            let config = Config::from_env().expect("Failed to load configuration");

            // Validate and decode the token
            let claims = match decode::<Claims>(
                token,
                &DecodingKey::from_secret(config.jwt_secret.as_bytes()),
                &Validation::default(),
            ) {
                Ok(token_data) => token_data.claims,
                Err(e) => {
                    return Err(AppError::AuthError(format!("Invalid token: {}", e)).into());
                }
            };

            // Parse the user ID from the token
            let user_id = match Uuid::parse_str(&claims.sub) {
                Ok(id) => id,
                Err(_) => {
                    return Err(AppError::AuthError("Invalid user ID in token".to_string()).into());
                }
            };

            // Store the user ID in the request extensions
            req.extensions_mut().insert(user_id);

            // Forward the request to the next middleware or handler
            service.call(req).await
        })
    }
}

// Helper function to extract user ID from request extensions
pub fn get_user_id(req: &ServiceRequest) -> Result<Uuid, AppError> {
    req.extensions()
        .get::<Uuid>()
        .copied()
        .ok_or_else(|| AppError::AuthError("User ID not found in request".to_string()))
}
