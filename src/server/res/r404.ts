import { IncomingMessage, ServerResponse } from "http";

function r404(res: ServerResponse, { filePath }: { filePath: string }) {
    res.statusCode = 404
    res.end(`File ${filePath} not found!`)
}

export { r404 }