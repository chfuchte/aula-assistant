use std::{collections::HashMap, fmt::Display, net::SocketAddr};

use crate::service::ptmahdbt42::CRLF;

pub(crate) struct Request {
    addr: SocketAddr,
    method: Method,
    path: String,
    headers: HashMap<String, String>,
    body: Option<Body>,
}

impl Request {
    pub(crate) fn new(
        addr: SocketAddr,
        method: Method,
        path: String,
        headers: HashMap<String, String>,
        body: Option<Body>,
    ) -> Self {
        Request {
            addr,
            method,
            path,
            headers,
            body,
        }
    }

    pub(super) fn addr(&self) -> SocketAddr {
        self.addr
    }

    pub(super) fn method(&self) -> &Method {
        &self.method
    }

    pub(super) fn path(&self) -> &String {
        &self.path
    }

    pub(super) fn headers(&self) -> &HashMap<String, String> {
        &self.headers
    }

    pub(super) fn body(&self) -> Option<&Body> {
        self.body.as_ref()
    }
}

pub(crate) enum Method {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    HEAD,
    OPTIONS,
    CONNECT,
    TRACE,
}

impl Display for Method {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let method_str = match self {
            Method::GET => "GET",
            Method::POST => "POST",
            Method::PUT => "PUT",
            Method::DELETE => "DELETE",
            Method::PATCH => "PATCH",
            Method::HEAD => "HEAD",
            Method::OPTIONS => "OPTIONS",
            Method::CONNECT => "CONNECT",
            Method::TRACE => "TRACE",
        };
        write!(f, "{}", method_str)
    }
}

pub(crate) enum Body {
    String(String),
    Bytes(Vec<u8>),
}

impl Body {
    fn to_bytes(&self) -> &[u8] {
        match self {
            Body::String(s) => s.as_bytes(),
            Body::Bytes(b) => b,
        }
    }
}

pub(super) fn build_request_package(request: &Request) -> Vec<u8> {
    let mut request_vec: Vec<u8> = vec![];

    request_vec
        .extend_from_slice(format!("{} {} HTTP/1.0", request.method, request.path).as_bytes());
    request_vec.extend_from_slice(CRLF);

    if request.addr.port() == 80 {
        request_vec.extend_from_slice(format!("Host: {}", request.addr.ip()).as_bytes());
    } else {
        request_vec
            .extend_from_slice(format!("Host: {}:{}", request.addr.ip(), request.addr.port()).as_bytes());
    }
    request_vec.extend_from_slice(CRLF);

    for (header_name, header_value) in &request.headers {
        request_vec.extend_from_slice(format!("{}: {}", header_name, header_value).as_bytes());
        request_vec.extend_from_slice(CRLF);
    }

    if let Some(body) = &request.body {
        let body_bytes = body.to_bytes();
        request_vec.extend_from_slice(format!("Content-Length: {}", body_bytes.len()).as_bytes());
        request_vec.extend_from_slice(CRLF);
        request_vec.extend_from_slice(CRLF);
        request_vec.extend_from_slice(body_bytes);
    } else {
        request_vec.extend_from_slice(CRLF);
    }

    request_vec
}
