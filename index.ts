import { ReadStream } from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

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
    form.append("file", data, filename)

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