import React from 'react';

import PropTypes from 'prop-types';

import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = ({
    numberField: {
        width: 40,
    }
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
                            onChange={evt => onChange(stateNumber, k, parseInt(evt.target.value, 10))}
                        />
                    </TableCell>
                ))}
                <TableCell padding="dense">
                    <InlineMath>Y</InlineMath>
                    <TextField type="number" className={classes.numberField}
                        value={values[values.length - 1]} onSelect={evt => evt.target.select()}
                        onChange={evt => onChange(stateNumber, inputCount, parseInt(evt.target.value, 10))}
                    />
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

export default withStyles(styles)(InputRow);
