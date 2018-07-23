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

const styles = ({
    firstCell: {
        paddingLeft: '2.5%',
    },
});

class StateTransitionTable extends React.Component {
    static reduceStates(states) {
        return Array.from({length: States.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => states.find(state => state.equivalencePartition === equivalencePartition));
    }

    render() {
        const {states, classes} = this.props;
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
                            <TableCell padding="none" className={classes.firstCell}>State</TableCell>
                            {Array.from({length: states[0].nextStates.length}, (v, k) =>
                                <TableCell key={k.toString()} padding="none">
                                    <InlineMath>{String.raw`X_{${k}}`}</InlineMath>
                                </TableCell>
                            )}
                            <TableCell padding="none">Output</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {states.map(state => (
                            <TableRow key={state.number.toString()}>
                                <TableCell padding="none" className={classes.firstCell}>
                                    <InlineMath>{String.raw`Z'_{${state.equivalencePartition}}`}</InlineMath>
                                </TableCell>
                                {state.nextStates.map((state, index) =>
                                    <TableCell key={index.toString()} padding="none">
                                        <InlineMath>{String.raw`Z'_{${state.equivalencePartition}}`}</InlineMath>
                                    </TableCell>
                                )}
                                <TableCell padding="none">
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
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StateTransitionTable);
