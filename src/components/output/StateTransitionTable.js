import React from 'react';

import PropTypes from 'prop-types';

import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';

import States from '../../utils/States';

const styles = {
    tableWrapper: {
        overflowX: 'auto',
    },
};

class StateTransitionTable extends React.Component {
    render() {
        const {states, classes} = this.props;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="h6">
                        Reduced Machine
                    </Typography>
                </Toolbar>
                <div className={classes.tableWrapper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>State</TableCell>
                                {Array.from({length: states[0].nextStates.length}, (v, k) =>
                                    <TableCell key={k.toString()}>
                                        <InlineMath>{String.raw`X_{${k}}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell>Output</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {states.map(state => (
                                <TableRow key={state.number.toString()}>
                                    <TableCell>
                                        <InlineMath>{String.raw`Z'_{${state.equivalencePartition}}`}</InlineMath>
                                    </TableCell>
                                    {state.nextStates.map((state, index) =>
                                        <TableCell key={index.toString()}>
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
                </div>
            </Paper>
        );
    }
}

StateTransitionTable.propTypes = {
    states: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StateTransitionTable);
