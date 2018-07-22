import React from 'react';

import PropTypes from 'prop-types';

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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import withStyles from '@material-ui/core/styles/withStyles';

const theme = createMuiTheme({
    typography: {
        fontSize: 18,
    },
});

const styles = ({
    numberField: {
        width: 40,
    },
    toolbarNumberField: {
        width: 50,
    },
    spacer: {
        flex: 'auto',
    },
});

class InputRow extends React.Component {
    render() {
        const {values, onChange, classes} = this.props;
        const inputCount = values.length - 2;
        const stateNumber = values[0];
        return (
            <TableRow>
                <TableCell padding="dense">
                    <InlineMath>{String.raw`Z_{${values[0]}}`}</InlineMath>
                </TableCell>
                {Array.from({length: inputCount}, (v, k) => (
                    <TableCell key={k.toString()} padding="dense">
                        <InlineMath>Z</InlineMath>
                        <TextField type="number" className={classes.numberField}
                                   value={values[k + 1]} onSelect={evt => evt.target.select()}
                                   onChange={evt => onChange(stateNumber, k, parseInt(evt.target.value, 10))}/>
                    </TableCell>
                ))}
                <TableCell padding="dense">
                    <InlineMath>Y</InlineMath>
                    <TextField type="number" className={classes.numberField}
                               value={values[values.length - 1]} onSelect={evt => evt.target.select()}
                               onChange={evt => onChange(stateNumber, inputCount, parseInt(evt.target.value, 10))}/>
                </TableCell>
            </TableRow>
        );
    }
}

