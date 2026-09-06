use std::{net::UdpSocket, time::Duration};

use rosc::{OscMessage, OscPacket, OscType, decoder::decode_udp, encoder::encode};

use crate::X32OscError;

pub struct X32OscClient {
    socket: std::net::UdpSocket,
    target_addr: std::net::SocketAddr,
}

impl X32OscClient {
    pub fn new(
        bind_addr: std::net::SocketAddr,
        target_addr: std::net::SocketAddr,
    ) -> Result<Self, X32OscError> {
        let socket =
            UdpSocket::bind(bind_addr).map_err(|e| X32OscError::BindSocketError { source: e })?;

        socket
            .connect(&target_addr)
            .map_err(|e| X32OscError::ConnectError { source: e })?;

        Ok(X32OscClient {
            socket,
            target_addr,
        })
    }

    pub fn ping(&self) -> Result<(), X32OscError> {
        let packet = OscPacket::Message(OscMessage {
            addr: "/status".to_string(),
            args: vec![],
        });

        self.send_osc_packet(&packet)?;

        let _response = self.try_receive_osc_packet()?;

        // TODO: check that the response is the correct one

        Ok(())
    }

    pub fn load_scene(&self, scene: u8) -> Result<(), X32OscError> {
        let packet = OscPacket::Message(OscMessage {
            addr: "/-action/goscene".to_string(),
            args: vec![OscType::Int(scene as i32)],
        });

        self.send_osc_packet(&packet)?;

        Ok(())
    }

    fn send_osc_packet(&self, packet: &OscPacket) -> Result<(), X32OscError> {
        let package =
            encode(packet).map_err(|e| X32OscError::EncodeOscPacketError { source: e })?;

        self.socket
            .send_to(&package, &self.target_addr)
            .map_err(|e| X32OscError::SendDataError { source: e })?;
        Ok(())
    }

    fn try_receive_osc_packet(&self) -> Result<OscPacket, X32OscError> {
        self.socket
            .set_read_timeout(Some(Duration::from_secs(2)))
            .map_err(|e| X32OscError::ReceiveTimeoutError { source: e })?;

        let mut buf = [0u8; rosc::decoder::MTU];

        let (size, _) = self
            .socket
            .recv_from(&mut buf)
            .map_err(|e| X32OscError::ReceiveDataError { source: e })?;

        let (_, packet) = decode_udp(&buf[..size])
            .map_err(|e| X32OscError::DecodeOscPacketError { source: e })?;

        Ok(packet)
    }
}
