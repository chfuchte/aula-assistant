use thiserror::Error;

#[derive(Error, Debug)]
pub enum ArtNetError {
    #[error("failed to bind socket: {source}")]
    BindSocketError {
        #[source]
        source: std::io::Error,
    },

    #[error("failed to set broadcast: {source}")]
    SetBroadcastError {
        #[source]
        source: std::io::Error,
    },

    #[error("failed to send data over socket: {source}")]
    SendDataError {
        #[source]
        source: std::io::Error,
    },
}
