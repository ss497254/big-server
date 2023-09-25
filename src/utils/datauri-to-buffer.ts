export interface MimeBuffer extends Buffer {
  type: string;
  typeFull: string;
  charset: string;
}

export function dataUriToBuffer(uri: string): MimeBuffer {
  uri = uri.replace(/\r?\n/g, "");

  // split the URI up into the "metadata" and the "data" portions
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }

  // remove the "data:" scheme and parse the metadata
  const meta = uri.substring(5, firstComma).split(";");

  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else if (meta[i]) {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }

  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding) as MimeBuffer;

  // set `.type` and `.typeFull` properties to MIME type
  buffer.type = type;
  buffer.typeFull = typeFull;

  // set the `.charset` property
  buffer.charset = charset;

  return buffer;
}

export default dataUriToBuffer;
