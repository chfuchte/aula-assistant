use axum::{Json, extract::State, http::StatusCode, response::IntoResponse};
use serde::Serialize;
use tracing::error;

use crate::router::router::SharedService;

#[derive(Serialize)]
struct ScenesResponse {
    scenes: Vec<String>,
}

pub(super) async fn get_lighting_scenes(State(service): State<SharedService>) -> impl IntoResponse {
    let service = service.lock().await;

    Json(ScenesResponse {
        scenes: service.fetch_lighting_scenes(),
    })
}

pub(super) async fn post_beamer_on(State(service): State<SharedService>) -> impl IntoResponse {
    let service = service.lock().await;

    match service.beamer_power_on().await {
        Ok(()) => StatusCode::OK,
        Err(e) => {
            error!("Failed to turn on beamer: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}

pub(super) async fn post_beamer_off(State(service): State<SharedService>) -> impl IntoResponse {
    let service = service.lock().await;

    match service.beamer_power_off().await {
        Ok(()) => StatusCode::OK,
        Err(e) => {
            error!("Failed to turn off beamer: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}