InputRow.propTypes = {
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

class InputTable extends React.Component {
    constructor(props) {
        super(props);
        const defaultTable = [
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
            table: defaultTable,
        };
        this.handleNextStateChange = this.handleNextStateChange.bind(this);
    }

    handleStateCountChange(newStateCount) {
        const {table} = this.state;
        const stateCount = table.length;
        const inputCount = table[0].length - 2;
        if (isNaN(newStateCount))
            newStateCount = inputCount;
        else if (newStateCount < 2)
            newStateCount = 2;
        if (newStateCount !== stateCount) {
            const newTable = JSON.parse(JSON.stringify(table));
            if (newStateCount < stateCount) {
                newTable.splice(newStateCount);
                newTable.forEach((row, index, table) => row.forEach((cell, index, row) => {
                    if (cell > table.length)
                        row[index] = table.length;
                }));
            } else if (newStateCount > stateCount) {
                Array.prototype.splice.apply(newTable, [stateCount, 0]
                    .concat(Array.from({length: newStateCount - stateCount},
                        (v, k) => [stateCount + k + 1].concat(new Array(inputCount + 1).fill(1)))));
            }
            this.setState({
                stateCount: newStateCount,
                table: newTable,
            });
        }
    }

    handleInputCountChange(newInputCount) {
        const {table} = this.state;
        const inputCount = table[0].length - 2;
        if (isNaN(newInputCount))
            newInputCount = inputCount;
        else if (newInputCount < 1)
            newInputCount = 1;
        if (newInputCount !== inputCount) {
            const newTable = JSON.parse(JSON.stringify(table));
            if (newInputCount < inputCount)
                newTable.forEach(row => row.splice(newInputCount + 1, inputCount - newInputCount));
            else if (newInputCount > inputCount)
                newTable.forEach(row => Array.prototype.splice.apply(row, [inputCount + 1, 0]
                    .concat(new Array(newInputCount - inputCount).fill(1))));
            this.setState({
                inputCount: newInputCount,
                table: newTable,
            });
        }
    }

    handleNextStateChange(state, input, nextState) {
        const {table} = this.state;
        if (isNaN(nextState))
            nextState = table[state - 1][input + 1];
        else if (nextState > table.length)
            nextState = table.length;
        else if (nextState < 1)
            nextState = 1;
        if (table[state - 1][input + 1] !== nextState) {
            const newTable = JSON.parse(JSON.stringify(table));
            newTable[state - 1][input + 1] = nextState;
            this.setState({
                table: newTable,
            });
        }
    }

    render() {
        const {onSubmit, classes} = this.props;
        const {table} = this.state;
        const stateCount = table.length;
        const inputCount = table[0].length - 2;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="title">
                        Input
                    </Typography>
                    <div className={classes.spacer}/>
                    <TextField label="States" type="number" margin="normal" className={classes.toolbarNumberField}
                               value={stateCount} onSelect={evt => evt.target.select()}
                               onChange={evt => this.handleStateCountChange(parseInt(evt.target.value, 10))}/>
                    <TextField label="Inputs" type="number" margin="normal" className={classes.toolbarNumberField}
                               value={inputCount} onSelect={evt => evt.target.select()}
                               onChange={evt => this.handleInputCountChange(parseInt(evt.target.value, 10))}/>
                    <div className={classes.spacer}/>
                    <Button variant="contained" color="primary"
                            onClick={() => onSubmit(table)}>Reduce</Button>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">State</TableCell>
                            {Array.from({length: inputCount}, (v, k) =>
                                <TableCell key={k.toString()} padding="dense">
                                    <InlineMath>{String.raw`X_${k}`}</InlineMath>
                                </TableCell>
                            )}
                            <TableCell padding="dense">Output</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({length: stateCount}, (v, k) =>
                            <InputRow key={k.toString()}
                                classes={classes}
                                values={table[k]}
                                onChange={this.handleNextStateChange}/>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

InputTable.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

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
        const {states} = this.props;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="title">
                        {states.equivalence}-Distinguishable States
                    </Typography>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">State</TableCell>
                            {Array.from({length: states[0].nextStates.length}, (v, k) =>
                                <TableCell key={k.toString()} padding="dense">
                                    <InlineMath>{String.raw`X_{${k}}`}</InlineMath>
                                </TableCell>
                            )}
                            <TableCell padding="dense">Partition</TableCell>
                            <TableCell padding="dense">Output</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {states.map((state, index, states) =>
                            <TableRow key={state.number.toString()}>
                                <TableCell padding="dense">
                                    <InlineMath>{String.raw`Z_{${state.number}}`}</InlineMath>
                                </TableCell>
                                {state.nextStates.map(state =>
                                    <TableCell key={state.number.toString()} padding="dense">
                                        <InlineMath>{String.raw`Z_{${state.number}} - K_{${state.equivalencePartition}}^{${states.equivalence}}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell padding="dense">
                                    <InlineMath>{String.raw`K_{${state.equivalencePartition}}^{${states.equivalence}}`}</InlineMath>
                                </TableCell>
                                <TableCell padding="dense">
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

EquivalencePartitionTable.propTypes = {
    states: PropTypes.array.isRequired,
};

class StateTransitionTable extends React.Component {
    static reduceStates(states) {
        return Array.from({length: States.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => states.find(state => state.equivalencePartition === equivalencePartition));
    }

    render() {
        const {states} = this.props;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="title">
                        Reduced Machine
                    </Typography>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">State</TableCell>
                            {Array.from({length: states[0].nextStates.length}, (v, k) =>
                                <TableCell key={k.toString()} padding="dense">
                                    <InlineMath>{String.raw`X_{${k}}`}</InlineMath>
                                </TableCell>
                            )}
                            <TableCell padding="dense">Output</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {states.map(state => (
                            <TableRow key={state.number.toString()}>
                                <TableCell padding="dense">
                                    <InlineMath>{String.raw`Z'_{${state.equivalencePartition}}`}</InlineMath>
                                </TableCell>
                                {state.nextStates.map(state =>
                                    <TableCell key={state.number.toString()} padding="dense">
                                        <InlineMath>{String.raw`Z'_{${state.equivalencePartition}}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell padding="dense">
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

StateTransitionTable.propTypes = {
    states: PropTypes.array.isRequired,
};

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
        const reducedStates = StateTransitionTable.reduceStates(reductionSteps[reductionSteps.length - 1]);
        this.setState({
            reductionSteps: reductionSteps,
            reducedStates: reducedStates,
        });
    }

    render() {
        const {classes} = this.props;
        const {reductionSteps, reducedStates} = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <Grid container spacing="16" justify="center">
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
                    <CssBaseline/>
                    <Grid item>
                        <InputTable classes={classes} onSubmit={this.simplify}/>
                    </Grid>
                    {reductionSteps.map(step =>
                        <Grid key={step.equivalence.toString()} item>
                            <EquivalencePartitionTable states={step}/>
                        </Grid>
                    )}
                    {reducedStates === undefined ? undefined :
                        <Grid item>
                            <StateTransitionTable states={reducedStates}/>
                        </Grid>
                    }
                </Grid>
            </MuiThemeProvider>
        );
    }
}

Simplifier.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Simplifier);
