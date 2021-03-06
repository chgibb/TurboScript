import * as fs from "fs";
import * as child from "child_process";
import * as path from "path";

//Windows spawn work around
let spawnSync: any = child.spawnSync;
if (process.platform === 'win32') {
    spawnSync = (cmd: string, args: string[]) => {
        return child.spawnSync(path.join(__dirname, '../../node-v8/bin/node.exe'), [cmd].concat(args));
    }
}

/**
 * Compile TurboScript to WebAssembly and instantiate synchronously
 * @param sourcePath
 * @param outputFile
 * @returns {WebAssembly.Instance}
 */
export function getWasmInstanceSync(sourcePath: string, imports: any = {}, outputFile?: string): WebAssembly.Instance {
    outputFile = outputFile || getDefaultOutputFile(sourcePath);
    clean(outputFile);
    const compileInfo = spawnSync(path.join(__dirname, '../../bin/tc'), [sourcePath, '--out', outputFile]);
    if (compileInfo.status > 0) {
        throw new Error(`Compile Error! \n${compileInfo.stderr}\n${compileInfo.stdout}`);
    }
    const data = fs.readFileSync(outputFile);
    const mod = new WebAssembly.Module(data);
    return new WebAssembly.Instance(mod, imports);
}

/**
 * Compile TurboScript to WebAssembly and asynchronous instantiate
 * @param sourcePath
 * @param outputFile
 * @returns {Promise<Instance>}
 */
export async function getWasmInstance(sourcePath: string, imports: any = {}, outputFile?: string): Promise<WebAssembly.Instance> {
    outputFile = outputFile || getDefaultOutputFile(sourcePath);
    clean(outputFile);
    const compileInfo = spawnSync(path.join(__dirname, '../../bin/tc'), [sourcePath, '--out', outputFile]);
    if (compileInfo.status > 0) {
        throw new Error(`Compile Error! \n${compileInfo.stderr}\n${compileInfo.stdout}`);
    }
    const data = fs.readFileSync(outputFile);
    const result: WebAssembly.ResultObject = await WebAssembly.instantiate(data, imports);
    return result.instance;
}

/**
 * Clean old output file if exists
 * @param file 
 */
function clean(file: string) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

function getDefaultOutputFile(inputFile: string): string {
    const sep = path.sep;
    let fileName = inputFile.substring(inputFile.lastIndexOf(sep), inputFile.length);
    let folderName = inputFile.substring(0, inputFile.lastIndexOf(sep));
    return `${folderName}${sep}bin${sep}${fileName.replace(".tbs", ".wasm")}`;
}
