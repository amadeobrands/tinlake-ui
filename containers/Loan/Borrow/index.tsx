import * as React from 'react';
import { Box, FormField, Button, Text } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { borrow } from '../../../services/tinlake/actions';
import { baseToDisplay, displayToBase, Loan } from 'tinlake';
import { transactionSubmitted, responseReceived } from '../../../ducks/transactions';
import { PoolState, loadPool } from '../../../ducks/pool';
import { loadLoan } from '../../../ducks/loans';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';
import BN from 'bn.js';

interface Props {
  loan: Loan;
  tinlake: any;
  loadLoan?: (tinlake: any, loanId: string, refresh?: boolean) => Promise<void>;
  loadPool?: (tinlake: any) => Promise<void>;
  transactionSubmitted?: (loadingMessage: string) => Promise<void>;
  responseReceived?: (successMessage: string | null, errorMessage: string | null) => Promise<void>;
  pool?: PoolState;
}

interface State {
  borrowAmount: string;
}

class LoanBorrow extends React.Component<Props, State> {
  state: State = { borrowAmount: '0' };

  componentDidMount() {
    const { loan, tinlake, loadPool } = this.props;
    this.setState({ borrowAmount: (loan.principal && loan.principal.toString()) || '0' });
    loadPool && loadPool(tinlake);
  }

  borrow = async () => {
    this.props.transactionSubmitted && this.props.transactionSubmitted('Borrowing initiated. Please confirm the pending transactions in MetaMask. Processing may take a few seconds.');
    try {
      await authTinlake();
      const { borrowAmount } = this.state;
      const { loan, tinlake } = this.props;
      const res = await borrow(tinlake, loan, borrowAmount);
      if (res && res.errorMsg) {
        this.props.responseReceived && this.props.responseReceived(null, `Borrowing failed. ${res.errorMsg}`);
        return;
      }
      this.props.responseReceived && this.props.responseReceived('Borrowing successful. Please check your wallet.', null);
      this.props.loadLoan && this.props.loadLoan(tinlake, loan.loanId);
    } catch (e) {
      this.props.responseReceived && this.props.responseReceived(null, `Borrowing failed. ${e}`);
      console.log(e);
    }
  }

  render() {
    const { borrowAmount } = this.state;
    const { loan, pool } = this.props;

    const ceilingSet = loan.principal.toString() !== '0';
    const availableFunds = pool && pool.data && pool.data.availableFunds || '0';
    const ceilingOverflow = new BN(borrowAmount).cmp(new BN(loan.principal)) > 0;
    const availableFundsOverflow = (new BN(borrowAmount).cmp(new BN(availableFunds)) > 0);
    const borrowEnabled = !ceilingOverflow && !availableFundsOverflow && ceilingSet;
    return <Box basis={'1/4'} gap="medium" margin={{ right: 'large' }}>
      <Box gap="medium">
        <FormField label="Borrow amount">
          <NumberInput value={baseToDisplay(borrowAmount, 18)} suffix=" DAI" precision={18}
            onValueChange={({ value }) =>
              this.setState({ borrowAmount: displayToBase(value, 18) })}
          />
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.borrow} primary label="Borrow" disabled={ !borrowEnabled } />
        {availableFundsOverflow &&
          <Box margin={{ top: 'small' }}>
            Available funds exceeded. <br />
            Amount has to be lower then <br />
            <Text weight="bold">
            {`${baseToDisplay(availableFunds, 18)}`}
            </Text>
          </Box>
        }
        {ceilingOverflow && !availableFundsOverflow  &&
          <Box margin={{ top: 'small' }}>
            Max borrow amount exceeded.   <br />
            Amount has to be lower then <br />
            <Text weight="bold">
              {`${baseToDisplay(loan.principal, 18)}`}
            </Text>
          </Box>
        }
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadLoan, transactionSubmitted, responseReceived, loadPool })(LoanBorrow);
