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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';

import InputRow from './InputRow';

const styles = theme => ({
    toolbarNumberField: {
        width: 50,
    },
    spacer: {
        flex: 'auto',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    tableHeadButton: {
        color: theme.palette.primary.dark,
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
        this.handleStateIndexToggle = this.handleStateIndexToggle.bind(this);
        this.handleCellChange = this.handleCellChange.bind(this);
        this.handleStateCountChange = this.handleStateCountChange.bind(this);
        this.handleInputCountChange = this.handleInputCountChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleStateIndexToggle() {
        const {table} = this.state;
        const newTable = table.map(row => row.map((cell, index, row) =>
            index < row.length - 1 ? (table[0][0] === 1 ? cell - 1 : cell + 1) : cell));
        this.setState({
            table: newTable,
        });
    }

    handleStateCountChange(evt) {
        let newStateCount = parseInt(evt.target.value, 10);
        const {table} = this.state;
        const stateCount = table.length;
        const inputCount = table[0].length - 2;
        if (isNaN(newStateCount))
            newStateCount = inputCount;
        else if (newStateCount < 1)
            newStateCount = 1;
        // arbitrary limit to preserve responsiveness
        else if (newStateCount > 20)
            newStateCount = 20;
        if (newStateCount !== stateCount) {
            const newTable = table.map(row => row.slice());
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
        // arbitrary limit to preserve responsiveness
        else if (newInputCount > 10)
            newInputCount = 10;
        if (newInputCount !== inputCount) {
            const newTable = table.map(row => row.slice());
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
        else if (value > table[table.length - 1][0])
            value = table[table.length - 1][0];
        else if (value < table[0][0])
            value = table[0][0];
        if (table[row][column] !== value) {
            const newTable = table.map(row => row.slice());
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
                    <Typography variant="h6">
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
                <div className={classes.tableWrapper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <TableSortLabel hideSortIcon className={classes.tableHeadButton} onClick={this.handleStateIndexToggle}>
                                        States
                                    </TableSortLabel>
                                </TableCell>
                                {Array.from({length: inputCount}, (v, k) =>
                                    <TableCell key={k.toString()} padding="checkbox">
                                        <InlineMath>{String.raw`X_{${k}}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell padding="checkbox">Output</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {table.map((row, index) => (
                                <InputRow key={index.toString()} index={index} values={row} onChange={this.handleCellChange}/>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

InputTable.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputTable);
