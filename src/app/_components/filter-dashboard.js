import React, { useState } from "react";
import { TextField, MenuItem, FormControl, Select, InputLabel } from "@mui/material";

export default function FilterDashboard({ onFilterChange }) {
    const [aspect, setAspect] = useState("resumeName");
    const [query, setQuery] = useState("");
    const [matchType, setMatchType] = useState("exact");
    const [scoreComparison, setScoreComparison] = useState("equal");
    const [scoreValue, setScoreValue] = useState("");

    const handleAspectChange = (event) => {
        setAspect(event.target.value);
        onFilterChange({ aspect: event.target.value, value: query, matchType, scoreComparison, scoreValue });
    };

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
        onFilterChange({ aspect, value: event.target.value, matchType, scoreComparison, scoreValue });
    };

    const handleMatchTypeChange = (event) => {
        setMatchType(event.target.value);
        onFilterChange({ aspect, value: query, matchType: event.target.value, scoreComparison, scoreValue });
    };

    const handleScoreComparisonChange = (event) => {
        setScoreComparison(event.target.value);
        onFilterChange({ aspect, value: query, matchType, scoreComparison: event.target.value, scoreValue });
    };

    const handleScoreValueChange = (event) => {
        setScoreValue(event.target.value);
        onFilterChange({ aspect, value: query, matchType, scoreComparison, scoreValue: event.target.value });
    };

    return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 mb-8">
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
                    <MenuItem value="jobResumeScore">Job Resume Score</MenuItem>
                </Select>
            </FormControl>

            {aspect === "jobResumeScore" ? (
                <>
                    <FormControl className="w-1/4">
                        <InputLabel id="score-comparison-label">Comparison</InputLabel>
                        <Select
                            labelId="score-comparison-label"
                            value={scoreComparison}
                            onChange={handleScoreComparisonChange}
                        >
                            <MenuItem value="equal">Equal To</MenuItem>
                            <MenuItem value="greater">Greater Than</MenuItem>
                            <MenuItem value="smaller">Smaller Than</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        className="flex-grow"
                        label="Score Value"
                        type="number"
                        value={scoreValue}
                        onChange={handleScoreValueChange}
                        variant="outlined"
                    />
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}