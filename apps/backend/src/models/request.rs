use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Request {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub url: String,
    pub method: String,
    pub headers: Value,        // JSON object storing headers
    pub body: Option<Value>,   // JSON object storing request body
    pub params: Option<Value>, // JSON object storing query parameters
    pub collection_id: Option<Uuid>,
    pub user_id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateRequestDto {
    #[validate(length(min = 1, message = "Name cannot be empty"))]
    pub name: String,
    pub description: Option<String>,
    #[validate(url(message = "Invalid URL format"))]
    pub url: String,
    #[validate(length(min = 1, message = "Method cannot be empty"))]
    pub method: String,
    pub headers: Option<Value>,
    pub body: Option<Value>,
    pub params: Option<Value>,
    pub collection_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateRequestDto {
    pub name: Option<String>,
    pub description: Option<String>,
    pub url: Option<String>,
    pub method: Option<String>,
    pub headers: Option<Value>,
    pub body: Option<Value>,
    pub params: Option<Value>,
    pub collection_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RequestResponse {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub url: String,
    pub method: String,
    pub headers: Value,
    pub body: Option<Value>,
    pub params: Option<Value>,
    pub collection_id: Option<Uuid>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl Request {
    pub fn to_response(&self) -> RequestResponse {
        RequestResponse {
            id: self.id,
            name: self.name.clone(),
            description: self.description.clone(),
            url: self.url.clone(),
            method: self.method.clone(),
            headers: self.headers.clone(),
            body: self.body.clone(),
            params: self.params.clone(),
            collection_id: self.collection_id,
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
}
