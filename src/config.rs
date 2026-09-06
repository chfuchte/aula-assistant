use std::{
    net::{SocketAddr, ToSocketAddrs},
    path::PathBuf,
};

use anyhow::{Context, Ok, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ConfigFile {
    audio: AudioConfig,
    beamer: BeamerConfig,
    lighting: LightingConfig,
}

impl ConfigFile {
    pub(crate) fn audio(&self) -> &AudioConfig {
        &self.audio
    }

    pub(crate) fn beamer(&self) -> &BeamerConfig {
        &self.beamer
    }

    pub(crate) fn lighting(&self) -> &LightingConfig {
        &self.lighting
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct AudioConfig {
    target: Address,
    default_scene: u8,
    channels: Vec<AudioChannel>,
}

impl AudioConfig {
    pub(crate) fn target(&self) -> &Address {
        &self.target
    }

    pub(crate) fn default_scene(&self) -> &u8 {
        &self.default_scene
    }

    pub(crate) fn channels(&self) -> &[AudioChannel] {
        &self.channels
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct AudioChannel {
    name: String,
    path: String,
}

impl AudioChannel {
    pub(crate) fn name(&self) -> &str {
        &self.name
    }

    pub(crate) fn path(&self) -> &str {
        &self.path
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct BeamerConfig {
    target: Address,
}

impl BeamerConfig {
    pub(crate) fn target(&self) -> &Address {
        &self.target
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct LightingConfig {
    target: Address,
    broadcast: bool,
    fixture_types: Vec<LightingFixtureType>,
    fixtures: Vec<LightingFixture>,
    scenes: Vec<LightingScene>,
}

impl LightingConfig {
    pub(crate) fn target(&self) -> &Address {
        &self.target
    }

    pub(crate) fn broadcast(&self) -> bool {
        self.broadcast
    }

    pub(crate) fn fixture_types(&self) -> &[LightingFixtureType] {
        &self.fixture_types
    }

    pub(crate) fn fixtures(&self) -> &[LightingFixture] {
        &self.fixtures
    }

    pub(crate) fn scenes(&self) -> &[LightingScene] {
        &self.scenes
    }

    pub(crate) fn max_universe(&self) -> u16 {
        self.fixtures
            .iter()
            .map(|fixture| fixture.dmx_universe())
            .max()
            .unwrap_or(0)
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct LightingFixtureType {
    id: String,
    channels: Vec<String>,
}

impl LightingFixtureType {
    pub(crate) fn id(&self) -> &str {
        &self.id
    }

    pub(crate) fn channels(&self) -> &[String] {
        &self.channels
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct LightingFixture {
    id: String,
    fixture_type: String,
    dmx_universe: u16,
    dmx_start_address: u16,
}

impl LightingFixture {
    pub(crate) fn id(&self) -> &str {
        &self.id
    }

    pub(crate) fn fixture_type(&self) -> &str {
        &self.fixture_type
    }

    pub(crate) fn dmx_universe(&self) -> u16 {
        self.dmx_universe
    }

    pub(crate) fn dmx_start_address(&self) -> u16 {
        self.dmx_start_address
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct LightingScene {
    name: String,
    reset: bool,
    fixture_states: Vec<LightingFixtureState>,
}

impl LightingScene {
    pub(crate) fn name(&self) -> &str {
        &self.name
    }

    pub(crate) fn reset(&self) -> bool {
        self.reset
    }

    pub(crate) fn fixture_states(&self) -> &[LightingFixtureState] {
        &self.fixture_states
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct LightingFixtureState {
    pub(crate) fixture_id: String,
    pub(crate) channel_id: String,
    pub(crate) value: u8,
}

impl LightingFixtureState {
    pub(crate) fn fixture_id(&self) -> &str {
        &self.fixture_id
    }

    pub(crate) fn channel_id(&self) -> &str {
        &self.channel_id
    }

    pub(crate) fn value(&self) -> u8 {
        self.value
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) enum Address {
    Ip { ip: String, port: u16 },
    Domain { domain: String, port: u16 },
}

impl Address {
    pub(crate) fn to_socket_addr(&self) -> Result<SocketAddr> {
        let socket_addr = match self {
            Address::Ip { ip, port } => {
                let ip_addr = ip.parse().context("Failed to parse IP address")?;
                SocketAddr::new(ip_addr, *port)
            }
            Address::Domain { domain, port } => {
                let addrs = (domain.as_str(), *port)
                    .to_socket_addrs()
                    .context("Failed to resolve domain name")?;
                addrs
                    .into_iter()
                    .next()
                    .context("No addresses found for domain")?
            }
        };

        Ok(socket_addr)
    }
}

pub(crate) fn load_config_from_file(path: &PathBuf) -> Result<ConfigFile> {
    let config_content = std::fs::read_to_string(path).context("Failed to read config file")?;
    let config: ConfigFile =
        serde_json::from_str(&config_content).context("Failed to parse config file")?;

    Ok(config)
}
