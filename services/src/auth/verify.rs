use actix_web::{get, web, HttpResponse, Responder};

#[get("/auth/verify/{token}")]
pub async fn verify(token: web::Path<String>) -> impl Responder {
	let token = token.into_inner();

	HttpResponse::Ok().body(format!("Token: {}", token))
}
