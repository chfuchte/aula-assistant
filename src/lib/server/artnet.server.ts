const PACKET_SIZE = 530;
const DATA_SIZE = 512;

export function buildArtNetPackage(universe: number, data: Uint8Array | Uint8ClampedArray): Uint8Array {
    const hUni = (universe >> 8) & 0xff;
    const lUni = universe & 0xff;
    const hLen = (DATA_SIZE >> 8) & 0xff;
    const lLen = DATA_SIZE & 0xff;

    const pkg = new Uint8Array(PACKET_SIZE);

    // Art-Net header
    pkg[0] = "A".charCodeAt(0);
    pkg[1] = "r".charCodeAt(0);
    pkg[2] = "t".charCodeAt(0);
    pkg[3] = "-".charCodeAt(0);
    pkg[4] = "N".charCodeAt(0);
    pkg[5] = "e".charCodeAt(0);
    pkg[6] = "t".charCodeAt(0);
    pkg[7] = 0;
    pkg[8] = 0;
    pkg[9] = 80; // OpCode
    pkg[10] = 0;
    pkg[11] = 14; // Version
    pkg[12] = 0;
    pkg[13] = 0;
    pkg[14] = lUni;
    pkg[15] = hUni;
    pkg[16] = hLen;
    pkg[17] = lLen;

    // Art-Net data
    pkg.set(data, 18);

    return pkg;
}
