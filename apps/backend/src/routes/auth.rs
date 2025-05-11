use crate::app_middleware::Auth;
use crate::handlers::{get_current_user, login, register};
use actix_web::{web, Scope};

pub fn auth_routes() -> Scope {
    web::scope("/auth")
        .route("/register", web::post().to(register))
        .route("/login", web::post().to(login))
        .service(
            web::scope("/me")
                .wrap(Auth)
                .route("", web::get().to(get_current_user)),
        )
}
