import React from "react"

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.initCount,
        };
    }

    render() {
        return (
            <div>
                <label>{this.props.title}: {this.state.count} </label>
                <button
                    onClick={() => {
                        this.setState(prevState => ({
                            count: prevState.count + 1,
                        }));
                        this.props.setCount(this.state.count + 1);
                    }}
                >+
                </button>
                <button
                    onClick={() => {
                        this.setState(prevState => ({
                            count: prevState.count - 1,
                        }));
                        this.props.setCount(this.state.count - 1);
                    }}
                >-
                </button>
            </div>
        );
    }
}

class InputRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const states = Array.from({length: this.props.destStateCount}, (v, k) => (
            <td>
                <label>Z</label>
                <input onInput={evt => this.props.onInput(this.props.index, k, parseInt(evt.target.value, 10))}
                       value={this.props.value[k + 1]}
                       size="1"/>
            </td>
        ));

        return (
            <tr>
                <th>Z{this.props.index + 1}</th>
                {states}
                <td>
                    <label>Y</label>
                    <input
                        onInput={evt => this.props.onInput(this.props.index, this.props.destStateCount, parseInt(evt.target.value, 10))}
                        value={this.props.value[this.props.value.length - 1]}
                        size="1"/>
                </td>
            </tr>
        );
    }
}

class InputTable extends React.Component {
    constructor(props) {
        super(props);
        const defaultStateCount = 11;
        const defaultInputCount = 3;
        const defaultArray = [
            [1, 10, 1, 6, 2],
            [2, 11, 8, 6, 2],
            [3, 1, 7, 6, 1],
            [4, 9, 2, 3, 2],
            [5, 10, 1, 6, 1],
            [6, 8, 2, 11, 2],
            [7, 8, 2, 11, 2],
            [8, 6, 11, 5, 3],
            [9, 4, 3, 5, 3],
            [10, 3, 9, 7, 2],
            [11, 1, 6, 4, 1]
        ];
        this.state = {
            stateCount: defaultStateCount,
            inputCount: defaultInputCount,
            table: defaultArray, //Array.from({length: defaultStateCount}, (v, k) => Array.from({length: defaultInputCount + 2}, (v2, k2) => k2 === 0 ? k : undefined)),
        };
        this.setDestinationStates = this.setDestinationStates.bind(this);
    }

    setStateCount(i) {
        if (i < this.state.stateCount)
            this.setState({
                stateCount: i,
                table: this.state.table.slice(0, i),
            });
        else if (i > this.state.stateCount)
            this.setState({
                stateCount: i,
                table: this.state.table.concat(Array.from({length: i - this.state.stateCount}, () => Array.from({length: this.state.inputCount + 2}))),
            });
    }

    setInputCount(i) {
        let newTable = this.state.table.slice();
        if (i < this.state.inputCount)
            newTable.forEach(row => row.splice(i + 1, this.state.inputCount - i));
        else if (i > this.state.inputCount)
            newTable.forEach(row => row.splice(this.state.inputCount + 1, 0, undefined));
        this.setState({
            inputCount: i,
            table: newTable,
        });
    }

    setDestinationStates(state, input, destinationState) {
        let table = this.state.table;
        table[state][input + 1] = destinationState;
        this.setState({
            table: table,
        });
    }

    render() {
        const inputHeader = Array.from({length: this.state.inputCount}, (v, k) => (
            <th>X{k}</th>
        ));

        const rows = Array.from({length: this.state.stateCount}, (v, k) => (
            <InputRow
                index={k}
                value={this.state.table[k]}
                destStateCount={this.state.inputCount}
                onInput={this.setDestinationStates}
            />
        ));

        return (
            <div>
                <Counter
                    title="States"
                    initCount={this.state.stateCount}
                    setCount={i => this.setStateCount(i)}
                />
                <Counter
                    title="Inputs"
                    initCount={this.state.inputCount}
                    setCount={i => this.setInputCount(i)}
                />
                <table cellPadding="4" cellSpacing="3">
                    <caption>State transition table</caption>
                    <thead>
                    <tr>
                        <th>States</th>
                        {inputHeader}
                        <th>Output</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
                <button onClick={() => this.props.onSubmit(this.state.table)}/>
            </div>
        );
    }
}

