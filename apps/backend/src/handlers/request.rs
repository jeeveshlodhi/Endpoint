use actix_web::{web, HttpResponse};
use serde_json::Value;
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::error::AppError;
use crate::models::{CreateRequestDto, Request, UpdateRequestDto};
use crate::utils::http::{execute_request, HttpRequestResult};

pub async fn create_request(
    pool: web::Data<PgPool>,
    request_dto: web::Json<CreateRequestDto>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let user_id = user_id.into_inner();

    // Validate the request data
    request_dto
        .validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    // If collection_id is provided, verify it exists and belongs to the user
    if let Some(collection_id) = request_dto.collection_id {
        let collection_exists = sqlx::query!(
            r#"
            SELECT id FROM collections
            WHERE id = $1 AND user_id = $2
            "#,
            collection_id,
            user_id
        )
        .fetch_optional(pool.get_ref())
        .await?;

        if collection_exists.is_none() {
            return Err(AppError::NotFoundError("Collection not found".to_string()));
        }
    }

    // Prepare headers, body, and params
    let headers = request_dto
        .headers
        .clone()
        .unwrap_or_else(|| Value::Object(serde_json::Map::new()));
    let body = request_dto.body.clone();
    let params = request_dto.params.clone();

    // Insert the request into the database
    let request = sqlx::query_as!(
        Request,
        r#"
        INSERT INTO requests (
            id, name, description, url, method, headers, body, params,
            collection_id, user_id, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, name, description, url, method, headers, body, params,
                  collection_id, user_id, created_at, updated_at
        "#,
        Uuid::new_v4(),
        request_dto.name,
        request_dto.description,
        request_dto.url,
        request_dto.method,
        headers,
        body,
        params,
        request_dto.collection_id,
        user_id,
        chrono::Utc::now().naive_utc(),
        chrono::Utc::now().naive_utc()
    )
    .fetch_one(pool.get_ref())
    .await?;

    // Return the request
    Ok(HttpResponse::Created().json(request.to_response()))
}

pub async fn get_requests(
    pool: web::Data<PgPool>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    // Get all requests for the user
    let requests = sqlx::query_as!(
        Request,
        r#"
        SELECT * FROM requests
        WHERE user_id = $1
        ORDER BY created_at DESC
        "#,
        user_id.into_inner()
    )
    .fetch_all(pool.get_ref())
    .await?;

    // Transform to response objects
    let request_responses = requests
        .into_iter()
        .map(|r| r.to_response())
        .collect::<Vec<_>>();

    // Return the requests
    Ok(HttpResponse::Ok().json(request_responses))
}

pub async fn get_request(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let request_id = path.into_inner();

    // Get the request
    let request = sqlx::query_as!(
        Request,
        r#"
        SELECT * FROM requests
        WHERE id = $1 AND user_id = $2
        "#,
        request_id,
        user_id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| AppError::NotFoundError("Request not found".to_string()))?;

    // Return the request
    Ok(HttpResponse::Ok().json(request.to_response()))
}

pub async fn update_request(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    request_dto: web::Json<UpdateRequestDto>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let request_id = path.into_inner();
    let user_id = user_id.into_inner();

    // Validate the request exists and belongs to the user
    let request = sqlx::query_as!(
        Request,
        r#"
        SELECT * FROM requests
        WHERE id = $1 AND user_id = $2
        "#,
        request_id,
        user_id
    )
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| AppError::NotFoundError("Request not found".to_string()))?;

    // If collection_id is provided, verify it exists and belongs to the user
    if let Some(collection_id) = request_dto.collection_id {
        let collection_exists = sqlx::query!(
            r#"
            SELECT id FROM collections
            WHERE id = $1 AND user_id = $2
            "#,
            collection_id,
            user_id
        )
        .fetch_optional(pool.get_ref())
        .await?;

        if collection_exists.is_none() {
            return Err(AppError::NotFoundError("Collection not found".to_string()));
        }
    }

    // Update only provided fields
    let name = request_dto.name.clone().unwrap_or(request.name);
    let description = request_dto.description.clone().or(request.description);
    let url = request_dto.url.clone().unwrap_or(request.url);
    let method = request_dto.method.clone().unwrap_or(request.method);
    let headers = request_dto.headers.clone().unwrap_or(request.headers);
    let body = request_dto.body.clone().or(request.body);
    let params = request_dto.params.clone().or(request.params);
    let collection_id = request_dto.collection_id.or(request.collection_id);

    // Update the request in the database
    let updated_request = sqlx::query_as!(
        Request,
        r#"
        UPDATE requests
        SET name = $1, description = $2, url = $3, method = $4,
            headers = $5, body = $6, params = $7, collection_id = $8, updated_at = $9
        WHERE id = $10
        RETURNING id, name, description, url, method, headers, body, params,
                  collection_id, user_id, created_at, updated_at
        "#,
        name,
        description,
        url,
        method,
        headers,
        body,
        params,
        collection_id,
        chrono::Utc::now().naive_utc(),
        request_id
    )
    .fetch_one(pool.get_ref())
    .await?;

    // Return the updated request
    Ok(HttpResponse::Ok().json(updated_request.to_response()))
}

pub async fn delete_request(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let request_id = path.into_inner();

    // Verify the request exists and belongs to the user
    let request_exists = sqlx::query!(
        r#"
        SELECT id FROM requests
        WHERE id = $1 AND user_id = $2
        "#,
        request_id,
        user_id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await?;

    if request_exists.is_none() {
        return Err(AppError::NotFoundError("Request not found".to_string()));
    }

    // Delete the request
    sqlx::query!(
        r#"
        DELETE FROM requests
        WHERE id = $1
        "#,
        request_id
    )
    .execute(pool.get_ref())
    .await?;

    // Return success with no content
    Ok(HttpResponse::NoContent().finish())
}

pub async fn execute(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let request_id = path.into_inner();

    // Get the request
    let request = sqlx::query_as!(
        Request,
        r#"
        SELECT * FROM requests
        WHERE id = $1 AND user_id = $2
        "#,
        request_id,
        user_id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| AppError::NotFoundError("Request not found".to_string()))?;

    // Execute the HTTP request
    let result = execute_request(&request)
        .await
        .map_err(|e| AppError::BadRequestError(format!("Failed to execute request: {}", e)))?;

    // Return the response
    Ok(HttpResponse::Ok().json(result))
}
