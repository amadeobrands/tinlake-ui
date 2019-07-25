import * as React from 'react';
import LoanList from '../../components/LoanList';
import Header from '../../components/Header';
import WithTinlake from '../../components/WithTinlake';
import { Box } from 'grommet';
import Alert from '../../components/Alert';
import Auth from '../../components/Auth';
import { menuItems } from '../../menuItems';

class AdminLoanListPage extends React.Component {
  render() {
    return <Box align="center">
      <Header
        selectedRoute={'/admin'}
        menuItems={menuItems}
        section="ADMIN"
      />
      <Box
        justify="center"
        direction="row"
      >
        <Box width="xlarge" >
          <WithTinlake render={tinlake =>
            <Auth tinlake={tinlake} waitForAuthentication waitForAuthorization
              render={auth => auth.isAdmin ?
                <LoanList tinlake={tinlake} mode="admin" />
                :
                <Alert margin="medium" type="error">
                  Please use an admin account to access this page</Alert>
              } />
          } />
        </Box>
      </Box>
    </Box>;
  }
}

export default AdminLoanListPage;
