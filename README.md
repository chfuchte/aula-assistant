# ATec Aula Assistant

Aula Assistant is a user-friendly media control system in the Gymnasium Riedberg auditorium.
It lets both trained staff and non-technical users operate the projector, sound system, and lighting,
while also offering advanced controls for technical staff.

## Table of Contents

- [Target Hardware and Environment](#target-hardware-and-environment)
    - [Hardware Details](#hardware-details)
- [License](#license)
- [Credits](#credits)

## Target Hardware and Environment

This software is designed primarily to run on a Raspberry Pi with a 7" capacitive touchscreen display with a resolution of 800 x 480. The web client should therefore be optimised for this display size and should never cause any overflow. However, the interface should be responsive and work well on laptops and other screen sizes too. As the target environment relies on touch input, which is often less precise than a mouse, all UI elements must be designed to work without the need for a keyboard or any other external input device.

### Hardware Details

For reference, here is a complete list of all hardware components used as part of the interface or as part of the target environment:

- [Raspberry Pi 4 Model B (8GB RAM)](https://www.berrybase.de/raspberry-pi-4-computer-modell-b-8gb-ram)
- [Raspberry Pi 7" capacitive touch display](https://www.berrybase.de/offizielles-raspberry-pi-7-display-mit-kapazitiven-touchscreen)
- [PureLink PT-MA-HDBT42 4x2 4K 18Gbps HDMI HDBaseT Matrix with Scaler](https://www.purelink.de/en/switcher-matrices/hdbaset/3433/4x2-4k-18gbps-hdmi-hdbaset-matrix-with-scaler)
- Panasonic PT-EX12K
- ENTTEC ODE Mk2 Ethernet to DMX converter

## License

This project is licensed under [GNU General Public License v3.0 or later](LICENSE.txt).

## Credits

- Art-Net™ Designed by and Copyright Artistic Licence. The Art-Net™ protocol specification can be found [here](https://art-net.org.uk/).
- Behringer X32 OSC API documentation can be found [here](https://wiki.munichmakerlab.de/images/1/17/UNOFFICIAL_X32_OSC_REMOTE_PROTOCOL_%281%29.pdf).
