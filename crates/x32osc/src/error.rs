#[derive(Debug)]
pub enum X32OscError {
    InvalidHost(std::net::AddrParseError),
    FailedToBindSocket(std::io::Error),
    FailedToSendData(std::io::Error),
    FailedToEncodeOscPacket(rosc::OscError),
    FailedToDecodeOscPacket(rosc::OscError),
    FailedToReciveData(std::io::Error),
}

impl std::fmt::Display for X32OscError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            X32OscError::InvalidHost(e) => write!(f, "invalid host: {}", e),
            X32OscError::FailedToBindSocket(e) => write!(f, "failed to bind socket: {}", e),
            X32OscError::FailedToSendData(e) => write!(f, "failed to send data: {}", e),
            X32OscError::FailedToEncodeOscPacket(e) => {
                write!(f, "failed to encode OSC packet: {}", e)
            }
            X32OscError::FailedToDecodeOscPacket(e) => {
                write!(f, "failed to decode OSC packet: {}", e)
            }
            X32OscError::FailedToReciveData(e) => write!(f, "failed to receive data: {}", e),
        }
    }
}

impl std::error::Error for X32OscError {}
