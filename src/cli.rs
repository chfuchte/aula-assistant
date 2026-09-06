use std::path::PathBuf;

use anyhow::Result;
use clap::{ArgAction, arg, command, value_parser};

pub(crate) enum Mode {
    ShowLicense,
    ShowVersion,
    Serve(ServeArgs),
}

pub(crate) struct ServeArgs {
    port: u16,
    config_file_path: PathBuf,
}

impl ServeArgs {
    pub(crate) fn port(&self) -> u16 {
        self.port
    }

    pub(crate) fn config_file_path(&self) -> &PathBuf {
        &self.config_file_path
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
                )
                .arg(
                    arg!(-c --config <CONFIG> "Path to the configuration file")
                        .value_parser(value_parser!(PathBuf))
                        .action(ArgAction::Set),
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

            let config_file_path = sub_matches
                .get_one::<PathBuf>("config")
                .cloned()
                .expect("config file path is required");

            let args = ServeArgs {
                port,
                config_file_path,
            };

            Ok(Mode::Serve(args))
        }
        _ => {
            cmd.print_help()?;
            Err(anyhow::anyhow!("No subcommand provided"))
        }
    }
}
