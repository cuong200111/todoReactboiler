import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { AddAlert } from "@material-ui/icons";
import anime from "animejs"
const useStyle = (cl,active) => {
    return makeStyles({
        main: {
            background: cl,
            width: "250px",
            height: "50px",
            position: "absolute",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "0 0 0 10px",
            borderRadius: "5px",
            overflow: "hidden",
            opacity:active?1:0
        },
        text: {
            color: "white",
            fontFamily: "sans-serif",
            fontSize: "14px",
            fontWeight: "500"
        }
    })
}

const Alert = (props) => {
    const { style, color, msg, active } = props
    const animeRef = useRef(null)
    const leftAnime = active?["30%", "5%"]:["5%", "5%"]
    const opaAnime = active?1:0
    useEffect(() => {
            anime({
                targets: animeRef.current,
                left: leftAnime,
                opacity: opaAnime,
                duration: 500,
               
            });
    }, [active])


    const cl = color === "error" ? "#f44336" : color === "sucsess" ? "#4caf50" : "black"
    const base64Img = color === "sucsess" ? <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAIAAAAi3QukAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFcSURBVEhL1ZStTgNBFEZ5QERVBQqBquAVSHAESXgGgmpoKkjalSwJpq0itJiGrmnSNRVYDnzD7PTOMF2BgOSInTvfnPnNHhz2O7/CvxN1h0fH9yemmCQtuppcj5bjl3q+ea/FZD1FamIhVtQrThnjx5fVI0zXs4unS5M07IhIa/xoWWR2RCz2NiLWgmK1rc7Kc1+M0WTETL0RsX4SLS3MarqciNPVjnxHTMYCTsSJEsqfS8YCTjSvF+T0TfTm+VbfYq8FPkU8EHIsSiVJ714HaraxQELEAIbJ9ZNFRxE+0cTWwLuSFqDOkLDiRNwXfeFhy5W0UCFsrtiJvq9/7DuAAbEFNCtDwqITQZsHCQSIETb1RqQFv21XGRddBIjFK21EoDsC9mgeJ02K6iUWdokdETCV9igeqhJ8k67kqYEVia8fW6E3AXzQNKdrSIs8PLn8j9GzR9Sevybqdz4ARn/Irl96uysAAAAASUVORK5CYII=' /> : <img src="#" alt="" />
    const classes = useStyle(cl,active)()

    return (
        <div ref={animeRef} style={style} className={classes.main}>
            {base64Img} <h1 className={classes.text}>{msg}</h1>
        </div>

    )
}

export default Alert