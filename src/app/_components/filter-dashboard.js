import React, { useState } from "react";
import { TextField, MenuItem, FormControl, Select, InputLabel } from "@mui/material";

export default function FilterDashboard({ onFilterChange }) {
    const [aspect, setAspect] = useState("resumeName");
    const [query, setQuery] = useState("");
    const [matchType, setMatchType] = useState("exact"); // Added match type

    const handleAspectChange = (event) => {
        setAspect(event.target.value);
        onFilterChange({ aspect: event.target.value, value: query, matchType });
    };

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
        onFilterChange({ aspect, value: event.target.value, matchType });
    };

    const handleMatchTypeChange = (event) => {
        setMatchType(event.target.value);
        onFilterChange({ aspect, value: query, matchType: event.target.value });
    };

    return (
        <div className="flex items-center space-x-4 mb-8">
            <FormControl className="w-1/4">
                <InputLabel id="filter-aspect-label">Filter By</InputLabel>
                <Select
                    labelId="filter-aspect-label"
                    value={aspect}
                    onChange={handleAspectChange}
                >
                    <MenuItem value="resumeName">Resume Name</MenuItem>
                    <MenuItem value="companyName">Company Name</MenuItem>
                    <MenuItem value="jobTitle">Job Title</MenuItem>
                </Select>
            </FormControl>

            <FormControl className="w-1/4">
                <InputLabel id="filter-match-type-label">Match Type</InputLabel>
                <Select
                    labelId="filter-match-type-label"
                    value={matchType}
                    onChange={handleMatchTypeChange}
                >
                    <MenuItem value="exact">Exact Match</MenuItem>
                    <MenuItem value="ambiguous">Ambiguous Match</MenuItem>
                </Select>
            </FormControl>

            <TextField
                className="flex-grow"
                label="Keyword"
                value={query}
                onChange={handleQueryChange}
                variant="outlined"
            />
        </div>
    );
}