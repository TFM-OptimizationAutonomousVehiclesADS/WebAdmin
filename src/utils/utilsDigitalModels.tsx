import {Tag} from "antd";

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