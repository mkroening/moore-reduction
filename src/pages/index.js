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
        return (
            <tr>
                <th>Z{this.props.index + 1}</th>
                {Array.from({length: this.props.destStateCount}, (v, k) => (
                    <td>
                        <label>Z</label>
                        <input onChange={evt => this.props.onChange(this.props.index, k, parseInt(evt.target.value, 10))}
                               value={this.props.value[k + 1]}
                               size={1}/>
                    </td>
                ))}
                <td>
                    <label>Y</label>
                    <input
                        onChange={evt => this.props.onChange(this.props.index, this.props.destStateCount, parseInt(evt.target.value, 10))}
                        value={this.props.value[this.props.value.length - 1]}
                        size={1}/>
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
            table: defaultArray,
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
        const newTable = this.state.table.slice();
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
        const table = this.state.table;
        table[state][input + 1] = destinationState;
        this.setState({
            table: table,
        });
    }

    render() {
        return (
            <div>
                <Counter
                    title={"States"}
                    initCount={this.state.stateCount}
                    setCount={i => this.setStateCount(i)}
                />
                <Counter
                    title={"Inputs"}
                    initCount={this.state.inputCount}
                    setCount={i => this.setInputCount(i)}
                />
                <table cellPadding={4} cellSpacing={3}>
                    <caption>State transition table</caption>
                    <thead>
                    <tr>
                        <th>States</th>
                        {Array.from({length: this.state.inputCount}, (v, k) => <th>X{k}</th>)}
                        <th>Output</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({length: this.state.stateCount}, (v, k) => (
                        <InputRow
                            index={k}
                            value={this.state.table[k]}
                            destStateCount={this.state.inputCount}
                            onChange={this.setDestinationStates}
                        />
                    ))}
                    </tbody>
                </table>
                <button onClick={() => this.props.onSubmit(this.state.table)}/>
            </div>
        );
    }
}

class States {
    static fromRawTable(rawTable) {
        const states = JSON.parse(JSON.stringify(rawTable))
            .map(rawRow => ({
                number: rawRow[0],
                output: rawRow[rawRow.length - 1],
                equivalencePartition: rawRow[rawRow.length - 1],
                nextStates: rawRow.slice(1, rawRow.length - 1).map(cell => ({number: cell})),
            }));
        this.sort(states);
        this.applyEquivalencePartitions(states);
        return states;
    }

    static applyEquivalencePartitions(states) {
        states.forEach((state, index, states) =>
            state.nextStates.forEach(state =>
                state.equivalencePartition = states.find(nextState => nextState.number === state.number).equivalencePartition));
    }

    static sort(states) {
        states.forEach((state, index) => state.tmp = index);
        states.sort((state1, state2) => {
            const equivalencePartitionDifference = state1.equivalencePartition - state2.equivalencePartition;
            return equivalencePartitionDifference !== 0 ? equivalencePartitionDifference : state1.tmp - state2.tmp;
        });
    }

    static getHighestEquivalencePartition(states) {
        return states[states.length - 1].equivalencePartition;
    }

    static isOptimal(states) {
        return Array.from({length: this.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => states.filter(state => state.equivalencePartition === equivalencePartition))
            .every(group => group.slice(1)
                .every(state => state.nextStates
                    .every((state, index) => state.equivalencePartition === group[0].nextStates[index].equivalencePartition)));
    }

    static regroup(states) {
        const sameGroupAsFirst = states.filter((state, index, states) => state.nextStates.every((state, index) => state.equivalencePartition === states[0].nextStates[index].equivalencePartition));
        const notSameGroupAsFirst = states.filter((state, index, states) => state.nextStates.some((state, index) => state.equivalencePartition !== states[0].nextStates[index].equivalencePartition));
        return notSameGroupAsFirst.length === 0 ? [sameGroupAsFirst] : [sameGroupAsFirst].concat(this.regroup(notSameGroupAsFirst));
    }

    static step(states) {
        const groups = Array.from({length: this.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => JSON.parse(JSON.stringify(States.regroup(states.filter(state => state.equivalencePartition === equivalencePartition)))))
            .reduce((acc, val) => acc.concat(val), []);                         // TODO: Array.prototype.flatMap()
        groups.forEach((group, index) => group.forEach(state => state.equivalencePartition = index + 1));
        const nextStates = groups.reduce((acc, val) => acc.concat(val), []);    // TODO: Array.prototype.flatMap()
        this.sort(nextStates);
        this.applyEquivalencePartitions(nextStates);
        return nextStates;
    }

    static reductionSteps(states) {
        return this.isOptimal(states) ? [states] : [states].concat(this.reductionSteps(this.step(states)));
    }
}

class EquivalencePartitionTable extends React.Component {
    render() {
        return (
            <table cellPadding={4} cellSpacing={3}>
                <thead>
                <tr>
                    <th>States</th>
                    {Array.from({length: this.props.states[0].nextStates.length}, (v, k) => <th>X{k}</th>)}
                    <th>Classes</th>
                    <th>Output</th>
                </tr>
                </thead>
                <tbody>
                {this.props.states.map(state => (
                    <tr>
                        <td>Z{state.number}</td>
                        {state.nextStates.map(state => <td>Z{state.number} - K{state.equivalencePartition}</td>)}
                        <td>K{state.equivalencePartition}</td>
                        <td>Y{state.output}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

class StateTransitionTable extends React.Component {
    static reduceStates(states) {
        return Array.from({length: States.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => states.find(state => state.equivalencePartition === equivalencePartition));
    }

    render() {
        return (
            <table cellPadding={4} cellSpacing={3}>
                <thead>
                <tr>
                    <th>States</th>
                    {Array.from({length: this.props.stateTransitions[0].nextStates.length}, (v, k) => <th>X{k}</th>)}
                    <th>Output</th>
                </tr>
                </thead>
                <tbody>
                {this.props.stateTransitions.map(state => (
                    <tr>
                        <td>Z'{state.equivalencePartition}</td>
                        {state.nextStates.map(state => <td>Z'{state.equivalencePartition}</td>)}
                        <td>Y{state.output}</td>
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
        this.state = {
            reductionSteps: [],
        };
        this.simplify = this.simplify.bind(this);
    }

    simplify(rawTable) {
        const reductionSteps = States.reductionSteps(States.fromRawTable(rawTable));
        const stateTransitions = StateTransitionTable.reduceStates(reductionSteps[reductionSteps.length - 1]);
        this.setState({
            reductionSteps: reductionSteps,
            stateTransitions: stateTransitions,
        });
    }

    render() {
        return (
            <div>
                <InputTable onSubmit={this.simplify}/>
                {this.state.reductionSteps.map(step => <EquivalencePartitionTable states={step}/>)}
                {this.state.stateTransitions !== undefined ? <StateTransitionTable stateTransitions={this.state.stateTransitions}/> : undefined}
            </div>
        )
    }
}

export default Simplifier
