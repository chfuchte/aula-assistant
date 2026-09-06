use std::collections::HashMap;

use anyhow::{Result, anyhow};

use crate::service::ptmahdbt42::{CRLF, LFLF};

pub(crate) struct Response {
    http_version: String,
    status_code: u16,
    status_message: String,
    header: HashMap<String, String>,
    body: Option<String>,
}

impl Response {
    pub(crate) fn new() -> Self {
        Self {
            http_version: String::new(),
            status_code: 0,
            status_message: String::new(),
            header: HashMap::new(),
            body: None,
        }
    }

    pub(crate) fn http_version(&self) -> &str {
        &self.http_version
    }

    pub(crate) fn status_code(&self) -> u16 {
        self.status_code
    }

    pub(crate) fn status_message(&self) -> &str {
        &self.status_message
    }

    pub(crate) fn header(&self) -> &HashMap<String, String> {
        &self.header
    }

    pub(crate) fn body(&self) -> Option<&String> {
        self.body.as_ref()
    }
}

pub(super) fn parse_response_buffer(buf: Vec<u8>) -> Result<Response> {
    let (headers, body) = buf.split_at(
        buf.windows(2)
            .position(|window| window == LFLF)
            .ok_or(anyhow!("Invalid response"))?,
    );

    let header_lines: Vec<&[u8]> = headers.split(|b| b == &CRLF[0] || b == &CRLF[1]).collect();
    if header_lines.is_empty() {
        return Err(anyhow!("Invalid response"));
    }

    let http_version;
    let status_code;
    let status_message;

    {
        let status_line = header_lines[0];

        let status_line_str = String::from_utf8(status_line.to_vec())?;
        let status_parts: Vec<&str> = status_line_str.splitn(3, ' ').collect();
        if status_parts.len() < 3 {
            return Err(anyhow!("Invalid response"));
        }

        http_version = status_parts[0].to_string();
        status_code = status_parts[1].parse::<u16>()?;
        status_message = status_parts[2].to_string();
    }

    let mut header: HashMap<String, String> = HashMap::new();
    for line in &header_lines[1..] {
        let line_str = String::from_utf8(line.to_vec())?;
        if let Some((key, value)) = line_str.split_once(": ") {
            header.insert(key.to_string(), value.to_string());
        }
    }

    let body_str = if body.len() > 4 {
        Some(String::from_utf8(body[2..].to_vec())?)
    } else {
        None
    };

    let response = Response {
        body: body_str,
        http_version,
        status_code,
        status_message,
        header,
    };

    Ok(response)
}
