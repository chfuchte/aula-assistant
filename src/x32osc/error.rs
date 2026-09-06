use thiserror::Error;

#[derive(Error, Debug)]
pub enum X32OscError {
    #[error("failed to bind socket: {source}")]
    BindSocketError {
        #[source]
        source: std::io::Error,
    },

    #[error("failed to send data over socket: {source}")]
    SendDataError {
        #[source]
        source: std::io::Error,
    },

    #[error("failed to encode OSC packet: {source}")]
    EncodeOscPacketError {
        #[source]
        source: rosc::OscError,
    },

    #[error("failed to decode OSC packet: {source}")]
    DecodeOscPacketError {
        #[source]
        source: rosc::OscError,
    },

    #[error("failed to receive data over socket: {source}")]
    ReceiveDataError {
        #[source]
        source: std::io::Error,
    },

    #[error("failed to receive data over socket in time: {source}")]
    ReceiveTimeoutError {
        #[source]
        source: std::io::Error,
    },

    #[error("failed to connect socket: {source}")]
    ConnectError {
        #[source]
        source: std::io::Error,
    },
}
