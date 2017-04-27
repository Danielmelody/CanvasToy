export function mixin(toObject: {}, fromObject: {}) {
    for (const property in fromObject) {
        if (toObject[property] instanceof Object) {
            mixin(toObject[property], fromObject[property]);
        } else {
            toObject[property] = fromObject[property];
        }
    }
}

export function getDomScriptText(script: HTMLScriptElement): string {

    if (!script) {
        return null;
    }

    let theSource = "";
    let currentChild = script.firstChild;

    while (currentChild) {
        if (currentChild.nodeType === 3) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    // Send the source to the shader object

}
