/**
 * Created by Nidin Vinayakan on 17/01/17.
 */
export function toHex(value: number, size: number = 7): string {
    let hex: string = value.toString(16);
    let zero: string[] = [];
    for (let i = 0; i < size; i++) {
        zero.push("0");
    }
    let str = hex.split("");
    str.forEach((s) => {
        zero.shift();
        zero.push(s);
    });
    return zero.join("");
}

export function computeClassId(name: string): number {
    let n = name.length;
    for (let i = 0; i < name.length; i++) {
        let c = name.charAt(i);
        let v = 0;
        if (c >= 'A' && c <= 'Z')
            v = c.charCodeAt(0) - 'A'.charCodeAt(0);
        else if (c >= 'a' && c <= 'z')
            v = c.charCodeAt(0) - 'a'.charCodeAt(0) + 26;
        else if (c >= '0' && c <= '9')
            v = c.charCodeAt(0) - '0'.charCodeAt(0) + 52;
        else if (c == '_')
            v = 62;
        else if (c == '>')
            v = 63;
        else
            throw "Bad character in class name: " + c;
        n = (((n & 0x1FFFFFF) << 3) | (n >>> 25)) ^ v;
    }
    return n;
}