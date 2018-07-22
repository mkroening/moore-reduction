import React from 'react';

import 'katex/dist/katex.min.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import EquivalencePartitionTable from './EquivalencePartitionTable';
import InputTable from './InputTable';
import States from './States';
import StateTransitionTable from'./StateTransitionTable'

const theme = createMuiTheme({
    typography: {
        fontSize: 18,
    },
});

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
        const {reductionSteps, reducedStates} = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <Grid container spacing={16} justify="center">
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
                    <CssBaseline/>
                    <Grid item>
                        <InputTable onSubmit={this.simplify}/>
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

export default Simplifier;
