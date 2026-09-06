use std::{time::Duration, vec};

use anyhow::Result;
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    net::TcpStream,
};

use crate::service::ptmahdbt42::{request::build_request_package, response::parse_response_buffer};

mod request;
mod response;

pub(crate) use request::{Body, Method, Request};
pub(crate) use response::Response;

const CRLF: &[u8; 2] = &[0x0D, 0x0A];
const LFLF: &[u8; 2] = &[0x0A, 0x0A];

const CMD_BEAMER_PON: &str = "{CMD=>Send_H_4_4:02 50 4F 4E 03";
const CMD_BEAMER_POF: &str = "{CMD=>Send_H_4_4:02 50 4F 46 03";

pub(crate) enum BeamerCommand {
    PowerOn,
    PowerOff,
}

impl std::fmt::Display for BeamerCommand {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let command_str = match self {
            BeamerCommand::PowerOn => CMD_BEAMER_PON,
            BeamerCommand::PowerOff => CMD_BEAMER_POF,
        };
        write!(f, "{}", command_str)
    }
}

pub(crate) async fn execute_request(request: &Request) -> Result<Response> {
    let mut stream = TcpStream::connect(request.addr()).await?;

    let request_buf = build_request_package(request);
    stream.write_all(&request_buf).await?;

    let mut response_buf: Vec<u8> = vec![];
    tokio::time::timeout(
        Duration::from_millis(1000),
        stream.read_to_end(&mut response_buf),
    )
    .await??;

    stream.shutdown().await?;

    parse_response_buffer(response_buf)
}
