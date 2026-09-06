use std::net::{Ipv4Addr, SocketAddr, UdpSocket};

use crate::{error::ArtNetError, package::ArtNetPackage};

pub fn create_artnet_socket() -> Result<UdpSocket, ArtNetError> {
    let socket = UdpSocket::bind(SocketAddr::from((Ipv4Addr::UNSPECIFIED, 0)))
        .map_err(|e| ArtNetError::BindSocketError { source: e })?;
    socket
        .set_broadcast(false)
        .map_err(|e| ArtNetError::SetBroadcastError { source: e })?;

    Ok(socket)
}

pub fn send_artnet_package(
    socket: &UdpSocket,
    target_addr: &SocketAddr,
    package: &ArtNetPackage,
) -> Result<(), ArtNetError> {
    socket
        .send_to(package, target_addr)
        .map_err(|e| ArtNetError::SendDataError { source: e })?;
    Ok(())
}
