use std::{net::SocketAddr, sync::Arc};

use anyhow::{Ok, Result};
use axum::{
    Router,
    routing::{any, get, post},
};
use tokio::{net::TcpListener, sync::Mutex};
use tracing::info;

use crate::{
    router::{assets, http, ws},
    service::AulaAssistantService,
};

pub(super) type SharedService = Arc<Mutex<AulaAssistantService>>;

pub(crate) async fn run_web_server(port: u16, service: AulaAssistantService) -> Result<()> {
    let shared_service: SharedService = Arc::new(Mutex::new(service));

    let app = Router::new()
        // beamer
        .route("/api/beamer/on", post(http::post_beamer_on))
        .route("/api/beamer/off", post(http::post_beamer_off))
        // lighting
        .route("/api/lighting/scenes", get(http::get_lighting_scenes))
        // websockets
        .route("/ws", any(ws::handler))
        // frontend assets
        .fallback(assets::static_handler)
        .with_state(shared_service);

    let listener = TcpListener::bind(SocketAddr::from(([0, 0, 0, 0], port))).await?;
    info!("Web server up and running: http://0.0.0.0:{}", port);

    axum::serve(listener, app).await?;

    Ok(())
}
