import {Tag} from "antd";
import {BsArrowUp, BsArrowUpRight, BsArrowUpLeft, BsArrowDown, BsArrowDownLeft, BsArrowDownRight} from "react-icons/bs"

export const getStatusComponent = (status: string) => {
    const color = getStatusColor(status);
    return <Tag color={color}>{status}</Tag>
}

export const getIpComponent = (ip: string, t: any) => {
    if (ip && ip !== "") {
        return <Tag color={"cyan"}>{ip}</Tag>
    }
    return <Tag color={"#868484"}>{t("dm.noIp")}</Tag>
}

export const getPredictionTag = (prediction: number, threshold: number) => {
    if (prediction >= threshold) {
        return <Tag color={"#ab0404"}>{prediction}</Tag>
    } else {
        return <Tag color={"#419b5d"}>{prediction}</Tag>
    }
}

export const getColorDirectionBySpeed = (speed: number): string => {
    speed = parseFloat(speed);
    if (speed > -0.5 && speed < 0.5) {
        return "#7c7a7a"
    }
    else if (speed > -1 && speed < 1) {
        return "#468cd5"
    }
    else if ((speed > -5 && speed <= -1) || (speed < 5 && speed >= 1)) {
        return "#51c767"
    }
    else if ((speed > -10 && speed <= -5) || (speed < 10 && speed >= 5)) {
        return "#b6984a"
    } else {
        return "#bd4c4c"
    }
}

export const getIconDirectionByFeatures = (camera: string, rotation: number): React.ReactNode => {
    rotation = parseFloat(rotation);
    console.log(rotation);
    if (camera === "CAM_FRONT") {
        if (rotation > -0.1 && rotation < 0.1) { // RECTO
            return BsArrowUp;
        } else if (rotation <= -0.1) { // RECTO IZQUIERDA
            return BsArrowUpLeft;
        } else { // RECTO DERECHA
            return BsArrowUpRight;
        }
    } else {
        if (rotation > -0.1 && rotation < 0.1) { // ATRAS
            return BsArrowDown;
        } else if (rotation <= -0.1) { // ATRAS DERECHA
            return BsArrowDownLeft;
        } else { // ATRAS izquierda
            return BsArrowDownRight;
        }
    }
}

export const getPredictionTagFlexBlock = (prediction: number, threshold: number, fontSize: string | number) => {
    if (prediction >= threshold) {
        return <Tag style={{display: "flex", justifyContent: "center", alignItems: "center", height: fontSize, fontSize: fontSize}} color={"#ab0404"}>{prediction}</Tag>
    } else {
        return <Tag style={{display: "flex", justifyContent: "center", alignItems: "center", height: fontSize, fontSize: fontSize}} color={"#419b5d"}>{prediction}</Tag>
    }
}

export const getMetricTag = (score: number) => {
    if (score < 0.5) {
        return <Tag color={"#ab0404"}>{score?.toFixed(4)}</Tag>
    } else if (score < 0.8) {
        return <Tag color={"#b08719"}>{score?.toFixed(4)}</Tag>
    } else {
        return <Tag color={"#419b5d"}>{score?.toFixed(4)}</Tag>
    }
}

export const getStatusColor = (status: string) => {
    let color = "#868484";
    if (status == "stop" || status == "stopped" || status == "exited") {
        color = "#b40c0c"
    } else if (status == "created") {
        color = "#b47a0f"
    } else if (status == "running") {
        color = "#1a9635"
    }
    return color;
}

export const getParamDataByName = (paramName: string, params: string[]) => {
    if (params) {
        for (let i = 0; i < params.length; i++) {
            if (params[i].includes(paramName + "=")) {
                const item = params[i];
                const words = item.split("=");
                if (words.length > 1) {
                    const value = words[1];
                    return value;
                }
            }
        }
    }
    return null;
}

export const getCameraNameByCameraValue = (cameraValue: string, t: Record<string, unknown>) => {
    console.log(cameraValue)
    if (cameraValue == "CAM_FRONT") {
        return t("dm.frontCamera");
    } else {
        return t("dm.backCamera");
    }
}

export const getAccuracy = (tp:number, tn:number, fp:number, fn: number): number => {
    return (tp+tn) / (tp+fp+tn+fn + Number.EPSILON);
}

export const getPrecision = (tp:number, tn:number, fp:number, fn: number): number => {
    return (tp) / (tp+fp + Number.EPSILON);
}

export const getRecall = (tp:number, tn:number, fp:number, fn: number): number => {
    return (tp) / (tp+fn + Number.EPSILON);
}

export const getF1Score = (tp:number, tn:number, fp:number, fn: number): number => {
    const precision = getRecall(tp, tn, fp, fn);
    const recall = getRecall(tp, tn, fp, fn);
    return 2 * ((precision * recall) / (precision + recall + Number.EPSILON))
}