/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import _ from "underscore";
import Moment from "moment";
import { format } from "d3-format";

// Pond
import { TimeSeries, percentile } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import ScatterChart from "../../../../../components/ScatterChart";
import BandChart from "../../../../../components/BandChart";
import Resizable from "../../../../../components/Resizable";
import styler from "../../../../../js/styler";

import AreaChart from "../../../../../components/AreaChart";
import Brush from "../../../../../components/Brush";

import { getNamesArrayFromBitMask } from "./bitmask-utils";
import { AscentMethods } from "./AscentMethods";
import { AscentNotes } from "./AscentNotes";
import { getAscentTypeById } from "./AscentTypes";
import { AscentGradeMapping, AscentGrades } from "./AscentGrades";

// Weather data
import weatherJSON from "./weather.json";
import ascentJSON from "./ascents.json";

import wind_docs from "./wind_docs.md";
import wind_thumbnail from "./wind_thumbnail.png";

const style = styler([
    { key: "distance", color: "#e2e2e2" },
    { key: "gradeId", color: "#e2e2e2", width: 1, opacity: 0.5 },
    { key: "cadence", color: "#ff47ff" },
    { key: "power", color: "green", width: 1, opacity: 0.5 },
    { key: "temperature", color: "#cfc793" },
    { key: "speed", color: "steelblue", width: 1, opacity: 0.5 }
]);

//
// Read in the weather data and add some randomness and intensity for fun
//

const ascents = ascentJSON
    .filter(a => a.dbascent === "false")

    .map(ascent => {
        ascent.notes = getNamesArrayFromBitMask(AscentNotes, ascent.note);
        ascent.method = AscentMethods[ascent.style];
        ascent.type = getAscentTypeById(ascent.type);

        if (ascent.objectclass === "CLS_UserAscent_Try") {
            ascent.isTry = true;
        }

        const newGradeId = AscentGradeMapping[ascent.grade];
        if (!newGradeId) {
            console.error("gradeId not found", ascent.grade);
        }
        ascent.grade = AscentGrades[newGradeId];

        return ascent;
    })
    // .filter(a => a.date > "2019")
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

const points = ascents.map(ascent => [new Moment(ascent.date).toDate().getTime(), ascent.grade.id]);

//
// Timeseries
//

const series = new TimeSeries({
    name: "Gust",
    columns: ["time", "gradeId"],
    points
});

// //
// // Render scatter chart
// //

class wind extends React.Component {
    state = {
        hover: null,
        highlight: null,
        selection: null,
        timerange: series.range(),
        brushrange: series.range()
    };

    // Handles when the brush changes the timerange
    handleTimeRangeChange = timerange => {
        if (timerange) {
            this.setState({ timerange, brushrange: timerange });
        } else {
            this.setState({ timerange: series.range(), brushrange: null });
        }
    };

    handleSelectionChanged = point => {
        this.setState({
            selection: point
        });
    };

    handleMouseNear = point => {
        this.setState({
            highlight: point
        });
    };

    renderBrush = () => {
        return (
            <ChartContainer timeRange={series.range()} format="relative">
                <ChartRow height="100" debug={false}>
                    <Brush
                        timeRange={this.state.brushrange}
                        allowSelectionClear
                        onTimeRangeChanged={this.handleTimeRangeChange}
                    />
                    <YAxis
                        id="axis1"
                        label="Altitude (ft)"
                        min={0}
                        max={series.max("gradeId")}
                        width={70}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        <AreaChart
                            axis="axis1"
                            style={style.areaChartStyle()}
                            columns={{ up: ["gradeId"], down: [] }}
                            series={series}
                        />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    };

    render() {
        const highlight = this.state.highlight;
        const formatter = format(".2f");
        let text = `Speed: - mph, time: -:--`;
        let infoValues = [];
        if (highlight) {
            // const speedText = `${formatter(highlight.event.get(highlight.column))} mph`;
            // text = `
            //   Speed: ${speedText},
            //   time: ${this.state.highlight.event.timestamp().toLocaleTimeString()}
            // `;
            // infoValues = [{ label: "Speed", value: speedText }];
        }

        const bandStyle = styler([{ key: "gradeId", color: "blue", width: 1, opacity: 0.5 }]);

        const brushStyle = {
            boxShadow: "inset 0px 2px 5px -2px rgba(189, 189, 189, 0.75)",
            background: "#FEFEFE",
            paddingTop: 10
        };

        /* const heat = [
      "#023858",
      "#045a8d",
      "#0570b0",
      "#3690c0",
      "#74a9cf",
      "#a6bddb",
      "#d0d1e6",
      "#ece7f2",
      "#fff7fb"
    ]; */

        const perEventStyle = (column, event) => {
            const color = "steelblue"; // heat[Math.floor((1 - event.get("station1") / 40) * 9)];
            return {
                normal: {
                    fill: color,
                    opacity: 1.0
                },
                highlighted: {
                    fill: color,
                    stroke: "none",
                    opacity: 1.0
                },
                selected: {
                    fill: "none",
                    stroke: "#2CB1CF",
                    strokeWidth: 3,
                    opacity: 1.0
                },
                muted: {
                    stroke: "none",
                    opacity: 0.4,
                    fill: color
                }
            };
        };

        const timeAxisStyle = {
            values: { valueColor: "Green", valueWeight: 200, valueSize: 12 }
        };

        const YAxisStyle = {
            axis: { axisColor: "#C0C0C0" },
            label: { labelColor: "Blue", labelWeight: 100, labelSize: 12 },
            values: { valueSize: 12 }
        };

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">{text}</div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                timeAxisStyle={timeAxisStyle}
                                maxTime={series.range().end()}
                                minTime={series.range().begin()}
                                enablePanZoom={true}
                                onBackgroundClick={() => this.setState({ selection: null })}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                            >
                                <ChartRow height="600" debug={false}>
                                    <YAxis
                                        id="wind-gust"
                                        label="Wind gust (mph)"
                                        labelOffset={-5}
                                        min={0}
                                        max={series.max("gradeId")}
                                        style={YAxisStyle}
                                        width="70"
                                        type="linear"
                                        format=",.1f"
                                    />
                                    <Charts>
                                        <ScatterChart
                                            axis="wind-gust"
                                            series={series}
                                            columns={["gradeId"]}
                                            style={perEventStyle}
                                            info={infoValues}
                                            infoHeight={28}
                                            infoWidth={110}
                                            infoStyle={{
                                                fill: "black",
                                                color: "#DDD"
                                            }}
                                            format=".1f"
                                            selected={this.state.selection}
                                            onSelectionChange={p => this.handleSelectionChanged(p)}
                                            onMouseNear={p => this.handleMouseNear(p)}
                                            highlight={this.state.highlight}
                                            radius={(event, column) =>
                                                column === "gradeId" ? 3 : 2
                                            }
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                    <div className="row">
                        <div className="col-md-12" style={brushStyle}>
                            <Resizable>{this.renderBrush()}</Resizable>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// const wind = () => <div />

// Export example
export default { wind, wind_docs, wind_thumbnail };
