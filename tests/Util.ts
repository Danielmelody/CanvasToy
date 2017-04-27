namespace jasmine {
    export interface ToyMatchers extends Matchers<any> {
        toBeEqualish(expected: any, expectationFailOutput?: any): boolean;
    }
}

namespace Testing {
    export const EPSILON = 0.00001;
    export function createCanvas(width: number, height: number) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.backgroundColor = "black";
        document.body.appendChild(canvas);
        return canvas;
    }
}

beforeAll(() => {
    jasmine.addMatchers({
        toBeEqualish: () => {
            const result = {
                compare: (actual: any, expected: any) => {
                    if (typeof (actual) === "number") {
                        return {
                            pass: Math.abs(actual - expected) < Testing.EPSILON,
                        };
                    }
                    if (actual.length !== expected.length) {
                        return {
                            pass: false,
                        };
                    }
                    for (let i = 0; i < actual.length; i++) {
                        if (isNaN(actual[i]) !== isNaN(expected[i])) {
                            return {
                                pass: false,
                            };
                        }
                        if (Math.abs(actual[i] - expected[i]) >= Testing.EPSILON) {
                            return {
                                pass: false,
                            };
                        }
                    }
                    return {
                        pass: true,
                    };
                },
            };
            return result;
        },
        toBeNotEqualish: () => {
            const result = {
                compare: (actual: any, expected: any) => {
                    if (typeof (actual) === "number") {
                        return {
                            pass: Math.abs(actual - expected) > Testing.EPSILON,
                        };
                    }
                    if (actual.length !== expected.length) {
                        return {
                            pass: true,
                        };
                    }
                    for (let i = 0; i < actual.length; i++) {
                        if (isNaN(actual[i]) !== isNaN(expected[i])) {
                            return {
                                pass: true,
                            };
                        }
                        if (Math.abs(actual[i] - expected[i]) >= Testing.EPSILON) {
                            return {
                                pass: true,
                            };
                        }
                    }
                    return {
                        pass: false,
                    };
                },
            };
            return result;
        },
    });
});
