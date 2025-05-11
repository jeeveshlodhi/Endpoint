pub mod auth;
pub mod collection;
pub mod request;

pub use auth::auth_routes;
pub use collection::collection_routes;
pub use request::request_routes;

use actix_web::{web, Scope};

pub fn configure(cfg: &mut web::ServiceConfig) {
    // Configure authentication routes directly here
    cfg.service(
        web::scope("/auth")
            .route("/register", web::post().to(crate::handlers::register))
            .route("/login", web::post().to(crate::handlers::login))
            .service(
                web::scope("/me")
                    .wrap(crate::app_middleware::Auth) // Apply Auth middleware to this scope
                    .route("", web::get().to(crate::handlers::get_current_user)),
            ),
    );

    // Configure other routes (collection and request)
    // cfg.configure(collection::configure)
    //     .configure(request::configure);
}
