import * as React from 'react';
import InvestorView from '../../../containers/Investment/Investor';
import WithTinlake from '../../../components/WithTinlake';
import { Box, Heading, Text } from 'grommet';
import Header from '../../../components/Header';
import { menuItems } from '../../../menuItems';
import SecondaryHeader from '../../../components/SecondaryHeader';
import { BackLink } from '../../../components/BackLink';
import Auth from '../../../components/Auth';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import ContainerWithFooter from '../../../components/ContainerWithFooter';

interface Props extends WithRouterProps {
}

class InvestorPage extends React.Component<Props> {

  render() {
    const { investorAddress }: { investorAddress: string } = this.props.router.query as any;

    return <ContainerWithFooter>
      <Header
        selectedRoute={'/investments/investor'}
        menuItems={menuItems}
      />
      <Box
        justify="center"
        direction="row"
        style={{ flex: 1 }}
      >
        <Box width="xlarge" >
          <WithTinlake render={tinlake =>
            <Auth tinlake={tinlake}
              render={auth =>
                <Box>
                  <SecondaryHeader>
                    <Box direction="row" gap="small" align="center">
                      <BackLink href={'/investments'} />
                      <Box direction="row" gap="small" align="center">
                        <Heading level="3">Investor Details </Heading>
                      </Box>
                      <Box align="end">
                          <Text style={{ color: '#808080' }}> address: {investorAddress}</Text>
                      </Box>

                    </Box>
                  </SecondaryHeader>
                  <InvestorView investorAddress={investorAddress} tinlake={tinlake} auth={auth} />
                </Box>
              } />
          } />
        </Box>
      </Box>
    </ContainerWithFooter>;
  }
}

export default withRouter(InvestorPage);
