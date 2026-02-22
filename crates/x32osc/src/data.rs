use rosc::OscPacket;

#[derive(Debug)]
pub enum X32OscRecievedData {
    ChannelMuteChange { channel: X32Channel, is_muted: bool },
    ChannelVolumeChange { channel: X32Channel, volume: f32 },
    Unhandled(OscPacket),
}

#[derive(Debug)]
pub enum X32Channel {
    Channel(u8),
    MC,
}

impl std::fmt::Display for X32Channel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            X32Channel::Channel(num) => write!(f, "/ch/{}", num),
            X32Channel::MC => write!(f, "/main/m"),
        }
    }
}

impl From<OscPacket> for X32OscRecievedData {
    fn from(paket: OscPacket) -> Self {
        match paket {
            OscPacket::Message(msg) => {
                if msg.addr.starts_with("/ch") && msg.addr.ends_with("/mix/on") {
                    if let Some(end_index) = msg.addr.find("/mix") {
                        if let Ok(channel) = msg.addr[3..end_index].parse::<usize>() {
                            if let Some(rosc::OscType::Int(is_muted_int)) = msg.args.get(0) {
                                return X32OscRecievedData::ChannelMuteChange {
                                    channel: X32Channel::Channel(channel as u8),
                                    is_muted: *is_muted_int == 0,
                                };
                            }
                        }
                    }
                    X32OscRecievedData::Unhandled(OscPacket::Message(msg))
                } else if msg.addr.starts_with("/ch") && msg.addr.ends_with("/mix/fader") {
                    if let Some(end_index) = msg.addr.find("/mix") {
                        if let Ok(channel) = msg.addr[3..end_index].parse::<usize>() {
                            if let Some(rosc::OscType::Float(volume)) = msg.args.get(0) {
                                return X32OscRecievedData::ChannelVolumeChange {
                                    channel: X32Channel::Channel(channel as u8),
                                    volume: *volume,
                                };
                            }
                        }
                    }
                    X32OscRecievedData::Unhandled(OscPacket::Message(msg))
                } else if msg.addr.starts_with("/main/m") && msg.addr.ends_with("/mix/on") {
                    if let Some(rosc::OscType::Int(is_muted_int)) = msg.args.get(0) {
                        return X32OscRecievedData::ChannelMuteChange {
                            channel: X32Channel::MC,
                            is_muted: *is_muted_int == 0,
                        };
                    }
                    X32OscRecievedData::Unhandled(OscPacket::Message(msg))
                } else if msg.addr.starts_with("/main/m") && msg.addr.ends_with("/mix/fader") {
                    if let Some(rosc::OscType::Float(volume)) = msg.args.get(0) {
                        return X32OscRecievedData::ChannelVolumeChange {
                            channel: X32Channel::MC,
                            volume: *volume,
                        };
                    }
                    X32OscRecievedData::Unhandled(OscPacket::Message(msg))
                } else {
                    X32OscRecievedData::Unhandled(OscPacket::Message(msg))
                }
            }
            _ => X32OscRecievedData::Unhandled(paket),
        }
    }
}
