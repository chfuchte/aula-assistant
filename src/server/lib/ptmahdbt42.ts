import "@tanstack/react-start/server-only";

import { tryCatch } from "@/utils";
import { logger } from "@/utils/logger";
import net from "node:net";

const log = logger("lib.ptmahdbt42");

const CRLF = "\r\n";
const HEADER_BODY_SEPARATOR = "\r\n\r\n";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE";

export interface PTMAHDBT42RequestOptions {
    method: HttpMethod;
    path: string;
    headers?: Record<string, string>;
    body?: string | Uint8Array | Buffer | null;
}

interface PTMAHDBT42Request extends Required<Omit<PTMAHDBT42RequestOptions, "body">> {
    host: string;
    port: number;
    body: string | Uint8Array | Buffer | null;
}

export interface ParsedPTMAHDBT42Response {
    httpVersion: string;
    statusCode: number;
    statusMessage: string;
    headers: Record<string, string>;
    body: string;
}

export async function sendRS232Command(
    host: string,
    port: number,
    command: string,
    timeoutMs: number = 1000,
): Promise<boolean> {
    const requestOptions: PTMAHDBT42RequestOptions = {
        method: "POST",
        path: "/cgi-bin/MMX32_Keyvalue.cgi",
        body: `{CMD=>Send_H_4_4:${command}`, // no closing brace as the device expects
    };

    // ignoring the response for now, just checking for errors
    const [_response, error] = await tryCatch(fetchPTMAHDBT42(host, port, requestOptions, timeoutMs));
    if (error) {
        return false;
    }

    return true;
}

export async function fetchPTMAHDBT42(
    host: string,
    port: number,
    options: PTMAHDBT42RequestOptions,
    timeoutMs: number = 1000,
): Promise<ParsedPTMAHDBT42Response> {
    const request: PTMAHDBT42Request = {
        method: options.method,
        path: options.path,
        body: options.body ?? null,
        host,
        port,
        headers: {
            ...options.headers,
            Connection: "close",
        },
    };

    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        const chunks: Buffer[] = [];
        let settled = false;

        const timer = setTimeout(() => {
            fail(new Error(`PTMAHDBT42TcpService: request to ${host}:${port} timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        const cleanup = () => {
            clearTimeout(timer);
            client.removeAllListeners();
            client.destroy();
        };

        const succeed = (value: ParsedPTMAHDBT42Response) => {
            if (settled) return;
            settled = true;
            cleanup();
            resolve(value);
        };

        const fail = (err: Error) => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(err);
        };

        client.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });

        client.once("end", () => {
            try {
                succeed(parsePTMAHDBT42Response(Buffer.concat(chunks)));
            } catch (err) {
                fail(err instanceof Error ? err : new Error(String(err)));
            }
        });

        client.once("error", fail);

        client.connect(port, host, () => {
            client.write(buildRequestPackage(request));
        });
    });
}

function buildRequestPackage(request: PTMAHDBT42Request): Buffer {
    const bodyBuffer = toBodyBuffer(request.body);

    const headerLines: string[] = [`${request.method} ${request.path} HTTP/1.0`];

    const hasHostHeader = Object.keys(request.headers).some((key) => key.toLowerCase() === "host");
    if (!hasHostHeader) {
        headerLines.push(request.port === 80 ? `Host: ${request.host}` : `Host: ${request.host}:${request.port}`);
    }

    for (const [key, value] of Object.entries(request.headers)) {
        headerLines.push(`${key}: ${value}`);
    }

    if (bodyBuffer !== null) {
        headerLines.push(`Content-Length: ${bodyBuffer.length}`);
    }

    const headerBuffer = Buffer.from(headerLines.join(CRLF) + CRLF + CRLF, "utf-8");

    return bodyBuffer !== null ? Buffer.concat([headerBuffer, bodyBuffer]) : headerBuffer;
}

function toBodyBuffer(body: string | Uint8Array | Buffer | null): Buffer | null {
    if (body === null) return null;
    if (typeof body === "string") return Buffer.from(body, "utf-8");
    return Buffer.from(body);
}

function parsePTMAHDBT42Response(buf: Buffer): ParsedPTMAHDBT42Response {
    const separatorIndex = buf.indexOf(HEADER_BODY_SEPARATOR);
    const headerBytes = separatorIndex === -1 ? buf : buf.subarray(0, separatorIndex);
    const bodyBytes =
        separatorIndex === -1 ? Buffer.alloc(0) : buf.subarray(separatorIndex + HEADER_BODY_SEPARATOR.length);

    const headerLines = headerBytes.toString("utf-8").split(CRLF);
    const [statusLine, ...fieldLines] = headerLines;

    const { httpVersion, statusCode, statusMessage } = parseStatusLine(statusLine);
    const headers = parseHeaderFields(fieldLines);

    return {
        httpVersion,
        statusCode,
        statusMessage,
        headers,
        body: bodyBytes.toString("utf-8"),
    };
}

function parseStatusLine(statusLine: string): {
    httpVersion: string;
    statusCode: number;
    statusMessage: string;
} {
    const [httpVersion, statusCodeRaw, ...messageParts] = statusLine.split(" ");
    return {
        httpVersion,
        statusCode: parseInt(statusCodeRaw, 10),
        statusMessage: messageParts.join(" "),
    };
}

function parseHeaderFields(lines: string[]): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const line of lines) {
        if (!line) continue;
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) continue;
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        headers[key] = value;
    }
    return headers;
}
