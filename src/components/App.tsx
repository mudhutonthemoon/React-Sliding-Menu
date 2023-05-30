import React, { useRef, useState } from "react";
import "../styles/app.css";
import { dragDoneTraverse, traverse } from "../modules/dom";

import Burger from "../assets/icons/list.svg";
import Close from "../assets/icons/x.svg";

type Page = {
    title: string,
    children: JSX.Element,
    class: string,
    down: boolean,
    iX: number,
    icon?: {
        element: JSX.Element,
        traversePos: number
    }
};

export function App(): JSX.Element {

    const [state, setState] = useState<{ totalWidth: number, width: number, isPortrait: boolean, pageItems: Array<Page> }>({

        totalWidth: 0,
        width: 0,
        isPortrait: false,

        pageItems: [
            {
                title: "Menu",
                children: <></>,
                class: "menu",
                down: false,
                iX: 0,
                icon: {
                    element: <Close />,
                    traversePos: 1,
                }
            },
            {
                title: "Content",
                children: <></>,
                class: "page",
                down: false,
                iX: 0,
                icon: {
                    element: <Burger />,
                    traversePos: 0
                }
            }
        ]
    });

    const widthRef = useRef<HTMLSpanElement>(null);

    React.useLayoutEffect(() => {

        traverse(0, true);

        const handler = () => {

            let item = 0;

            for (let i = 0; i < state.pageItems.length; i++) {
                if (state.pageItems[i].down) {
                    item = i;
                    break;
                }
            }

            let width = widthRef.current?.clientWidth as number / state.pageItems.length;

            traverse(width * (item + 1), true);

            setState({
                ...state,
                totalWidth: widthRef.current?.clientWidth as number,
                width,
                isPortrait: window.innerWidth <= 600
            });
        }

        window.addEventListener("resize", handler);


        handler();

        return () => {
            window.removeEventListener("resize", handler);
        }

    }, []);

    return (
        <span className="app" ref={widthRef}>
            {
                state.pageItems.map((page, i) =>
                    <span className={page.class}

                        onMouseDown={(e) => {
                            e.preventDefault();

                            //console.log(`[${i}] X: ${e.clientX}`);

                            setState((prev) => {

                                let modifiedArray = prev.pageItems;
                                modifiedArray[i].down = true;
                                modifiedArray[i].iX = e.clientX;

                                return {
                                    ...prev,

                                    pageItems: modifiedArray
                                }
                            });
                        }}

                        onMouseUp={(e) => {

                            dragDoneTraverse(state.pageItems[i].iX - e.clientX, state.width, i);

                            setState((prev) => {

                                let modifiedArray = prev.pageItems;
                                modifiedArray[i].down = false;

                                return {
                                    ...prev,

                                    pageItems: modifiedArray
                                }
                            });
                        }}

                        onMouseLeave={(e) => {
                            if (state.pageItems[i].down) {

                                dragDoneTraverse(state.pageItems[i].iX - e.clientX, state.width, i);

                                setState((prev) => {

                                    let modifiedArray = prev.pageItems;
                                    modifiedArray[i].down = false;

                                    return {
                                        ...prev,

                                        pageItems: modifiedArray
                                    }
                                });

                            }
                        }}

                        onMouseMove={(e) => {
                            if (state.pageItems[i].down) {
                                //console.log("MOUSE IS DOWN, TRAVERSE!");

                                let dif = (state.pageItems[i].iX - e.clientX);

                                traverse((state.width * i) + dif, false);

                            }
                        }}

                        key={i}
                    >
                        {
                            page.icon && state.isPortrait
                                ?
                                <span className="icon-container"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        traverse(state.width * (page.icon?.traversePos as number), false);
                                    }}
                                >
                                    {page.icon.element}
                                </span>
                                :
                                <></>
                        }
                        <span className="text nsd">
                            {page.title}
                        </span>
                        <span className="text secondary-text">
                            {page.children}
                        </span>
                    </span>
                )
            }
        </span >
    )
}