use anyhow::Result;
use clap::{ArgAction, arg, command, value_parser};

pub(crate) enum Mode {
    ShowLicense,
    ShowVersion,
    Serve(ServeArgs),
}

pub(crate) struct ServeArgs {
    port: u16,
}

impl ServeArgs {
    pub(crate) fn port(&self) -> u16 {
        self.port
    }
}

pub(crate) fn parse() -> Result<Mode> {
    let mut cmd = command!()
        .about(env!("CARGO_PKG_DESCRIPTION"))
        .next_line_help(false)
        .disable_version_flag(true)
        .color(clap::ColorChoice::Never)
        .arg(
            arg!(-v --version "Print version")
                .value_parser(value_parser!(bool))
                .action(ArgAction::SetTrue),
        )
        .arg(
            arg!(--license "Print license")
                .value_parser(value_parser!(bool))
                .action(ArgAction::SetTrue),
        )
        .subcommand(
            command!("serve")
                .about("Start the service and serve the web application")
                .arg(
                    arg!(-p --port <PORT> "Port to listen on")
                        .value_parser(value_parser!(u16))
                        .action(ArgAction::Set)
                        .default_value("3000"),
                ),
        );

    let matches = cmd.clone().get_matches();

    if matches.get_flag("version") {
        return Ok(Mode::ShowVersion);
    }

    if matches.get_flag("license") {
        return Ok(Mode::ShowLicense);
    }

    match matches.subcommand() {
        Some(("serve", sub_matches)) => {
            let port = *sub_matches
                .get_one::<u16>("port")
                .expect("port is required and has a default value");

            let args = ServeArgs { port };

            Ok(Mode::Serve(args))
        }
        _ => {
            cmd.print_help()?;
            Err(anyhow::anyhow!("No subcommand provided"))
        }
    }
}