class MooreTable extends React.Component {
    static fromRaw(rawTable) {
        let table = JSON.parse(JSON.stringify(rawTable));

        // insert equalityclass
        table.forEach(row => row.splice(row.length - 1, 0, row[row.length - 1]));

        this.stableSortByClass(table);

        table = table.map(row => row
            .map((cell, index) => (index === 0 || index >= row.length - 2) ?
                cell : [cell, table.find(row => row[0] === cell)[row.length - 1]]));

        return <MooreTable table={table}/>;
    }

    static stableSortByClass(table) {
        table.forEach((row, index) => row.index = index);
        table.sort((row1, row2) => {
            if (row1[row1.length - 2] === row2[row2.length - 2])
                return row1.index - row2.index;
            else
                return row1[row1.length - 2] - row2[row2.length - 2];
        });
    }

    static optimize(mooreTable) {
        let steps = [mooreTable];
        while (!this.isOptimal(steps[steps.length - 1]))
            steps.push(this.step(steps[steps.length - 1]));
        return steps;
    }

    static isOptimal(mooreTable) {
        const length = mooreTable.props.table[mooreTable.props.table.length - 1][mooreTable.props.table[mooreTable.props.table.length - 1].length - 2];
        return Array.from({length: length}, (v, k) => k + 1)
            .map(equalityClass => mooreTable.props.table.filter(row => row[row.length - 2] === equalityClass))
            .every(group => group.slice(1)
                .every(row => row.slice(1, row.length - 2)
                    .every((pair, index) => pair[1] === group[0].slice(1, group[0].length - 2)[index][1])));
    }

    static step(mooreTable) {
        let table = Array.from({length: mooreTable.props.table[mooreTable.props.table.length - 1][mooreTable.props.table[0].length - 2]}, (v, k) => k + 1)
            .map(i => JSON.parse(JSON.stringify(this.groupByGoodness(mooreTable.props.table.filter(row => row[row.length - 2] === i)))))
            .reduce((acc, val) => acc.concat(val), [])      // TODO: Array.prototype.flatMap()
            .map((group, index) => group.map(row => {
                row[row.length - 2] = index + 1;
                return row;
            }))
            .reduce((acc, val) => acc.concat(val), [])      // TODO: Array.prototype.flatMap()
            .map((row, index, table) => row
                .map(cell => (cell.length > 1) ?
                    [cell[0], table.find(row => row[0] === cell[0])[row.length - 2]] : cell));

        this.stableSortByClass(table);

        return <MooreTable table={table}/>;
    };

    static groupByGoodness(rows) {
        const firstEqualityClasses = rows[0].slice(1, rows[0].length - 2);
        const good = rows.filter(row => row.slice(1, row.length - 2).every((pair, index) => pair[1] === firstEqualityClasses[index][1]));
        const bad = rows.filter(row => row.slice(1, row.length - 2).some((pair, index) => pair[1] !== firstEqualityClasses[index][1]));
        return bad.length === 0 ? [good] : [good].concat(this.groupByGoodness(bad));
    }

    render() {
        return (
            <table cellPadding="4" cellSpacing="3">
                <thead>
                <tr>
                    <th>States</th>
                    {Array.from({length: this.props.table[0].length - 3}, (v, k) => <th>X{k}</th>)}
                    <th>Classes</th>
                    <th>Output</th>
                </tr>
                </thead>
                <tbody>
                {this.props.table.map(row => (
                    <tr>
                        {row.map((cell, index, row) => {
                            let tableData;
                            if (index === 0)
                                tableData = "Z" + cell;
                            else if (index === row.length - 2)
                                tableData = "K" + cell;
                            else if (index === row.length - 1)
                                tableData = "Y" + cell;
                            else
                                tableData = "Z" + cell[0] + " - K" + cell[1];
                            return <td>{tableData}</td>
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

class Simplifier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.simplify = this.simplify.bind(this);
    }

    simplify(tableau) {
        let table = MooreTable.fromRaw(tableau);

        let steps = MooreTable.optimize(table);
        steps.forEach(table => console.log(MooreTable.isOptimal(table)));

        this.setState({
            result: steps,
        });
    }

    render() {
        return (
            <div>
                <InputTable onSubmit={this.simplify}/>
                {this.state.result}
            </div>
        )
    }
}

export default Simplifier
