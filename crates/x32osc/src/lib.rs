use crate::{data::X32Channel, error::X32OscError};
use rosc::{OscMessage, OscPacket, OscType, decoder::decode_udp, encoder::encode};
use std::net::{SocketAddr, UdpSocket};

mod data;

pub mod error;

#[cfg(test)]
mod test;

pub use data::X32OscRecievedData;

pub fn create_x32osc_socket(bind_addr: SocketAddr) -> Result<UdpSocket, X32OscError> {
    let socket = UdpSocket::bind(bind_addr).map_err(X32OscError::FailedToBindSocket)?;
    Ok(socket)
}

fn send_x32osc_package(
    socket: &UdpSocket,
    target_addr: &SocketAddr,
    package: &Vec<u8>,
) -> Result<(), X32OscError> {
    socket
        .send_to(package, target_addr)
        .map_err(X32OscError::FailedToSendData)?;
    Ok(())
}

pub fn register_receive_x32osc_packet_handler(
    socket: &UdpSocket,
    on_packet: fn(addr: &SocketAddr, data: X32OscRecievedData) -> bool,
    on_error: fn(error: &X32OscError) -> bool,
) -> Result<(), X32OscError> {
    let mut buf = [0u8; rosc::decoder::MTU];

    loop {
        match socket.recv_from(&mut buf) {
            Ok((size, addr)) => match decode_udp(&buf[..size]) {
                Ok((_, packet)) => {
                    let data = X32OscRecievedData::from(packet);
                    if !on_packet(&addr, data) {
                        break;
                    }
                }
                Err(e) => {
                    let error = X32OscError::FailedToDecodeOscPacket(e);
                    if !on_error(&error) {
                        break;
                    }
                }
            },
            Err(e) => {
                let error = X32OscError::FailedToReciveData(e);
                if !on_error(&error) {
                    break;
                }
            }
        }
    }

    Ok(())
}

pub fn send_x32_status(socket: &UdpSocket, target_addr: &SocketAddr) -> Result<(), X32OscError> {
    let package = encode(&OscPacket::Message(OscMessage {
        addr: "/status".to_string(),
        args: vec![],
    }))
    .map_err(X32OscError::FailedToEncodeOscPacket)?;

    send_x32osc_package(socket, target_addr, &package)?;

    Ok(())
}

pub fn send_x32_xremote(socket: &UdpSocket, target_addr: &SocketAddr) -> Result<(), X32OscError> {
    let package = encode(&OscPacket::Message(OscMessage {
        addr: "/xremote".to_string(),
        args: vec![],
    }))
    .map_err(X32OscError::FailedToEncodeOscPacket)?;

    send_x32osc_package(socket, target_addr, &package)?;

    Ok(())
}

pub fn send_x32_load_scene(
    socket: &UdpSocket,
    target_addr: &SocketAddr,
    scene: u8,
) -> Result<(), X32OscError> {
    let package = encode(&OscPacket::Message(OscMessage {
        addr: "/-action/goscene".to_string(),
        args: vec![OscType::Int(scene as i32)],
    }))
    .map_err(X32OscError::FailedToEncodeOscPacket)?;

    send_x32osc_package(socket, target_addr, &package)?;

    Ok(())
}

pub fn send_x32_channel_set_mute(
    socket: &UdpSocket,
    target_addr: &SocketAddr,
    channel: &X32Channel,
    muted: bool,
) -> Result<(), X32OscError> {
    let package = encode(&OscPacket::Message(OscMessage {
        addr: format!("{}/mix/on", channel),
        args: vec![OscType::Bool(muted)],
    }))
    .map_err(X32OscError::FailedToEncodeOscPacket)?;

    send_x32osc_package(socket, target_addr, &package)?;

    Ok(())
}

pub fn send_x32_channel_set_volume(
    socket: &UdpSocket,
    target_addr: &SocketAddr,
    channel: &X32Channel,
    volume: f32,
) -> Result<(), X32OscError> {
    let package = encode(&OscPacket::Message(OscMessage {
        addr: format!("{}/mix/fader", channel),
        args: vec![OscType::Float(volume)],
    }))
    .map_err(X32OscError::FailedToEncodeOscPacket)?;

    send_x32osc_package(socket, target_addr, &package)?;

    Ok(())
}
