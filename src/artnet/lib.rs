mod error;
mod package;
mod socket;

pub use error::ArtNetError;
pub use package::{ArtNetData, ArtNetPackage, ArtNetUniverse, build_artnet_package};
pub use socket::{create_artnet_socket, send_artnet_package};
pub static ARTNET_PORT: u16 = 6454;
