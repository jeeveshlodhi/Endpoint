use crate::app_middleware::Auth;
use crate::handlers::{
    create_request, delete_request, execute, get_request, get_requests, update_request,
};
use actix_web::{
    dev::{ServiceFactory, ServiceRequest, ServiceResponse},
    web, Error, Scope,
};

pub fn request_routes() -> Scope<
    impl ServiceFactory<
        ServiceRequest,
        Config = (),
        Response = ServiceResponse,
        Error = Error,
        InitError = (),
    >,
> {
    web::scope("/requests")
        .wrap(Auth)
        .route("", web::post().to(create_request))
        .route("", web::get().to(get_requests))
        .route("/{id}", web::get().to(get_request))
        .route("/{id}", web::put().to(update_request))
        .route("/{id}", web::delete().to(delete_request))
        .route("/{id}/execute", web::post().to(execute))
}
