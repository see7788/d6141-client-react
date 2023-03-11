const path = require('path');
//const wsPort = require('./package.json')["config"]["wsServer"]["port"];
const { resolve, relative, sep } = path;
const { readdirSync, existsSync, unlinkSync, readFileSync, createWriteStream } = require('fs');
var zlib = require('zlib');
var mime = require('mime-types');
function getFilesSync(dir, files = []) {
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const entryPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      getFilesSync(entryPath, files);
    } else {
      files.push(entryPath);
    }
  });
  return files;
}

function coherseToBuffer(input) {
  return Buffer.isBuffer(input) ? input : Buffer.from(input);
}

function cleanAndOpen(path) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
  return createWriteStream(path, { flags: "w+" });
}


class ProgmemGenerator {
  options
  constructor(outputPath,fileClassName= "WwwCpp") {
    this.options = {
      fileClassName,
      outputPath,//: path.join(__dirname, fileClassName + '.h'),
      bytesPerLine: 20,
      indent: "  ",
      includes: "#include <SPIFFS.h>\n\n#include <AsyncTCP.h>\n\n#include <ESPAsyncWebServer.h>\n\n"
    };
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      { name: 'ProgmemGenerator' },
      (compilation, callback) => {
        const { outputPath, bytesPerLine, indent, includes } = this.options;
        const fileInfo = [];
        const writeStream = cleanAndOpen(resolve(compilation.options.context, outputPath));
        try {
          const writeIncludes = () => {
            writeStream.write(includes);
          };

          const writeFile = (relativeFilePath, buffer) => {
            const variable = "ESP_REACT_DATA_" + fileInfo.length;
            const mimeType = mime.lookup(relativeFilePath);
            var size = 0;
            //writeStream.write("const uint8_t " + variable + "[]  = {");//
             writeStream.write("const uint8_t " + variable + "[] PROGMEM = {");
            const zipBuffer = zlib.gzipSync(buffer);
            zipBuffer.forEach((b) => {
              if (!(size % bytesPerLine)) {
                writeStream.write("\n");
                writeStream.write(indent);
              }
              writeStream.write("0x" + ("00" + b.toString(16).toUpperCase()).substr(-2) + ",");
              size++;
            });
            if (size % bytesPerLine) {
              writeStream.write("\n");
            }
            writeStream.write("};\n\n");//
            fileInfo.push({
              uri: '/' + relativeFilePath.replace(sep, '/'),
              mimeType,
              variable,
              size
            });
          };

          const writeFiles = () => {
            // process static files
            const buildPath = compilation.options.output.path;
            for (const filePath of getFilesSync(buildPath)) {
              const readStream = readFileSync(filePath);
              const relativeFilePath = relative(buildPath, filePath);
              writeFile(relativeFilePath, readStream);
            }
            // process assets
            const { assets } = compilation;
            Object.keys(assets).forEach((relativeFilePath) => {
              writeFile(relativeFilePath, coherseToBuffer(assets[relativeFilePath].source()));
            });
          };
          const generateWWWClass = () => {
            // eslint-disable-next-line max-len
            return `
class ${this.options.fileClassName} {
${indent}public:
${indent.repeat(2)}static void registerRoutes(AsyncWebServer *server) {
${indent.repeat(3)}auto handler=[server](const String& uri, const String& contentType, const uint8_t* content, size_t len) {
  ArRequestHandlerFunction requestHandler = [contentType, content, len](AsyncWebServerRequest* request) {
    AsyncWebServerResponse* response = request->beginResponse_P(200, contentType, content, len);
    response->addHeader("Content-Encoding", "gzip");
    request->send(response);
  };
  server->on(uri.c_str(), HTTP_GET, requestHandler);};
${fileInfo.map((file) => {
              const indexHtml = file.uri === "/index.html" ? `\n${indent.repeat(3)}handler("/", "${file.mimeType}", ${file.variable}, ${file.size});` : "";
              return `${indent.repeat(3)}handler("${file.uri}", "${file.mimeType}", ${file.variable}, ${file.size});${indexHtml}`
            }).join('\n')
              }
${indent.repeat(2)}}
};
`
          };
          const writeWWWClass = () => {
            writeStream.write(generateWWWClass());
          };
          writeIncludes();
          writeFiles();
          writeWWWClass();
          writeStream.on('finish', () => {
            callback();
          });
        } finally {
          writeStream.end();
        }
      }
    );
  }
}

module.exports = ProgmemGenerator;
