import React from 'react';

import Grid from '@material-ui/core/Grid';

import Layout from '../components/layout';
import InputTable from '../components/input/InputTable';
import States from '../utils/States';
import EquivalencePartitionTable from '../components/output/EquivalencePartitionTable';
import StateTransitionTable from '../components/output/StateTransitionTable';

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
            <Layout>
                <Grid style={{padding: 10}} container spacing={2} alignItems="center" justify="center">
                    <Grid xs item>
                        <InputTable onSubmit={this.simplify}/>
                    </Grid>
                    {reductionSteps.map(step =>
                        <Grid key={step.equivalence.toString()} xs item>
                            <EquivalencePartitionTable states={step}/>
                        </Grid>
                    )}
                    {reducedStates === undefined ? undefined :
                        <Grid xs item>
                            <StateTransitionTable states={reducedStates}/>
                        </Grid>
                    }
                </Grid>
            </Layout>
        );
    }
}

export default Simplifier;
