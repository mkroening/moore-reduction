import React from 'react';

import PropTypes from 'prop-types';

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = ({
    tableWrapper: {
        overflowX: 'auto',
    },
    rowGrey: {
        backgroundColor: grey[200],
    },
});

class EquivalencePartitionTable extends React.Component {
    render() {
        const {states, classes} = this.props;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="h6">
                        {states.equivalence}-Distinguishable States
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
                                <TableCell>Partition</TableCell>
                                <TableCell>Output</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {states.map((state, index, states) =>
                                <TableRow className={state.equivalencePartition % 2 === 1 ? classes.rowGrey : null} key={state.number.toString()}>
                                    <TableCell>
                                        <InlineMath>{String.raw`Z_{${state.number}}`}</InlineMath>
                                    </TableCell>
                                    {state.nextStates.map((state, index) =>
                                        <TableCell key={index.toString()}>
                                            <InlineMath>{String.raw`Z_{${state.number}} \text{--} K_{${state.equivalencePartition}}^{${states.equivalence}}`}</InlineMath>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <InlineMath>{String.raw`K_{${state.equivalencePartition}}^{${states.equivalence}}`}</InlineMath>
                                    </TableCell>
                                    <TableCell>
                                        <InlineMath>{String.raw`Y_{${state.output}}`}</InlineMath>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

EquivalencePartitionTable.propTypes = {
    states: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EquivalencePartitionTable);
