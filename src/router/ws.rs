use axum::{
    extract::{
        State,
        ws::{Message, Utf8Bytes, WebSocket, WebSocketUpgrade},
    },
    response::IntoResponse,
};
use futures::{sink::SinkExt, stream::StreamExt};
use tracing::info;

use crate::router::router::SharedService;

pub(super) async fn handler(
    ws: WebSocketUpgrade,
    State(service): State<SharedService>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, service))
}

async fn handle_socket(socket: WebSocket, _service: SharedService) {
    let (mut sender, mut receiver) = socket.split();

    while let Some(Ok(msg)) = receiver.next().await {
        let Message::Text(text) = msg else { continue };

        info!("Received WebSocket message: {}", text);

        let payload = Utf8Bytes::from_static("OK");

        if sender.send(Message::Text(payload)).await.is_err() {
            break;
        }
    }
}
