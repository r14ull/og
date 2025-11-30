import React from "react";
import { z } from "zod";
import { ILayout } from "./types";

const truenorthLayoutConfig = z.object({
    prize: z.string(),
    result: z.string(),
    seed: z.string(),
});

export type TruenorthLayoutConfig = z.infer<typeof truenorthLayoutConfig>;

const Component: React.FC<{ config: TruenorthLayoutConfig }> = ({ config }) => {
    return (
        <div tw="flex flex-col w-full h-full relative font-sans">
            <img
                src="https://static.rafflex.io/bg-og.png"
                tw="absolute inset-0 w-full h-full"
                style={{ objectFit: "cover" }}
            />

            {/* Main Content Area */}
            <div tw="flex flex-col absolute left-16" style={{ top: 157 }}>
                <div tw="text-gray-900" style={{ fontSize: "45px", fontWeight: 400, marginBottom: 35 }}>{config.prize}</div>
                <div tw="text-black tracking-tighter" style={{ fontSize: "150px", fontWeight: 900 }}>{config.result}</div>
            </div>

            {/* Verified Seed Area */}
            <div tw="flex flex-col absolute bottom-12 left-16 right-16">
                <div tw="flex flex-col items-start">
                    <span tw="text-2xl italic font-semibold text-gray-900 mb-2">Verified Seed</span>
                    <div tw="w-16 h-1 bg-black mb-2"></div>
                    <span tw="text-gray-600 font-mono break-all" style={{ fontSize: "17px", fontStyle: "italic", fontWeight: 300 }}>{config.seed}</span>
                </div>
            </div>
        </div>
    );
};

export const truenorthLayout: ILayout<typeof truenorthLayoutConfig> = {
    name: "truenorth",
    config: truenorthLayoutConfig,
    properties: [
        {
            type: "text",
            name: "prize",
            default: "£1000 Cash Draw",
            placeholder: "Prize Name",
        },
        {
            type: "text",
            name: "result",
            default: "10203",
            placeholder: "Result",
        },
        {
            type: "text",
            name: "seed",
            default: "db4268498d15a9971e39a65001c29ad3632dfd030d6e061b3659a975203824a3",
            placeholder: "Verified Seed",
        },
    ],
    Component,
};
