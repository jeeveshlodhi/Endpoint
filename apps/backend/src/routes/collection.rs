use crate::app_middleware::Auth;
use crate::handlers::{
    create_collection, delete_collection, get_collection, get_collections, update_collection,
};
use actix_web::{
    dev::{ServiceFactory, ServiceRequest, ServiceResponse},
    web, Error, Scope,
};

pub fn collection_routes() -> Scope<
    impl ServiceFactory<
        ServiceRequest,
        Config = (),
        Response = ServiceResponse,
        Error = Error,
        InitError = (),
    >,
> {
    web::scope("/collections")
        .wrap(Auth)
        .route("", web::post().to(create_collection))
        .route("", web::get().to(get_collections))
        .route("/{id}", web::get().to(get_collection))
        .route("/{id}", web::put().to(update_collection))
        .route("/{id}", web::delete().to(delete_collection))
}
