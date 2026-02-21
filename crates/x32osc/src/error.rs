#[derive(Debug)]
pub enum X32OscError {
    SocketBindError(std::io::Error),
    SocketSendError(std::io::Error),
    OscEncodeError(rosc::OscError),
    OscDecodeError(rosc::OscError),
}

impl std::fmt::Display for X32OscError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            X32OscError::SocketBindError(e) =>
                write!(f, "Failed to bind socket: {e}"),
            X32OscError::SocketSendError(e) =>
                write!(f, "Failed to send data: {e}"),
            X32OscError::OscEncodeError(e) =>
                write!(f, "OSC encoding error: {e}"),
            X32OscError::OscDecodeError(e) =>
                write!(f, "OSC decoding error: {e}"),
        }
    }
}

impl std::error::Error for X32OscError {}
