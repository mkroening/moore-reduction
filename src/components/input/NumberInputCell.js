import React from 'react';

import PropTypes from 'prop-types';

import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = ({
    numberField: {
        width: 40,
    },
    lineSpan: {
        lineHeight: 2.3,
    },
});

const handleSelect = evt => {
    evt.target.select();
};

class NumberInputCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(evt) {
        const {index, onChange} = this.props;
        onChange(index, parseInt(evt.target.value, 10));
    }

    render() {
        const {label, value, classes} = this.props;
        return (
            <TableCell padding="none">
                <span className={classes.lineSpan}>
                    <InlineMath math={label}/>
                </span>
                <TextField type="number" className={classes.numberField}
                    value={value} onSelect={handleSelect}
                    onChange={this.handleChange}
                />
            </TableCell>
        );
    }
}

NumberInputCell.propTypes = {
    label: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NumberInputCell);
