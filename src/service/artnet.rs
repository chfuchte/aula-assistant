pub(crate) type ArtNetUniverse = u16;
pub(crate) type ArtNetData = [u8; 512];
pub(crate) type ArtNetPackage = [u8; 530];
pub(crate) type DMXChannel = u16;
pub(crate) type DMXData = u8;

/// see also https://art-net.org.uk/downloads/art-net.pdf
pub(crate) fn build_artnet_package(universe: &ArtNetUniverse, data: &ArtNetData) -> ArtNetPackage {
    const ARTNET_NAME: &[u8; 8] = b"Art-Net\0";
    const ARTNET_VERSION: u8 = 14;
    const ARTNET_OPCODE: u8 = 80;

    let h_uni = (universe >> 8) as u8;
    let l_uni = (universe & 0xff) as u8;
    let h_len = (data.len() >> 8) as u8;
    let l_len = (data.len() & 0xff) as u8;

    let package: [u8; 530] = std::array::from_fn(|i| match i {
        0..=7 => ARTNET_NAME[i],
        8 => 0,
        9 => ARTNET_OPCODE,
        10 => 0,
        11 => ARTNET_VERSION,
        12 => 0,
        13 => 0,
        14 => l_uni,
        15 => h_uni,
        16 => h_len,
        17 => l_len,
        18..=529 => data[i - 18],
        _ => unreachable!(),
    });

    package
}
