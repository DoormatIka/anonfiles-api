import { File } from 'buffer';
import { ReadStream } from 'fs';
import fetch, { FormData } from 'node-fetch';

export type Response = Success | Failure;
export type Failure = {
    status: boolean,
    error: {
        message: string,
        type: string,
        code: number
    }
}
export type Success = {
    status: boolean,
    data: {
        file: {
            url: {
                full: string,
                short: string,
            },
            metadata: {
                id: string,
                name: string,
                size: {
                    bytes: number,
                    readable: string
                }
            }
        }
    }
}
export const UploadErrorCodes = {
    10: "ERROR_FILE_NOT_PROVIDED",
    11: "ERROR_FILE_EMPTY",
    12: "ERROR_FILE_INVALID",
    20: "ERROR_USER_MAX_FILES_PER_HOUR_REACHED",
    21: "ERROR_USER_MAX_FILES_PER_DAY_REACHED",
    22: "ERROR_USER_MAX_BYTES_PER_HOUR_REACHED",
    23: "ERROR_USER_MAX_BYTES_PER_DAY_REACHED",
    30: "ERROR_FILE_DISALLOWED_TYPE",
    31: "ERROR_FILE_SIZE_EXCEEDED",
    32: "ERROR_FILE_BANNED",
    40: "STATUS_ERROR_SYSTEM_FAILURE"
}

export async function upload(
    data: ReadStream | Buffer, 
    filename: string
): Promise<Response> {
    const form = new FormData()
    if (data instanceof ReadStream) {
        form.set("file", blobToFile(await streamToBlob(data), filename));
    }
    if (data instanceof Buffer) {
        form.set("file", blobToFile(new Blob([data]), filename));
    }

    const f = await fetch('https://api.anonfiles.com/upload', {
        method: "POST",
        body: data
    });
    return await f.json() as Response;
}

export async function info(id: string): Promise<Response> {
    const f = await fetch(`https://api.anonfiles.com/v2/file/${id}/info`, {
        method: "GET"
    })
    return await f.json() as Response;
}

export function isUploadSuccess(res: Response): res is Success {
    return (res as Success).data !== undefined;
}

function streamToBlob(stream: ReadStream) {
    return new Promise<Blob>((res, rej) => {
        const chunks: (string | Buffer)[] = [];
        stream
            .on("data", chunk => chunks.push(chunk))
            .once("end", () => {
                res(new Blob(chunks));
            })
            .once("error", rej);
    });
}
function blobToFile(blob: Blob, name: string) {
    return new File([blob], name, { type: blob.type });
}