import React from "react";
import { Typography } from "@mui/material";
import { NER_LABEL_COLORS } from "../_constants/resume";

const NERRenderer = ({ text, entities }) => {
    const renderEntities = (text, entities) => {
        let result = [];
        let cursor = 0;

        entities = entities ?? [];
        entities.forEach((entity, index) => {
            if (cursor < entity.start) {
                result.push(
                    <span key={`before-${index}`} style={{ color: "#000" }}>
                        {text.slice(cursor, entity.start)}
                    </span>
                );
            }
        
            result.push(
                <span
                    key={`entity-${index}`}
                    style={{
                        backgroundColor: NER_LABEL_COLORS[entity.label] || "#D3D3D3",
                        color: "#000",
                        padding: "0 4px",
                        borderRadius: "4px",
                        margin: "0 2px",
                        display: "inline-block",
                        fontWeight: "bold",
                    }}
                >
                    {text.slice(entity.start, entity.end)}
                    <sup
                        style={{
                            fontSize: "0.75em",
                            verticalAlign: "super",
                            marginLeft: "2px",
                            color: "#000",
                            backgroundColor: NER_LABEL_COLORS[entity.label] || "#D3D3D3",
                            borderRadius: "2px",
                            padding: "0 2px",
                            fontWeight: "bold",
                        }}
                    >
                        {entity.label}
                    </sup>
                </span>
            );
            cursor = entity.end;
        });

        if (cursor < text.length) {
            result.push(
                <span key="after-last" style={{ color: "#000" }}>
                    {text.slice(cursor)}
                </span>
            );
        }

        return <Typography variant="body1" sx={{ lineHeight: 2 }}>{result}</Typography>;
    };

    return renderEntities(text, entities);
};

export default NERRenderer;