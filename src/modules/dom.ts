/**
 * Dumb way to organize, but anything dom-related will go here.
 */

/**
 * I have just about had it with having to use the second argument in "scrollTo"
 */
export function traverse(x: number, snap: boolean) {
    scrollTo({
        left: x,
        behavior: snap ? "auto" : "smooth"
    });
}

export function dragDoneTraverse(dif: number, pageWidth: number, pageNumber: number, snap: boolean = false) {

    if (Math.abs(dif) >= (pageWidth / 4)) {
        if (dif > 0) {
            traverse(pageWidth * (pageNumber + 1), snap);
        } else {
            traverse(pageWidth * (pageNumber - 1), snap);
        }

    } else {
        traverse(pageWidth * pageNumber, snap);
    }
}