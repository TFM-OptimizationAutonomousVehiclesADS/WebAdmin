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