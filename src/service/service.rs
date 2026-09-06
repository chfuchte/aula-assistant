use std::{
    collections::HashMap,
    net::{Ipv4Addr, SocketAddr},
};

use anyhow::Result;
use rosc::{OscPacket, encoder::encode};
use tokio::net::UdpSocket;

use crate::{
    config::{ConfigFile, LightingConfig},
    service::{
        artnet::{
            ArtNetData, ArtNetPackage, ArtNetUniverse, DMXChannel, DMXData, build_artnet_package,
        },
        ptmahdbt42,
    },
};

const OSC_LISTEN_PORT: u16 = 10024;

pub(crate) struct AulaAssistantService {
    artnet_socket: UdpSocket,
    artnet_target_addr: SocketAddr,
    artnet_data: Vec<ArtNetData>,
    artnet_scenes: Vec<ArtNetScene>,

    osc_socket: UdpSocket,
    osc_target_addr: SocketAddr,

    beamer_target_addr: SocketAddr,
}

impl AulaAssistantService {
    pub(crate) async fn new(config: &ConfigFile) -> Result<Self> {
        let artnet_socket = UdpSocket::bind(SocketAddr::from((Ipv4Addr::UNSPECIFIED, 0))).await?;
        artnet_socket.set_broadcast(config.lighting().broadcast())?;

        let osc_socket = UdpSocket::bind(SocketAddr::from((
            Ipv4Addr::new(0, 0, 0, 0),
            OSC_LISTEN_PORT,
        )))
        .await?;

        Ok(AulaAssistantService {
            artnet_socket,
            artnet_target_addr: config.lighting().target().to_socket_addr()?,
            artnet_data: vec![[0; 512]; config.lighting().max_universe() as usize + 1],
            artnet_scenes: config.lighting().into(),
            osc_socket,
            osc_target_addr: config.audio().target().to_socket_addr()?,
            beamer_target_addr: config.beamer().target().to_socket_addr()?,
        })
    }

    pub(crate) async fn beamer_power_on(&self) -> Result<()> {
        self.send_beamer_command(ptmahdbt42::BeamerCommand::PowerOn)
            .await?;

        Ok(())
    }

    pub(crate) async fn beamer_power_off(&self) -> Result<()> {
        self.send_beamer_command(ptmahdbt42::BeamerCommand::PowerOff)
            .await?;
        Ok(())
    }

    pub(crate) fn fetch_lighting_scenes(&self) -> Vec<String> {
        let scene_names: Vec<String> = self
            .artnet_scenes
            .iter()
            .map(|scene| scene.0.clone())
            .collect();

        scene_names
    }

    pub(crate) async fn go_lighting_scene(&mut self, scene_index: usize) -> Result<()> {
        if scene_index >= self.artnet_scenes.len() {
            anyhow::bail!("Invalid scene index: {}", scene_index);
        }

        let (_, scene) = &self.artnet_scenes[scene_index];

        for fixture_data in scene {
            for (universe, channel, value) in fixture_data {
                if *universe as usize >= self.artnet_data.len() {
                    self.artnet_data.resize(*universe as usize + 1, [0; 512]);
                }

                self.artnet_data[*universe as usize][*channel as usize] = *value;
            }
        }

        self.send_artnet_packages().await?;

        Ok(())
    }

    async fn send_artnet_packages(&self) -> Result<()> {
        let mut package: ArtNetPackage;

        for (i, data) in self.artnet_data.iter().enumerate() {
            package = build_artnet_package(&(i as ArtNetUniverse), data);
            self.artnet_socket
                .send_to(&package, &self.artnet_target_addr)
                .await?;
        }

        Ok(())
    }

    async fn send_beamer_command(&self, command: ptmahdbt42::BeamerCommand) -> Result<()> {
        let request = ptmahdbt42::Request::new(
            self.beamer_target_addr,
            ptmahdbt42::Method::Post,
            "/cgi-bin/MMX32_Keyvalue.cgi".to_string(),
            HashMap::new(),
            Some(ptmahdbt42::Body::String(command.to_string())),
        );

        let _response = ptmahdbt42::execute_request(&request).await?;

        Ok(())
    }

    async fn send_osc_packet(&self, packet: &OscPacket) -> Result<()> {
        let package = encode(packet)?;

        self.osc_socket
            .send_to(&package, &self.osc_target_addr)
            .await?;

        Ok(())
    }
}

type ArtNetScene = (String, Vec<Vec<(ArtNetUniverse, DMXChannel, DMXData)>>);

impl From<&LightingConfig> for Vec<ArtNetScene> {
    fn from(config: &LightingConfig) -> Self {
        let mut scenes: Vec<ArtNetScene> = Vec::with_capacity(config.scenes().len());

        let fixture_types = config.fixture_types();
        let fixtures = config.fixtures();

        for scene in config.scenes() {
            let scene_name = scene.name().to_string();

            let mut scene_data = vec![];

            if scene.reset() {
                for universe in 0..=config.max_universe() {
                    for channel in 0..512 {
                        scene_data.push(vec![(universe, channel, 0)]);
                    }
                }
            }

            for fixture_state in scene.fixture_states() {
                let fixture = fixtures
                    .iter()
                    .find(|f| f.id() == fixture_state.fixture_id())
                    .expect("Fixture not found");

                let fixture_type = fixture_types
                    .iter()
                    .find(|ft| ft.id() == fixture.fixture_type())
                    .expect("Fixture type not found");

                let universe = fixture.dmx_universe();
                let channel_offset = fixture.dmx_start_address();
                let channel_index = fixture_type
                    .channels()
                    .iter()
                    .position(|c| c == fixture_state.channel_id())
                    .expect("Channel not found");
                let channel = channel_offset + (channel_index as DMXChannel);

                scene_data.push(vec![(universe, channel, fixture_state.value())]);
            }

            scenes.push((scene_name, scene_data));
        }

        scenes
    }
}
