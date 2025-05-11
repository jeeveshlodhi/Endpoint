use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::error::AppError;
use crate::models::{
    Collection, CollectionResponse, CollectionWithRequestsResponse, CreateCollectionDto, Request,
    UpdateCollectionDto,
};

pub async fn create_collection(
    pool: web::Data<PgPool>,
    collection_dto: web::Json<CreateCollectionDto>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    // Validate the collection data
    collection_dto
        .validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    // Insert the collection into the database
    let collection = sqlx::query_as!(
        Collection,
        r#"
        INSERT INTO collections (id, name, description, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, description, user_id, created_at, updated_at
        "#,
        Uuid::new_v4(),
        collection_dto.name,
        collection_dto.description,
        user_id.into_inner(),
        chrono::Utc::now().naive_utc(),
        chrono::Utc::now().naive_utc()
    )
    .fetch_one(pool.get_ref())
    .await?;

    // Return the collection
    Ok(HttpResponse::Created().json(collection.to_response()))
}

pub async fn get_collections(
    pool: web::Data<PgPool>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    // Get all collections for the user
    let collections = sqlx::query_as!(
        Collection,
        r#"
        SELECT * FROM collections
        WHERE user_id = $1
        ORDER BY created_at DESC
        "#,
        user_id.into_inner()
    )
    .fetch_all(pool.get_ref())
    .await?;

    // Transform to response objects
    let collection_responses: Vec<CollectionResponse> =
        collections.into_iter().map(|c| c.to_response()).collect();

    // Return the collections
    Ok(HttpResponse::Ok().json(collection_responses))
}

pub async fn get_collection(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let collection_id = path.into_inner();

    // Get the collection
    let collection = sqlx::query_as!(
        Collection,
        r#"
        SELECT * FROM collections
        WHERE id = $1 AND user_id = $2
        "#,
        collection_id,
        user_id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| AppError::NotFoundError("Collection not found".to_string()))?;

    // Get all requests for this collection
    let requests = sqlx::query_as!(
        Request,
        r#"
        SELECT * FROM requests
        WHERE collection_id = $1
        ORDER BY created_at DESC
        "#,
        collection_id
    )
    .fetch_all(pool.get_ref())
    .await?;

    // Transform requests to response objects
    let request_responses = requests.into_iter().map(|r| r.to_response()).collect();

    // Create response with collection and its requests
    let response = CollectionWithRequestsResponse {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
        requests: request_responses,
    };

    // Return the collection with requests
    Ok(HttpResponse::Ok().json(response))
}

pub async fn update_collection(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    collection_dto: web::Json<UpdateCollectionDto>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let collection_id = path.into_inner();

    // Validate the collection exists and belongs to the user
    let collection = sqlx::query_as!(
        Collection,
        r#"
        SELECT * FROM collections
        WHERE id = $1 AND user_id = $2
        "#,
        collection_id,
        user_id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await?
    .ok_or_else(|| AppError::NotFoundError("Collection not found".to_string()))?;

    // Update only provided fields
    let name = collection_dto.name.clone().unwrap_or(collection.name);
    let description = collection_dto
        .description
        .clone()
        .or(collection.description);

    // Update the collection in the database
    let updated_collection = sqlx::query_as!(
        Collection,
        r#"
        UPDATE collections
        SET name = $1, description = $2, updated_at = $3
        WHERE id = $4
        RETURNING id, name, description, user_id, created_at, updated_at
        "#,
        name,
        description,
        chrono::Utc::now().naive_utc(),
        collection_id
    )
    .fetch_one(pool.get_ref())
    .await?;

    // Return the updated collection
    Ok(HttpResponse::Ok().json(updated_collection.to_response()))
}

pub async fn delete_collection(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    user_id: web::ReqData<Uuid>,
) -> Result<HttpResponse, AppError> {
    let collection_id = path.into_inner();

    // Verify the collection exists and belongs to the user
    let collection_exists = sqlx::query!(
        r#"
        SELECT id FROM collections
        WHERE id = $1 AND user_id = $2
        "#,
        collection_id,
        user_id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await?;

    if collection_exists.is_none() {
        return Err(AppError::NotFoundError("Collection not found".to_string()));
    }

    // Delete all requests in the collection first
    sqlx::query!(
        r#"
        DELETE FROM requests
        WHERE collection_id = $1
        "#,
        collection_id
    )
    .execute(pool.get_ref())
    .await?;

    // Delete the collection
    sqlx::query!(
        r#"
        DELETE FROM collections
        WHERE id = $1
        "#,
        collection_id
    )
    .execute(pool.get_ref())
    .await?;

    // Return success with no content
    Ok(HttpResponse::NoContent().finish())
}
