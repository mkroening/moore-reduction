import React from 'react';

import PropTypes from 'prop-types';

import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';

import InputRow from './InputRow';

const styles = ({
    toolbarNumberField: {
        width: 50,
    },
    spacer: {
        flex: 'auto',
    },
});

const handleSelect = evt => {
    evt.target.select();
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
        this.handleCellChange = this.handleCellChange.bind(this);
        this.handleStateCountChange = this.handleStateCountChange.bind(this);
        this.handleInputCountChange = this.handleInputCountChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleStateCountChange(evt) {
        let newStateCount = parseInt(evt.target.value, 10);
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

    handleInputCountChange(evt) {
        let newInputCount = parseInt(evt.target.value, 10);
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

    handleCellChange(row, column, value) {
        const {table} = this.state;
        if (isNaN(value))
            value = table[row][column];
        else if (value > table.length)
            value = table.length;
        else if (value < 1)
            value = 1;
        if (table[row][column] !== value) {
            const newTable = JSON.parse(JSON.stringify(table));
            newTable[row][column] = value;
            this.setState({
                table: newTable,
            });
        }
    }

    handleSubmit() {
        const {onSubmit} = this.props;
        const {table} = this.state;
        onSubmit(table);
    }

    render() {
        const {classes} = this.props;
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
                        value={stateCount} onSelect={handleSelect}
                        onChange={this.handleStateCountChange}
                    />
                    <TextField label="Inputs" type="number" margin="normal" className={classes.toolbarNumberField}
                        value={inputCount} onSelect={handleSelect}
                        onChange={this.handleInputCountChange}
                    />
                    <div className={classes.spacer}/>
                    <Button variant="contained" color="primary"
                        onClick={this.handleSubmit}
                    >Reduce</Button>
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
                                index={k}
                                values={table[k]}
                                onChange={this.handleCellChange}
                            />
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

export default withStyles(styles)(InputTable);
