import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { AddAlert } from "@material-ui/icons";
import anime from "animejs"
import { Button } from "@material-ui/core";
const useStyle = (dialogActive) => {
    return makeStyles({
        main:{
            position:"absolute",
            boxShadow:"0 0 5px 1px #0000004f",
            top:"75%",
            left:"-10%",
            zIndex:"100",
            borderRadius:"5px",
            backgroundColor:"white",
            opacity:dialogActive?1:0,
            visibility:dialogActive?"visibilty":"hidden",
        },
        button:{
            marginLeft:"1%",
           width:"105px",
           float:"right",
           padding:"11px 0 !important",
        }
    })
}

const Dialog = (props) => {
const {style,dialogActive,onclick} = props

    const classes = useStyle(dialogActive)()
    const animeRef = useRef(null)
    const leftAnime = ["-10%","-1%"]
    const opaAnime = dialogActive?1:0
    const visibilityAnime = dialogActive?"visibilty":"hidden"
    useEffect(() => {
        anime({
            targets: animeRef.current,
            left: leftAnime,
            opacity: opaAnime,
            visibility:visibilityAnime,
            duration: 500,
           
        });
}, [dialogActive])
    return (
        <div ref={animeRef} style={style} className={classes.main}>
                <Button onClick={()=>{onclick(true,false)}} className={classes.button}>Xác Nhận</Button>
                <Button onClick={()=>{onclick(false,false)}} className={classes.button}>Hủy</Button>
        </div>

    )
}

export default Dialog