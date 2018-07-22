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
                                {state.nextStates.map((state, index) =>
                                    <TableCell key={index.toString()} padding="dense">
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

export default EquivalencePartitionTable;
