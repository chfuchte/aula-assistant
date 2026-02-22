use crate::state::AppState;
use std::{
    net::SocketAddr,
    sync::{Arc, Mutex},
};
use x32osc::{
    X32OscRecievedData, register_receive_x32osc_packet_handler, send_x32_status, send_x32_xremote,
};

fn handle_x32osc_packet(addr: &SocketAddr, data: X32OscRecievedData) -> bool {
    log::debug!("Received OSC packet from address {}: {:?}", addr, data);
    true
}

pub(crate) fn register_x32osc_listeners(state: &Mutex<AppState>) -> () {
    let (x32_socket, x32_target) = {
        let app_state = state.lock().expect("failed to lock AppState");
        (app_state.x32_socket(), app_state.x32_target().clone())
    };

    let recv_socket = Arc::clone(&x32_socket);
    std::thread::spawn(move || {
        register_receive_x32osc_packet_handler(&recv_socket, handle_x32osc_packet, |err| {
            log::error!("Error receiving OSC packet: {}", err);
            false
        })
        .expect("failed to register OSC packet handler");
    });

    let send_socket = Arc::clone(&x32_socket);
    std::thread::spawn(move || {
        loop {
            send_x32_status(&send_socket, &x32_target).expect("failed to send X32 status");
            send_x32_xremote(&send_socket, &x32_target).expect("failed to send X32 xremote");
            std::thread::sleep(std::time::Duration::from_secs(2));
        }
    });
}
