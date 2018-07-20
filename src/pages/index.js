import React from 'react';

import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import {MuiThemeProvider, createMuiTheme, withStyles} from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        fontSize: 16,
    },
});

const styles = theme => ({
    textField: {
        width: 36,
    },
    button: {
        margin: theme.spacing.unit,
    },
    paper: {
        margin: theme.spacing.unit,
    },
});

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.initCount,
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                {this.props.title}: {this.state.count}
                <Button variant="fab" mini color="secondary" aria-label="Add" className={classes.button}
                        onClick={() => {
                            this.setState(prevState => ({
                                count: prevState.count + 1,
                            }));
                            this.props.setCount(this.state.count + 1);
                        }}>
                    +
                </Button>
                <Button variant="fab" mini color="secondary" aria-label="Add" className={classes.button}
                        onClick={() => {
                            this.setState(prevState => ({
                                count: prevState.count - 1,
                            }));
                            this.props.setCount(this.state.count - 1);
                        }}>
                    -
                </Button>
            </div>
        );
    }
}

class InputRow extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <TableRow>
                <TableCell padding={"checkbox"}>
                    <InlineMath>{String.raw`Z_{${this.props.index + 1}}`}</InlineMath>
                </TableCell>
                {Array.from({length: this.props.destStateCount}, (v, k) => (
                    <TableCell padding={"checkbox"}>
                        <InlineMath>Z</InlineMath>
                        <TextField type={"number"} className={classes.textField}
                                   value={this.props.value[k + 1]}
                                   onChange={evt => this.props.onChange(this.props.index, k, parseInt(evt.target.value, 10))}/>
                    </TableCell>
                ))}
                <TableCell padding={"checkbox"}>
                    <InlineMath>Y</InlineMath>
                    <TextField type={"number"} className={classes.textField}
                               value={this.props.value[this.props.value.length - 1]}
                               onChange={evt => this.props.onChange(this.props.index, this.props.destStateCount, parseInt(evt.target.value, 10))}/>
                </TableCell>
            </TableRow>
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
        const {classes} = this.props;
        return (
            <div>
                <Counter classes={classes}
                         title={"States"}
                         initCount={this.state.stateCount}
                         setCount={i => this.setStateCount(i)}/>
                <Counter classes={classes}
                         title={"Inputs"}
                         initCount={this.state.inputCount}
                         setCount={i => this.setInputCount(i)}/>
                <Paper className={classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding={"checkbox"}>States</TableCell>
                                {Array.from({length: this.state.inputCount}, (v, k) =>
                                    <TableCell padding={"checkbox"}>
                                        <InlineMath>{String.raw`X_${k}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell padding={"checkbox"}>Output</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({length: this.state.stateCount}, (v, k) =>
                                <InputRow
                                    classes={classes}
                                    index={k}
                                    value={this.state.table[k]}
                                    destStateCount={this.state.inputCount}
                                    onChange={this.setDestinationStates}/>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
                <Button variant="contained" color="primary" className={classes.button}
                        onClick={() => this.props.onSubmit(this.state.table)}>Reduce</Button>
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
        states.equivalence = 0;
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
        nextStates.equivalence = states.equivalence + 1;
        return nextStates;
    }

    static reductionSteps(states) {
        return this.isOptimal(states) ? [states] : [states].concat(this.reductionSteps(this.step(states)));
    }
}

class EquivalencePartitionTable extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <Paper className={classes.paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={"checkbox"}>States</TableCell>
                            {Array.from({length: this.props.states[0].nextStates.length}, (v, k) =>
                                <TableCell padding={"checkbox"}>
                                    <InlineMath>{String.raw`X_{${k}}`}</InlineMath>
                                </TableCell>
                            )}
                            <TableCell padding={"checkbox"}>Classes</TableCell>
                            <TableCell padding={"checkbox"}>Output</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.states.map((state, index, states) =>
                            <TableRow>
                                <TableCell padding={"checkbox"}>
                                    <InlineMath>{String.raw`Z_{${state.number}}`}</InlineMath>
                                </TableCell>
                                {state.nextStates.map(state =>
                                    <TableCell padding={"checkbox"}>
                                        <InlineMath>{String.raw`Z_{${state.number}} - K_{${state.equivalencePartition}}^{${states.equivalence}}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell padding={"checkbox"}>
                                    <InlineMath>{String.raw`K_{${state.equivalencePartition}}^{${states.equivalence}}`}</InlineMath>
                                </TableCell>
                                <TableCell padding={"checkbox"}>
                                    <InlineMath>{String.raw`Y_{${state.output}}`}</InlineMath>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

class StateTransitionTable extends React.Component {
    static reduceStates(states) {
        return Array.from({length: States.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => states.find(state => state.equivalencePartition === equivalencePartition));
    }

    render() {
        const {classes} = this.props;
        return (
            <Paper className={classes.paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>States</TableCell>
                            {Array.from({length: this.props.stateTransitions[0].nextStates.length}, (v, k) =>
                                <TableCell>
                                    <InlineMath>{String.raw`X_{${k}}`}</InlineMath>
                                </TableCell>
                            )}
                            <TableCell>Output</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.stateTransitions.map(state => (
                            <TableRow>
                                <TableCell>
                                    <InlineMath>{String.raw`Z'_{${state.equivalencePartition}}`}</InlineMath>
                                </TableCell>
                                {state.nextStates.map(state =>
                                    <TableCell>
                                        <InlineMath>{String.raw`Z'_{${state.equivalencePartition}}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <InlineMath>{String.raw`Y_{${state.output}}`}</InlineMath>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
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
        const {classes} = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <Grid container justify={"center"}>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
                    <CssBaseline/>
                    <Grid>
                        <InputTable classes={classes} onSubmit={this.simplify}/>
                        {this.state.reductionSteps.map(step =>
                            <EquivalencePartitionTable classes={classes} states={step}/>
                        )}
                        {this.state.stateTransitions === undefined ? undefined :
                            <StateTransitionTable classes={classes} stateTransitions={this.state.stateTransitions}/>
                        }
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(Simplifier);
